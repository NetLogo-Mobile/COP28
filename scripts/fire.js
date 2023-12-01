/** Fire: The fire model specific code goes here. */
const LevelName = "fire";
var state = {isRunning: false};
/**
 * Sets up the model interface and initializes components
 */
function Setup() {
    // Show the model
    ShowModel({
        CurrentDensity: 0,
        DensityLabel: $('.density-label'),
        DensityVal: $('.density-val'),
        BurnedVal: $('.burned-val'),
    });
    // Setup the model
    RunCommand(`resize ${SimulationFrame.clientWidth} ${SimulationFrame.clientHeight}`);
    Click("#netlogo-button-5 input");
    // Define objects
    ShowSlider(SetDensity, 50, 'fire-model');
}

/**
 * Handles the 'run' action of the model
 */
async function HandleRun() {
    if(state.isRunning) return;
    if (await RunReporter("report-burned-trees") == 0) {
        $(".tooltips").show();
    } else {
        state.isRunning = true;
        SwitchMode(state);
        InitializeValues();
        GameLoop();
        // Record the event
        gtag("event", "level_start", {
            level_name: LevelName,
            parameter1: ControlWidget.CurrentDensity,
            parameter2: InitialValues.initialTreesBurned
        });
    }
}

/**
 * Handles the 'stop' action of the model
 */
function HandleStop() {
    if(!state.isRunning) return; // if its not running, do nothing
    state.isRunning = false;
    SwitchMode(state);
}

/**
 * Game loop function for running the model
 */
async function GameLoop() {
    CallCommand("go");
    $(".tooltips").hide();
    // Check if the game is over
    var finished = await CallReporter("is-finished");
    GetBurnedRatio().then(burnedPercentage => {
        ControlWidget.BurnedVal.text(`${burnedPercentage.toFixed(1)}%`);
    });
    if (finished) {
        // Game is over
        await WaitFor(500);
        state.isRunning = false;
        SwitchMode(state);
        ResultsTab();
    } else if(!state.isRunning) {
        // state can only be set to not running if the stop button is pressed or if game is finished
        // if the game is not finished and the state is not running, then the stop button was pressed
        ResultsTab();
    }
    else {
        await WaitFor(20);
        return await GameLoop();
    }
}

/**
 * Sets the density value and updates the related UI components
 * @param {number} value - The density value to set
 */
function SetDensity(value) {
    ControlWidget.DensityLabel.text(`Density: ${value}%`);
    ControlWidget.DensityVal.text(`${value}%`);
    ControlWidget.CurrentDensity = value;
    RunCommand(`set density ${value}`);
    CallCommand("setup");
    var slider = $("input[type='range'].styled-slider");
    slider.css('--value', value);
    slider.val(value);
}

// Initial values
var InitialValues = {};
/**
 * Initializes the initial values for the model
 */
async function InitializeValues() {
    try {
        const initialTreesResult = await RunReporter("report-initial-trees");
        const initialTreesBurnedResult = await RunReporter("report-burned-trees");

        let firesAddedPercentageCalc = (initialTreesBurnedResult / initialTreesResult * 100).toFixed(1);
        InitialValues = {
            initialTrees: initialTreesResult,
            initialTreesBurned: initialTreesBurnedResult,
            firesAddedPercentage: firesAddedPercentageCalc
        };

    } catch (error) {
        console.error('Error occurred while initializing InitialValues:', error);
    }
}

/**
 * Get the burned trees ratio for display
 */
async function GetBurnedRatio() {
    var Burned = await CallReporter("report-burned-trees");
    var Initial = InitialValues.initialTrees - InitialValues.initialTreesBurned;
    if (Initial <= 0) Initial = 1;
    return (Burned - InitialValues.initialTreesBurned) / Initial * 100;
}

var Results = [];
var Estimation = {};
var Official = [{"x":1,"y":0.0},{"x":2,"y":0.0},{"x":3,"y":0.0},{"x":4,"y":0.0},{"x":5,"y":0.0},{"x":6,"y":0.0},{"x":7,"y":0.0},{"x":8,"y":0.0},{"x":9,"y":0.1},{"x":10,"y":0.0},{"x":11,"y":0.1},{"x":12,"y":0.1},{"x":13,"y":0.1},{"x":14,"y":0.1},{"x":15,"y":0.1},{"x":16,"y":0.1},{"x":17,"y":0.1},{"x":18,"y":0.1},{"x":19,"y":0.1},{"x":20,"y":0.1},{"x":21,"y":0.2},{"x":22,"y":0.2},{"x":23,"y":0.2},{"x":24,"y":0.2},{"x":25,"y":0.2},{"x":26,"y":0.2},{"x":27,"y":0.2},{"x":28,"y":0.3},{"x":29,"y":0.3},{"x":30,"y":0.3},{"x":31,"y":0.3},{"x":32,"y":0.4},{"x":33,"y":0.4},{"x":34,"y":0.4},{"x":35,"y":0.4},{"x":36,"y":0.5},{"x":37,"y":0.6},{"x":38,"y":0.6},{"x":39,"y":0.6},{"x":40,"y":0.7},{"x":41,"y":0.7},{"x":42,"y":0.9},{"x":43,"y":0.8},{"x":44,"y":1.0},{"x":45,"y":1.3},{"x":46,"y":1.5},{"x":47,"y":1.7},{"x":48,"y":1.9},{"x":49,"y":2.0},{"x":50,"y":2.8},{"x":51,"y":3.7},{"x":52,"y":4.1},{"x":53,"y":5.4},{"x":54,"y":6.9},{"x":55,"y":10.4},{"x":56,"y":13.9},{"x":57,"y":20.9},{"x":58,"y":29.4},{"x":59,"y":42.6},{"x":60,"y":55.5},{"x":61,"y":69.2},{"x":62,"y":76.2},{"x":63,"y":84.7},{"x":64,"y":88.1},{"x":65,"y":92.1},{"x":66,"y":93.9},{"x":67,"y":95.2},{"x":68,"y":96.3},{"x":69,"y":97.2},{"x":70,"y":97.6},{"x":71,"y":98.1},{"x":72,"y":98.5},{"x":73,"y":98.8},{"x":74,"y":99.0},{"x":75,"y":99.1},{"x":76,"y":99.3},{"x":77,"y":99.5},{"x":78,"y":99.5},{"x":79,"y":99.6},{"x":80,"y":99.7},{"x":81,"y":99.8},{"x":82,"y":99.8},{"x":83,"y":99.9},{"x":84,"y":99.9},{"x":85,"y":99.9},{"x":86,"y":99.9},{"x":87,"y":100.0},{"x":88,"y":100.0},{"x":89,"y":100.0},{"x":90,"y":100.0},{"x":91,"y":100.0},{"x":92,"y":100.0},{"x":93,"y":100.0},{"x":94,"y":100.0},{"x":95,"y":100.0},{"x":96,"y":100.0},{"x":97,"y":100.0},{"x":98,"y":100.0},{"x":99,"y":100.0},{"x":100,"y":100.0}];
/**
 * Displays the results tab with model statistics
 */
