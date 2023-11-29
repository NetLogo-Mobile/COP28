/** Predation: The predation model specific code goes here. */
var MiniPlot, Series;
/**
 * Sets up the model interface and initializes components
 */
function Setup() {
    // Show the model
    ShowModel({
        Regrowth: 0,
        RegrowthLabel: $('.regrowth-label'),
        PlotContainer: $('.miniplot-container'),
    });
    // Setup the model
    RunCommand(`resize ${SimulationFrame.clientWidth} ${SimulationFrame.clientHeight}`);
    // Define objects
    ShowSlider(SetRegrowth, 50, 'predation-model');
    // Plotting
    Series = [{
        name: 'series-sheep',
        data: []
    }, {
        name: 'series-wolves',
        data: []
    }];
    MiniPlot = new Chartist.Line('.miniplot-container', {
        series: Series
    }, {
        showPoint: false,
        showLine: true,
        axisX: {
            type: Chartist.AutoScaleAxis,
            low: 0,
            referenceValue: 100,
            divisor: 5,
            onlyInteger: true,
            showLabel: false,
            offset: 0,
            labelInterpolationFnc: (Value) => Value
        },
        axisY: {
            type: Chartist.AutoScaleAxis,
            low: 0,
            divisor: 5,
            onlyInteger: true,
            showLabel: false,
            offset: 0,
            labelInterpolationFnc: (Value) => Value
        },
        chartPadding: 2
    });
}

/**
 * Handles the 'run' action of the model
 */
async function HandleRun() {
    SwitchMode(true);
    GameLoop();
}

/**
 * Game loop function for running the model
 */
async function GameLoop() {
    CallCommand("go");
    // Check if the game is over
    var finished = await CallReporter("is-finished");
    if (finished) {
        // Game is over
        await WaitFor(500);
        SwitchMode(false);
        ResultsTab();
    } else {
        // Plotting
        var Count = await GetCount();
        Series[0].data.push({ x: Count[0], y: Count[1] });
        Series[1].data.push({ x: Count[0], y: Count[2] });
        MiniPlot.update({
            series: Series
        });
        await WaitFor(10);
        return await GameLoop();
    }
}

/**
 * Sets the %-similar-Regrowth value and updates the related UI components
 * @param {number} value - The % value to set
 */
function SetRegrowth(value) {
    ControlWidget.RegrowthLabel.text(`Regrowth Time: ${value}`);
    ControlWidget.CurrentRegrowth = value;
    RunCommand(`set grass-regrowth-time ${value}`);
}

/**
 * Get the wolves/sheep count for display
 */
async function GetCount() {
    return await CallReporter("get-count");
}

/**
 * Get the wolves/sheep count for display
 */
async function GetFinalCount() {
    return await CallReporter("get-final-count");
}

