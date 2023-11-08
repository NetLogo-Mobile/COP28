/** Fire: The fire model specific code goes here. */
async function GameLoop() {
    CallCommand("go");
    var Fires = await RunReporter("count fires");
    // can probably make this better by not running it per call since it doesn't change 
    var initialTreesValue = await RunReporter("report-initial-trees");
    RunReporter("report-burned-trees").then(burnedTreesValue => {
        let burnedPercentage = (burnedTreesValue / initialTreesValue) * 100;
        $('#burned-val').text(`${burnedPercentage.toFixed(1)}%`);
    })
    if (Fires == 0) {
        alert("Game Over!"); // The game ends
    } else {
        return await GameLoop();
    }
}

// globals so we don't have to scan the DOM every time 
var iframe_document = $("#simulation").contents();
var densityLabel;
var currentDensity;
var initialTrees;

// changes the control widget when running 
function runningModelDisplay() {
    $('.slider-label-container').empty(); // Remove slider label container
    // create the running model stat display
    let densityDisplay = $('<div/>', {
        class: 'running-model-stats not-selectable',
        css: { backgroundColor: '#32D583', color: '#FCFCFD' }
    }).append($('<img/>', {
        class: 'running-model-stats-icon',
        src: '../assets/ChartPieSliceWhite.svg'
    }));

    // create density display stats 
    let densityValContainer = $('<div/>', {
        class: 'stats-val-container not-selectable'
    }).append($('<span/>', {
        text: 'Density',
        class: 'stats-val-top-text not-selectable',
    }), $('<span/>', {
        text: `${currentDensity}%`,
        class: 'stats-val-bottom-text not-selectable',
    })); 

    densityDisplay.append(densityValContainer);

    // create the burned label
    let burnedLabel = $('<div/>', {
        class: 'running-model-stats not-selectable',
        css: { backgroundColor: '#F04438' }
    }).append($('<img/>', {
        class: 'running-model-stats-icon',
        src: '../assets/FireSimple.svg'
    }));

    // create burn display stats
    let burnedValContainer = $('<div/>', {
        class: 'stats-val-container not-selectable'
    }).append($('<span/>', {
        class: 'stats-val-top-text not-selectable',
        text: 'Burned'
    }), $('<span/>', {
        class: 'stats-val-bottom-text not-selectable',
        id: 'burned-val',
        text: '50%'
    }));

    burnedLabel.append(burnedValContainer);

    $('.control-widget-container').append(densityDisplay, burnedLabel);
}

function setDensity(value) {
    densityLabel.text(`Density: ${value}%`);
    currentDensity = value;
    RunCommand(`set density ${value}`);
    CallCommand("setup");
}

/* controlSlider: Creates the slider for the control widget of the game */
function controlSlider(parent) {
    var slider = $('<input/>', {
        type: 'range',
        class: 'styled-slider slider-progress',
        min: '0',
        max: '100',
        value: '50',
        css: {
            '--value': '50',
            '--min': '0',
            '--max': '100'
        }
    }).on('input', function () {
        $(this).css('--value', $(this).val());
        setDensity($(this).val());
    });

    parent.append(slider);
}

/* controlWidget: Creates the control widget for the game */
function controlWidget(parent) {
    let widgetContainer = $('<div/>', { class: 'control-widget-container' });
    let button = $('<div/>', { class: 'control-widget-play-container' })
        .append($('<img/>', {
            src: '../assets/ArrowCounterClockwise.svg',
            class: 'control-widget-play'
        })).on('click', function () {
            GameLoop();
            runningModelDisplay();
        });

    densityLabel = $('<span/>', { class: 'density-label not-selectable', text: 'Density' });
    let tooltipLabel = $('<span/>', {
        class: 'tooltip-label not-selectable',
        text: 'Drag to change the density'
    });
    let sliderLabelContainer = $('<div/>', { class: 'slider-label-container' })
        .append(densityLabel, tooltipLabel);

    controlSlider(sliderLabelContainer);
    widgetContainer.append(button, sliderLabelContainer);
    $(parent).append(widgetContainer);
}

function setup(parent) {
    $('#intro').remove();
    $('.model-container').removeClass('invisible-element');
    $(".container").addClass("no-padding");
    iframe_document.find("#netlogo-model-container");
    controlWidget(parent);
    setDensity(50);
    iframe_document.find("input[type=checkbox]").eq(1).click(); // Turn on add fire
}
