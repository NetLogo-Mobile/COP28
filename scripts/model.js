/** Model: All model-general code goes here. */

/** The model interaction */
/** WaitFor: A helper for Async Timeout. */
const WaitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

/** Load the simulation & window */
var Simulation = null;
var Handlers = {};
var SimulationFrame = document.getElementById("simulation");
SimulationFrame.onload = () => { 
    Simulation = SimulationFrame.contentWindow; 
};

/** Click a Button */
function Click(Selector) {
    Simulation.postMessage({
        sender: "Click",
        selector: Selector
    })
}
/** Call a Command */
function CallCommand(Command) {
    Simulation.postMessage({
        sender: "CallCommand",
        command: Command,
    }, "*");
}
/** Call a Reporter */
function CallReporter(Reporter) {
    return CallWithCallback({
        sender: "CallReporter",
        command: Reporter
    });
}
/** Run a Reporter Statement */
function RunReporter(Statement) {
    return CallWithCallback({
        sender: "RunReporter",
        command: Statement
    });
}
/** Export the Canvas */
function ExportCanvas() {
    return CallWithCallback({
        sender: "ExportCanvas"
    });
}
/** Call a Something with Callback */
function CallWithCallback(Data) {
    var Handler = new Promise((resolve, reject) => {
        Data.id = "handler" + Math.random();
        Simulation.postMessage(Data, "*")
        Handlers[Data.id] = resolve;
    });
    return Handler;
}
/** Run a Command Statement */
function RunCommand(Statement) {
    Simulation.postMessage({
        sender: "RunCommand",
        command: Statement,
    }, "*");
}

/** Taking messages from the simulation iFrame */
window.addEventListener("message", (event) => {
    if (!event.data || !event.data.id) return;
    Handlers[event.data.id](event.data.result);
    delete Handlers[event.data.id];
});

/** The controlling interface */
// The control widget
var ControlWidget;
/**
 * Hide the Introduction and show the model
 */
function ShowModel(Widgets) {
    // Show and hide
    $('#intro').hide();
    $('.model-container').removeClass('invisible-element');
    $(".container").addClass("no-padding");
    $(".play-container").on("click", HandleRun);
    // Define objects
    ControlWidget = Widgets;
    Widgets.Slider = $('.styled-slider');
    // Switch the mode
    SwitchMode(false);
}
/**
 * Switches the mode of the application between running and not running
 * @param {boolean} isRunning - Indicates whether the model is running
 */
function SwitchMode(isRunning) {
    $(".slider-label-container").toggle(!isRunning);
    $(".running-model-stats").toggle(isRunning);
}
/**
 * Initializes and shows the parameter slider
 */
function ShowSlider(Callback, DefaultValue) {
    ControlWidget.Slider.on('input', function() {
        var value = $(this).val();
        $(this).css('--value', value);
        Callback(value);
    });
    Callback(DefaultValue);
}

/** The result interface */
/**
 * Shows the results tab
 */
function ShowResultTab() {
    $('.container').css('pointer-events', 'none');
    $('.results-container').removeClass('invisible-element');
    InitializeDragging();
    ExportCanvas().then(Data => {
        $('.results-img img').attr("src", Data);
    });
}
/**
 * Hides the results tab
 */
function HideResultTab() {
    $('.container').css('pointer-events', 'auto');
    $('.results-container').addClass('invisible-element');
    resetResultState();
}

/* resetStateAndStyles: resets result page back, should be called after leaving the results page */
function resetResultState() {
    //reset styles 
    $('.sliding-window')[0].style.transform = 'translateX(0px)';
    $('.results-summary-button')[1].style.transform = 'translateY(0px)';
    $('.results-summary-button')[1].classList.add('no-visibility');
}

/**
 * Gets the label of a result widget
 */
function GetResultLabel(Index) {
    return $('.results-model-stats').eq(Index).find("span.stats-val-bottom-text");
}
/**
 * Initializes the dragging functionality
 */
function InitializeDragging() {
    // Cache DOM selectors
    const draggableElement = $('.sliding-window')[0];
    const learnMore = $('.results-summary-button')[1];
    const resultsSummaryContainer = $('.results-summary-container');
    const resultPageLen = resultsSummaryContainer.outerWidth() + 10;
    const dragThreshold = resultsSummaryContainer.outerWidth() / 2.3;
    let btnHeight = $('.results-summary-button').outerHeight(true);

    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let pageIndex = 0;
    let resetX = 0;
    const animationTimingFunction = "ease-out";
    const animationDuration = "100ms";
    const throttledDragging = throttle(dragging, 50); 

    // Adding event listeners
    draggableElement.addEventListener('mousedown', startDrag);
    draggableElement.addEventListener('touchstart', startDrag);
    document.addEventListener('mousemove', throttledDragging);
    document.addEventListener('touchmove', throttledDragging);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    showLearnMore(0);

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        learnMore.classList.remove('no-visibility');

        if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
        } else {
            startX = e.clientX;
        }
    }

    function dragging(e) {
        if (!isDragging) return;
        e.preventDefault();
        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX;
        } else {
            currentX = e.clientX;
        }
        let distanceX = currentX - startX;
        if(pageIndex == 0) {
            distanceX = distanceX > 0 ? 0 : distanceX;
            draggableElement.style.transform = `translateX(${distanceX}px)`;
            showLearnMore(Math.abs(distanceX / resultPageLen));
        }
        else if(pageIndex == 1) {
            distanceX = distanceX < 0 ? 0 : distanceX;
            draggableElement.style.transform = `translateX(${distanceX - resultPageLen}px)`;
            showLearnMore(distanceX / resultPageLen);
        }
    }

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        const distanceX = currentX - startX;
        learnMore.classList.add('no-visibility');

        if (Math.abs(distanceX) >= dragThreshold) {
            shiftPage(distanceX);
        } else {
            navigateAndAnimate(resetX);
            showLearnMore(0);
        }
    }

    // shiftPage: shifts the page to destPage & updates
    function shiftPage(dragDistance) {
        // check if drag is right direction:
        if(dragDistance < 0 && pageIndex == 0) {
            navigateAndAnimate(-resultPageLen);
            showLearnMore(1);
            // set index to next page
            pageIndex = 1;
            learnMore.classList.remove('no-visibility');
            resetX = -resultPageLen;
        }
        else if(dragDistance > 0 && pageIndex == 1) {
            navigateAndAnimate(0);
            showLearnMore(1);
            // set index to next page
            pageIndex = 0;
            learnMore.classList.add('no-visibility');
            resetX = 0;
        }
    }

    /* show the learn more button as a function of percent (For opacity and location) */
    function showLearnMore(percent) {
        // percent for drag can be greater than 1 if dragged past page 1
        if(percent > 1) {
            percent = 1;
        }
        // opacity 
        if(pageIndex == 0) {
            learnMore.style.opacity = percent;
        } else {
            learnMore.style.opacity = 1 - percent; // pageIndex1 goes the other way;
        }
        // translate learnMore
        learnMore.style.transition = `transform ${animationDuration} ${animationTimingFunction}`;
        if(pageIndex == 0) {
            learnMore.style.transform = `translateY(-${btnHeight * (1 - percent)}px)`;
        }else {
            // page is 1 
            learnMore.style.transform = `translateY(-${btnHeight * (percent)}px)`;
        }
    }

    function navigateAndAnimate(translateDist) {
        draggableElement.style.transition = `transform ${animationDuration} ${animationTimingFunction}`;
        draggableElement.style.transform = `translateX(${translateDist}px)`;
    }
}