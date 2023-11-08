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
        // game is over
        await WaitFor(500);
        // resultsTab();
    } else {
        await WaitFor(20);
        return await GameLoop();
    }
}

// globals so we don't have to scan the DOM every time 
var iframe_document = $("#simulation").contents();
var densityLabel;
var currentDensity;
var initialTrees;
var initialTreesBurned;
let screenWidth, screenHeight, iframeWidth, iframeHeight;

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
            RunReporter("report-burned-trees").then(burnedTrees => {
                initialTreesBurned = burnedTrees;
                // Now start the simulation
                GameLoop();
            });
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

function resultsTab() {
    // blur background, not selectable 
    $('.container').css('pointer-events', 'none');
    // create new div
    console.log('results');
    console.log('results');
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
            }).append(
                $('<div/>', {
                    class: 'results-summary-container bordered'
                }).append(
                    $('<span/>', {
                        class: 'results-summary-title',
                        text: 'RESULTS'
                    }),
                    resultsSummaryStatsContainer 
                )
            );
        
            let densityDisplayResult = $('<div/>', {
                class: 'results-model-stats not-selectable', 
                css: { backgroundColor: '#32D583', color: '#FCFCFD' }
            }).append($('<img/>', {
                class: 'results-model-stats-icon', 
                src: '../assets/ChartPieSliceWhite.svg'
            }));
            
            let densityValContainerResult = $('<div/>', {
                class: 'stats-val-container not-selectable'
            }).append($('<span/>', {
                text: 'The density of the trees: ',
                class: 'stats-val-top-text not-selectable',
            }), $('<span/>', {
                text: `${currentDensity}%`,
                class: 'stats-val-bottom-text not-selectable',
            }));
            
            densityDisplayResult.append(densityValContainerResult);
            
            let burnedLabelResult = $('<div/>', {
                class: 'results-model-stats not-selectable',
                css: { backgroundColor: '#F04438', color: '#FCFCFD'}
            }).append($('<img/>', {
                class: 'results-model-stats-icon',
                src: '../assets/FireSimple.svg'
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
                src: '../assets/amountBurned.svg'
            }), $('<div/>', {
                class: 'stats-val-container not-selectable',
            }).append($('<span/>', {
                class: 'stats-val-top-text not-selectable',
                text: 'The percentage of trees burned:'
            }), $('<span/>', {
                class: 'stats-val-bottom-text not-selectable',
                text: `${burnedTreesPercentage}%` 
            })));
            
            resultsSummaryStatsContainer.append(burnedLabelResult, densityDisplayResult, percentBurnedStatsContainer);
            $('body').append(resultsContainer);
        });
    });

}

function convertToNetLogoCoords(x, y, screenWidth, screenHeight, iframeWidth, iframeHeight) {
    let netLogoX = x * (screenWidth / iframeWidth);
    let netLogoY = (1 - (y / iframeHeight)) * screenHeight;

    return { x: Math.floor(netLogoX), y: Math.floor(netLogoY) };
}

function addFires(event) {
    if (screenWidth && screenHeight) {
        let netlogoCoords = convertToNetLogoCoords(event.pageX, event.pageY, screenWidth, screenHeight, iframeWidth, iframeHeight);
        RunCommand(`ask patches with [distancexy ${netlogoCoords.x} ${netlogoCoords.y} <= 5] [ ignite ]`);
    } else {
        console.log("Waiting for world dimensions...");
    }
}

function setup(parent) {
    $('#intro').remove();
    $('.model-container').removeClass('invisible-element');
    iframe_document.find("#netlogo-model-container").remove();
    $(".container").addClass("no-padding");
    controlWidget(parent);
    setDensity(50);

    RunReporter('world-width').then(width => screenWidth = width);
    RunReporter('world-height').then(height => screenHeight = height);

    iframeWidth = iframe_document.find("canvas").width();
    iframeHeight = iframe_document.find("canvas").height();

    iframe_document.on('click', addFires);  
}



