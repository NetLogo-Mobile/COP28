/** Fire: The fire model specific code goes here. */
const LevelName = "fire";
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
    if (await RunReporter("report-burned-trees") == 0) {
        // For acero: Turn this into the real interface. 
        alert("Please click on the trees to start a fire.");
    } else {
        SwitchMode(true);
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
 * Game loop function for running the model
 */
async function GameLoop() {
    CallCommand("go");
    // Check if the game is over
    var finished = await CallReporter("is-finished");
    GetBurnedRatio().then(burnedPercentage => {
        ControlWidget.BurnedVal.text(`${burnedPercentage.toFixed(1)}%`);
    });
    if (finished) {
        // Game is over
        await WaitFor(500);
        SwitchMode(false);
        ResultsTab();
    } else {
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
var Official = [{"x":1,"y":1.11},{"x":2,"y":0.97},{"x":3,"y":0.89},{"x":4,"y":0.87},{"x":5,"y":1.1},{"x":6,"y":0.82},{"x":7,"y":0.87},{"x":8,"y":0.83},{"x":9,"y":0.72},{"x":10,"y":0.86},{"x":11,"y":0.9},{"x":12,"y":0.98},{"x":13,"y":0.93},{"x":14,"y":0.97},{"x":15,"y":0.91},{"x":16,"y":0.84},{"x":17,"y":0.85},{"x":18,"y":1.07},{"x":19,"y":1.02},{"x":20,"y":0.81},{"x":21,"y":0.8},{"x":22,"y":0.91},{"x":23,"y":0.99},{"x":24,"y":0.93},{"x":25,"y":0.94},{"x":26,"y":1.01},{"x":27,"y":1.02},{"x":28,"y":1.1},{"x":29,"y":1.02},{"x":30,"y":1.16},{"x":31,"y":1.08},{"x":32,"y":1.17},{"x":33,"y":1.22},{"x":34,"y":1.18},{"x":35,"y":1.12},{"x":36,"y":1.5},{"x":37,"y":1.34},{"x":38,"y":1.42},{"x":39,"y":1.47},{"x":40,"y":1.52},{"x":41,"y":1.45},{"x":42,"y":1.47},{"x":43,"y":1.79},{"x":44,"y":1.63},{"x":45,"y":1.87},{"x":46,"y":2.17},{"x":47,"y":1.74},{"x":48,"y":2.38},{"x":49,"y":3.84},{"x":50,"y":4.62},{"x":51,"y":3.65},{"x":52,"y":4.43},{"x":53,"y":4.72},{"x":54,"y":8.36},{"x":55,"y":11.93},{"x":56,"y":16.01},{"x":57,"y":15.45},{"x":58,"y":27.04},{"x":59,"y":33.61},{"x":60,"y":58.36},{"x":61,"y":67.95},{"x":62,"y":76.99},{"x":63,"y":80.5},{"x":64,"y":90.5},{"x":65,"y":92.12},{"x":66,"y":93.61},{"x":67,"y":95.73},{"x":68,"y":96.63},{"x":69,"y":96.98},{"x":70,"y":97.6},{"x":71,"y":97.78},{"x":72,"y":98.24},{"x":73,"y":98.64},{"x":74,"y":99.05},{"x":75,"y":99.21},{"x":76,"y":99.36},{"x":77,"y":99.5},{"x":78,"y":99.62},{"x":79,"y":99.63},{"x":80,"y":99.72},{"x":81,"y":99.81},{"x":82,"y":99.73},{"x":83,"y":99.86},{"x":84,"y":99.87},{"x":85,"y":99.91},{"x":86,"y":99.96},{"x":87,"y":99.96},{"x":88,"y":99.96},{"x":89,"y":99.98},{"x":90,"y":99.98},{"x":91,"y":99.99},{"x":92,"y":99.99},{"x":93,"y":100},{"x":94,"y":100},{"x":95,"y":100},{"x":96,"y":100},{"x":97,"y":100},{"x":98,"y":100},{"x":99,"y":100},{"x":100,"y":100}];
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
            SwitchMode(false);
            HideResultTab();
            ResetResultState();
        });

        // Learn more functionality
        $('.results-summary-button:last').on('click', function () {
            HideResultTab();
            ToggleLearnMore(true);
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