var ResultsS = [];
var ResultsW = [];
var EstimationS = {};
var EstimationW = {};
var OfficialS = [{"x":1,"y":1.11},{"x":2,"y":0.97},{"x":3,"y":0.89},{"x":4,"y":0.87},{"x":5,"y":1.1},{"x":6,"y":0.82},{"x":7,"y":0.87},{"x":8,"y":0.83},{"x":9,"y":0.72},{"x":10,"y":0.86},{"x":11,"y":0.9},{"x":12,"y":0.98},{"x":13,"y":0.93},{"x":14,"y":0.97},{"x":15,"y":0.91},{"x":16,"y":0.84},{"x":17,"y":0.85},{"x":18,"y":1.07},{"x":19,"y":1.02},{"x":20,"y":0.81},{"x":21,"y":0.8},{"x":22,"y":0.91},{"x":23,"y":0.99},{"x":24,"y":0.93},{"x":25,"y":0.94},{"x":26,"y":1.01},{"x":27,"y":1.02},{"x":28,"y":1.1},{"x":29,"y":1.02},{"x":30,"y":1.16},{"x":31,"y":1.08},{"x":32,"y":1.17},{"x":33,"y":1.22},{"x":34,"y":1.18},{"x":35,"y":1.12},{"x":36,"y":1.5},{"x":37,"y":1.34},{"x":38,"y":1.42},{"x":39,"y":1.47},{"x":40,"y":1.52},{"x":41,"y":1.45},{"x":42,"y":1.47},{"x":43,"y":1.79},{"x":44,"y":1.63},{"x":45,"y":1.87},{"x":46,"y":2.17},{"x":47,"y":1.74},{"x":48,"y":2.38},{"x":49,"y":3.84},{"x":50,"y":4.62},{"x":51,"y":3.65},{"x":52,"y":4.43},{"x":53,"y":4.72},{"x":54,"y":8.36},{"x":55,"y":11.93},{"x":56,"y":16.01},{"x":57,"y":15.45},{"x":58,"y":27.04},{"x":59,"y":33.61},{"x":60,"y":58.36},{"x":61,"y":67.95},{"x":62,"y":76.99},{"x":63,"y":80.5},{"x":64,"y":90.5},{"x":65,"y":92.12},{"x":66,"y":93.61},{"x":67,"y":95.73},{"x":68,"y":96.63},{"x":69,"y":96.98},{"x":70,"y":97.6},{"x":71,"y":97.78},{"x":72,"y":98.24},{"x":73,"y":98.64},{"x":74,"y":99.05},{"x":75,"y":99.21},{"x":76,"y":99.36},{"x":77,"y":99.5},{"x":78,"y":99.62},{"x":79,"y":99.63},{"x":80,"y":99.72},{"x":81,"y":99.81},{"x":82,"y":99.73},{"x":83,"y":99.86},{"x":84,"y":99.87},{"x":85,"y":99.91},{"x":86,"y":99.96},{"x":87,"y":99.96},{"x":88,"y":99.96},{"x":89,"y":99.98},{"x":90,"y":99.98},{"x":91,"y":99.99},{"x":92,"y":99.99},{"x":93,"y":100},{"x":94,"y":100},{"x":95,"y":100},{"x":96,"y":100},{"x":97,"y":100},{"x":98,"y":100},{"x":99,"y":100},{"x":100,"y":100}];
var OfficialW = [{"x":1,"y":1.11},{"x":2,"y":0.97},{"x":3,"y":0.89},{"x":4,"y":0.87},{"x":5,"y":1.1},{"x":6,"y":0.82},{"x":7,"y":0.87},{"x":8,"y":0.83},{"x":9,"y":0.72},{"x":10,"y":0.86},{"x":11,"y":0.9},{"x":12,"y":0.98},{"x":13,"y":0.93},{"x":14,"y":0.97},{"x":15,"y":0.91},{"x":16,"y":0.84},{"x":17,"y":0.85},{"x":18,"y":1.07},{"x":19,"y":1.02},{"x":20,"y":0.81},{"x":21,"y":0.8},{"x":22,"y":0.91},{"x":23,"y":0.99},{"x":24,"y":0.93},{"x":25,"y":0.94},{"x":26,"y":1.01},{"x":27,"y":1.02},{"x":28,"y":1.1},{"x":29,"y":1.02},{"x":30,"y":1.16},{"x":31,"y":1.08},{"x":32,"y":1.17},{"x":33,"y":1.22},{"x":34,"y":1.18},{"x":35,"y":1.12},{"x":36,"y":1.5},{"x":37,"y":1.34},{"x":38,"y":1.42},{"x":39,"y":1.47},{"x":40,"y":1.52},{"x":41,"y":1.45},{"x":42,"y":1.47},{"x":43,"y":1.79},{"x":44,"y":1.63},{"x":45,"y":1.87},{"x":46,"y":2.17},{"x":47,"y":1.74},{"x":48,"y":2.38},{"x":49,"y":3.84},{"x":50,"y":4.62},{"x":51,"y":3.65},{"x":52,"y":4.43},{"x":53,"y":4.72},{"x":54,"y":8.36},{"x":55,"y":11.93},{"x":56,"y":16.01},{"x":57,"y":15.45},{"x":58,"y":27.04},{"x":59,"y":33.61},{"x":60,"y":58.36},{"x":61,"y":67.95},{"x":62,"y":76.99},{"x":63,"y":80.5},{"x":64,"y":90.5},{"x":65,"y":92.12},{"x":66,"y":93.61},{"x":67,"y":95.73},{"x":68,"y":96.63},{"x":69,"y":96.98},{"x":70,"y":97.6},{"x":71,"y":97.78},{"x":72,"y":98.24},{"x":73,"y":98.64},{"x":74,"y":99.05},{"x":75,"y":99.21},{"x":76,"y":99.36},{"x":77,"y":99.5},{"x":78,"y":99.62},{"x":79,"y":99.63},{"x":80,"y":99.72},{"x":81,"y":99.81},{"x":82,"y":99.73},{"x":83,"y":99.86},{"x":84,"y":99.87},{"x":85,"y":99.91},{"x":86,"y":99.96},{"x":87,"y":99.96},{"x":88,"y":99.96},{"x":89,"y":99.98},{"x":90,"y":99.98},{"x":91,"y":99.99},{"x":92,"y":99.99},{"x":93,"y":100},{"x":94,"y":100},{"x":95,"y":100},{"x":96,"y":100},{"x":97,"y":100},{"x":98,"y":100},{"x":99,"y":100},{"x":100,"y":100}];
/**
 * Displays the results tab with model statistics
 */
