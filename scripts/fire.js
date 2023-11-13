/** Fire: The fire model specific code goes here. */
async function GameLoop() {
    CallCommand("go");
    var Finished = await CallReporter("is-finished");
    // can probably make this better by not running it per call since it doesn't change 
    var initialTreesValue = await RunReporter("report-initial-trees");
    RunReporter("report-burned-trees").then(burnedTreesValue => {
        let burnedPercentage = (burnedTreesValue / initialTreesValue) * 100;
        $('#burned-val').text(`${burnedPercentage.toFixed(1)}%`);
    })
    if (Finished) {
        // game is over
        await WaitFor(500);
        switchMode(false);
        resultsTab();
    } else {
        await WaitFor(20);
        return await GameLoop();
    }
}

// globals so we don't have to scan the DOM every time 
var densityLabel;
var currentDensity;
var initialTrees;
var initialTreesBurned;

// changes the control widget when running 
function runningModelDisplay() {
    // create the running model stat display
    let densityDisplay = $('<div/>', {
        class: 'running-model-stats not-selectable',
        css: { backgroundColor: '#32D583', color: '#FCFCFD' }
    }).append($('<img/>', {
        class: 'running-model-stats-icon',
        src: './assets/ChartPieSlice.svg'
    }));

    // create density display stats 
    let densityValContainer = $('<div/>', {
        class: 'stats-val-container not-selectable'
    }).append($('<span/>', {
        text: 'Density',
        class: 'stats-val-top-text not-selectable',
    }), $('<span/>', {
        text: `50%`,
        id: 'density-val',
        class: 'stats-val-bottom-text not-selectable',
    })); 

    densityDisplay.append(densityValContainer);

    // create the burned label
    let burnedLabel = $('<div/>', {
        class: 'running-model-stats not-selectable',
        css: { backgroundColor: '#F04438' }
    }).append($('<img/>', {
        class: 'running-model-stats-icon',
        src: './assets/FireSimple.svg',
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
function controlWidget() {
    let widgetContainer = $('<div/>', { class: 'control-widget-container' });
    let button = $('<div/>', { class: 'control-widget-play-container' })
        .append($('<img/>', {
            src: './assets/ArrowCounterClockwise.svg',
            class: 'control-widget-play'
        })).on('click', function () {
            switchMode(true);
            $("#density-val").text(`${currentDensity}%`);
            RunReporter("report-burned-trees").then(burnedTrees => {
                initialTreesBurned = burnedTrees;
                // Now start the simulation
                GameLoop();
            });
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
    $('.model-container').append(widgetContainer);
}
controlWidget();
runningModelDisplay();

function switchMode(isRunning) {
    $(".slider-label-container").toggle(!isRunning);
    $(".running-model-stats").toggle(isRunning);
}

function resultsTab() {
    // blur background, not selectable 
    $('.container').css('pointer-events', 'none');
    // create new div
    let resultsSummaryStatsContainer = $('<div/>', {
        class: 'results-summary-stats-container'
    });
    
    // create results-stats-summary
    console.log(`Density: ${currentDensity}%`);
    
    RunReporter("report-initial-trees").then(initialTrees => {

        let firesAddedPercentage = (initialTreesBurned / initialTrees * 100).toFixed(1);
        console.log(`Percentage of Fires Added: ${firesAddedPercentage}%`);
        RunReporter("report-burned-trees").then(burnedTrees => {
            let burnedTreesPercentage = (burnedTrees / initialTrees * 100).toFixed(1);
            console.log(`Percentage of Trees Burned: ${burnedTreesPercentage}%`);

        let resultsContainer = $('<div/>', {
            class: 'results-container not-selectable'
        });

        let resultsSummaryContainer = $('<div/>', {
            class: 'results-summary-container bordered'
        });

        let resultsSummaryTitle = $('<span/>', {
            class: 'results-summary-title',
            text: 'RESULTS'
        });

        resultsSummaryContainer.append(resultsSummaryTitle);

        if (resultsSummaryStatsContainer) {
            resultsSummaryContainer.append(resultsSummaryStatsContainer);
        }
        resultsContainer.append(resultsSummaryContainer);
        
        let densityLabelResult = $('<div/>', {
            class: 'results-model-stats not-selectable',
            css: { backgroundColor: '#32D583', color: '#FCFCFD'}
        }).append($('<img/>', {
            class: 'results-model-stats-icon',
            src: './assets/ChartPieSlice.svg',
        }));
        
        let densityValContainerResult = $('<div/>', {
            class: 'stats-val-container not-selectable',
        }).append($('<span/>', {
            class: 'stats-val-top-text not-selectable',
            text: 'The density of the trees:'
        }), $('<span/>', {
            class: 'stats-val-bottom-text not-selectable',
            id: 'density-val-result', 
            text: `${currentDensity}%`,
        }));
        
        
        densityLabelResult.append(densityValContainerResult);
        
        let burnedLabelResult = $('<div/>', {
            class: 'results-model-stats not-selectable',
            css: { backgroundColor: '#F04438', color: '#FCFCFD'}
        }).append($('<img/>', {
            class: 'results-model-stats-icon',
            src: './assets/FireSimple.svg',
        }));
        
        let burnedValContainerResult = $('<div/>', {
            class: 'stats-val-container not-selectable',
        }).append($('<span/>', {
            class: 'stats-val-top-text not-selectable',
            text: 'The percentage of fire added:'
        }), $('<span/>', {
            class: 'stats-val-bottom-text not-selectable',
            id: 'burned-val-result', 
            text: `${firesAddedPercentage}%`,
        }));
        
        burnedLabelResult.append(burnedValContainerResult);

        let percentBurnedStatsContainer = $('<div/>', {
            class: 'results-model-stats not-selectable',
            css: { backgroundColor: '#6941C6', color: '#FCFCFD'} 
        }).append($('<img/>', {
            class: 'results-model-stats-icon',
            src: './assets/amountBurned.svg',
            style: 'margin-left: 8%'
        }), $('<div/>', {
            class: 'stats-val-container not-selectable',
        }).append($('<span/>', {
            class: 'stats-val-top-text not-selectable',
            text: 'The percentage of trees burned:'
        }), $('<span/>', {
            class: 'stats-val-bottom-text not-selectable',
            text: `${burnedTreesPercentage}%` 
        })));
        
        resultsSummaryStatsContainer.append(burnedLabelResult, densityLabelResult, percentBurnedStatsContainer);

        resultsSummaryContainer.append($('<span/>', {
            text: `“Swipe to see detail stats. Note that different distribution of trees might result in different burnt ratio. Try adjusting density value or add more trees.”`,
            class: 'results-summary-tip'
        }))

        $('body').append(resultsContainer);
        // try again
        resultsContainer.append($('<button/>', {
        class: 'results-summary-button',
        text: 'TRY AGAIN'
    }).on('click', function () {        
        setDensity(currentDensity);
        switchMode(false);
        resultsContainer.remove();
        $('.container').css('pointer-events', 'auto');
    }));
        });
    });
}

function setup(parent) {
    $('#intro').remove();
    $('.model-container').removeClass('invisible-element');
    $(".container").addClass("no-padding");
    RunCommand(`resize ${SimulationFrame.clientWidth} ${SimulationFrame.clientHeight}`);
    setDensity(50);
    switchMode(false);
    Click("#netlogo-button-5 input");
}