function ResultsTab() {
    GetBurnedRatio().then(BurnedTrees => {
        // Show the results tab
        ShowResultTab();
        // Update texts where necessary
        let Density = ControlWidget.CurrentDensity;
        let FiresAdded = (InitialValues.initialTreesBurned / InitialValues.initialTrees * 100).toFixed(1);
        let FireAddedLabel = GetResultLabel(0);
        let TreeDensityLabel = GetResultLabel(1);
        let BurnedLabel = GetResultLabel(2);
        TreeDensityLabel.text(`${Density}%`);
        FireAddedLabel.text(`${FiresAdded}%`);
        BurnedLabel.text(`${BurnedTrees.toFixed(1)}%`);
        // Record the event
        gtag("event", "level_end", {
            level_name: LevelName,
            parameter1: Density,
            parameter2: InitialValues.initialTreesBurned,
            result1: BurnedTrees,
            success: true
        });
        // Record the data
        Results.push({ x: Density, y: BurnedTrees });
        if (typeof(Estimation[Density]) == 'undefined')
            Estimation[Density] = { Count: 0, Sum: 0 };
        Estimation[Density].Count++;
        Estimation[Density].Sum += parseFloat(BurnedTrees);
        // Plot the data
        setTimeout(PlotResults, 100);
        // Try again button functionality
        $('.results-summary-button:first').on('click', function () {
            SetDensity(Density);
            state.isRunning = false;
            SwitchMode(state);
            HideResultTab();
            ResetResultState();
        });
        // Learn more functionality
        $('.results-summary-button:last').on('click', function () {
            SetDensity(Density);
            HideResultTab();
            ToggleLearnMore(true);
            $('.go-back-btn').hide();
        });
    });
}

/** 
 * Plot the results
 */
function PlotResults() {
    // Calculate the estimation
    var Estimated = [];
    for (var Key in Estimation) {
        Estimated.push({ x: Key, y: Estimation[Key].Sum / Estimation[Key].Count });
    }
    Estimated.sort((a, b) => a.x - b.x);
    // Generate the series
    var Series = [{
        name: 'series-reference',
        data: Official
    }, {
        name: 'series-estimation',
        data: Estimated
    }, {
        name: 'series-player',
        data: Results
    }];
    // Plot the player's results
    new Chartist.Line('.plot-container', {
        series: Series
    }, {
        series: {
          'series-player': {
            showLine: false,
            showPoint: true
          },
          'series-estimation': {
            showLine: Results.length >= 5,
            showPoint: false,
            lineSmooth: Chartist.Interpolation.cardinal({
              fillHoles: true,
            }),
          },
          'series-reference': {
            showLine: true,
            showPoint: false
          }
        },
        axisX: {
            type: Chartist.FixedScaleAxis,
            low: 0,
            high: 100,
            divisor: 5,
            onlyInteger: true,
            labelInterpolationFnc: (Value) => Value + "%" // Add percentage sign
        },
        axisY: {
            type: Chartist.FixedScaleAxis,
            low: 0,
            high: 100,
            divisor: 5,
            onlyInteger: true,
            labelInterpolationFnc: (Value) => Value + "%" // Add percentage sign
        }
    });
}

/** 
 * Plot the reference results
 */
function ShowReference() {
    $(".ct-series-a").css("opacity", 0.5);
}

// Metadata for Introduction
const IntroMetadata =
    [
        {
            img: "assets/fire.png",
            title: "CONTEXT",
            description:
                "As the global temperature goes up, forest fires are becoming increasingly destructive. It is important to understand how they spread.",
        },
        {
            img: "assets/burning_far_2.gif",
            title: "WHAT IS IT?",
            description:
                "In this simple simulation, the forest is modeled as a grid of trees and empty spots. We’ll explore how the density of trees affects fire spread.",
        },
        {
            img: "assets/burning_close.gif",
            title: "HOW DOES IT WORK?",
            description:
                "Each step, fires spread to neighboring trees and then burn out.",
            buttonText: "GET STARTED",
        },
    ];