function ResultsTab() {
    GetFinalCount().then(Counts => {
        // Show the results tab
        ShowResultTab();
        // Update texts where necessary
        var Regrowth = ControlWidget.CurrentRegrowth;
        let SheepLabel = GetResultLabel(0);
        let WolfLabel = GetResultLabel(1);
        let RegrowthLabel = GetResultLabel(2);
        RegrowthLabel.text(`${Regrowth}`);
        SheepLabel.text(`${Counts[0].toFixed(1)}`);
        WolfLabel.text(`${Counts[1].toFixed(1)}`);
        // Record the data
        ResultsS.push({ x: Regrowth, y: Counts[0] });
        ResultsW.push({ x: Regrowth, y: Counts[1] });
        if (typeof(EstimationW[Regrowth]) == 'undefined') {
            EstimationS[Regrowth] = { Count: 0, Sum: 0 };
            EstimationW[Regrowth] = { Count: 0, Sum: 0 };
        }
        EstimationS[Regrowth].Count++;
        EstimationS[Regrowth].Sum += parseFloat(Counts[0]);
        EstimationW[Regrowth].Count++;
        EstimationW[Regrowth].Sum += parseFloat(Counts[1]);
        // Plot the data
        setTimeout(PlotResults, 100);
        // Try again button functionality
        $('.results-summary-button:first').on('click', function () {
            Series[0].data = [];
            Series[1].data = [];
            CallCommand("setup");
            SetRegrowth(Regrowth);
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
    var EstimatedS = [];
    var EstimatedW = [];
    // Calculate the estimation
    for (var Key in EstimationS) {
        EstimatedS.push({ x: Key, y: EstimationS[Key].Sum / EstimationS[Key].Count });
    }
    EstimatedS.sort((a, b) => a.x - b.x);
    for (var Key in EstimationW) {
        EstimatedW.push({ x: Key, y: EstimationW[Key].Sum / EstimationW[Key].Count });
    }
    EstimatedW.sort((a, b) => a.x - b.x);
    // Generate the series
    var Series = [{
        name: 'series-ref-sheep',
        data: OfficialS
    }, {
        name: 'series-ref-wolves',
        data: OfficialW
    }, {
        name: 'series-est-sheep',
        data: EstimatedS
    }, {
        name: 'series-est-wolves',
        data: EstimatedW
    }, {
        name: 'series-sheep',
        data: ResultsS
    }, {
        name: 'series-wolves',
        data: ResultsW
    }];
    // Plot the player's results
    new Chartist.Line('.plot-container', {
        series: Series
    }, {
        series: {
            'series-ref-sheep': {
                showLine: true,
                showPoint: false
            },
            'series-ref-wolves': {
                showLine: true,
                showPoint: false
            },
            'series-sheep': {
                showLine: false,
                showPoint: true
            },
            'series-wolves': {
                showLine: false,
                showPoint: true
            },
            'series-est-sheep': {
                showLine: ResultsS.length >= 5,
                showPoint: false,
                lineSmooth: Chartist.Interpolation.cardinal({
                    fillHoles: true,
                }),
            },
            'series-est-wolves': {
                showLine: ResultsW.length >= 5,
                showPoint: false,
                lineSmooth: Chartist.Interpolation.cardinal({
                    fillHoles: true,
                }),
            },
        },
        axisX: {
            type: Chartist.FixedScaleAxis,
            low: 0,
            high: 100,
            divisor: 5,
            onlyInteger: true,
            labelInterpolationFnc: (Value) => Value
        },
        axisY: {
            type: Chartist.AutoScaleAxis,
            low: 0,
            divisor: 5,
            onlyInteger: true,
            labelInterpolationFnc: (Value) => Value
        }
    });
}

/** 
 * Plot the reference results
 */
function ShowReference() {
    $(".ct-series-a").css("opacity", 0.5);
    $(".ct-series-b").css("opacity", 0.5);
}

// Metadata for Introduction
const IntroMetadata =
    [
        {
            img: "assets/wolf_sheep_1.png",
            title: "CONTEXT",
            description:
                "In a healthy ecosystem, the competition and cooperation of multiple species produce stable population cycles. However, climate changes can disrupt these cycles.",
        },
        {
            img: "assets/predation.gif",
            title: "WHAT IS IT?",
            description:
                "This simulation models a simple ecosystem of wolves sheep and grass. We’ll explore how the growth rate of grass affects the ecosystem stability. ",
        },
        {
            img: "assets/sheep_behavior.gif",
            title: "HOW DOES IT WORK?",
            description:
                `- Wolves eat sheep 
                - Sheep eat grass
                - They both move around randomly and reproduce when they have enough energy
                - Grass regrows at a certain rate
                `,
            buttonText: "GET STARTED",
        },
    ];