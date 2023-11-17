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


function setDensity(value) {
    densityLabel.text(`Density: ${value}%`);
    currentDensity = value;
    RunCommand(`set density ${value}`);
    CallCommand("setup");
}

function switchMode(isRunning) {
    $(".slider-label-container").toggle(!isRunning);
    $(".running-model-stats").toggle(isRunning);
}

function handleRun() {
    switchMode(true);
    $("#density-val").text(`${currentDensity}%`);
    RunReporter("report-burned-trees").then(burnedTrees => {
        initialTreesBurned = burnedTrees;
        // Now start the simulation
        GameLoop();
    });
}

function showSlider() {
    // for the slider 
    $('.styled-slider').on('input', function() {
        var value = $(this).val();
        $(this).css('--value', value);
        setDensity(value);
    });

    densityLabel = $('.density-label');
}

function resultsTab() {
    // blur background, not selectable 
    $('.container').css('pointer-events', 'none');
    // create new div
    let resultsSummaryStatsContainer = $('<div/>', {
        class: 'results-summary-stats-container'
    });
    
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

function setup() {
    $('#intro').remove();
    $('.model-container').removeClass('invisible-element');
    $(".container").addClass("no-padding");
    RunCommand(`resize ${SimulationFrame.clientWidth} ${SimulationFrame.clientHeight}`);
    showSlider();
    setDensity(50);
    switchMode(false);
    Click("#netlogo-button-5 input");
}