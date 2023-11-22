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
}
/**
 * Hides the results tab
 */
function HideResultTab() {
    $('.container').css('pointer-events', 'auto');
    $('.results-container').addClass('invisible-element');
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
    const draggableElement = $('.sliding-window')[0];
    let isDragging = false;

    draggableElement.addEventListener('mousedown', startDrag);
    draggableElement.addEventListener('touchstart', startDrag);
    document.addEventListener('mousemove', dragging);
    document.addEventListener('touchmove', dragging);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    const animationTimingFunction = "ease-out";
    const animationDuration = "300ms";

    let startX = 0;
    let currentX = 0;
    let pageIndex = 0;

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;

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

        const distanceX = currentX - startX;
        draggableElement.style.transform = `translateX(${distanceX}px)`;
    }

    function endDrag(e) {
        if (!isDragging) return;

        isDragging = false;
        const distanceX = currentX - startX;
        console.log(distanceX);
        const dragThreshold = 70; 

        if (Math.abs(distanceX) >= dragThreshold) {
            navigateAndAnimate();
            shiftPage(distanceX);
        } else {
            draggableElement.style.transform = 'translateX(0)';
        }
    }

    // shiftPage: shifts the page to destPage
    function shiftPage(dragDistance) {
        // get length of resultPage 
        const resultPageLen = $('.results-summary-container').outerWidth();
        console.log(dragDistance);
        // check if drag is right direction:
        if(dragDistance < 0 && pageIndex == 0) {
            draggableElement.style.transition = `transform ${animationDuration} ${animationTimingFunction}`;
            draggableElement.style.transform = `translateX(${-resultPageLen}px)`;
            // set index to next page
            pageIndex = 1;
        }
        else if(dragDistance > 0 && pageIndex == 1) {
            draggableElement.style.transition = `transform ${animationDuration} ${animationTimingFunction}`;
            draggableElement.style.transform = `translateX(${0}px)`;
            // set index to next page
            pageIndex = 0;
        }
    }

    function navigateAndAnimate() {
        draggableElement.style.transition = `transform ${animationDuration} ${animationTimingFunction}`;
        draggableElement.style.transform = 'translateX(0)'; 
    }
}