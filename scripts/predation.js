/** Predation: The predation model specific code goes here. */
const LevelName = "predation";
var MiniPlot, Series;
var state = {isRunning: false};
/**
 * Sets up the model interface and initializes components
 */
function Setup() {
    // Show the model
    ShowModel({
        Regrowth: 0,
        RegrowthLabel: $('.regrowth-label'),
        PlotContainer: $('.miniplot-container'),
    }, state);
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
    if(state.isRunning) {
        return; // if its already running, do nothing
    }
    state.isRunning = true;
    SwitchMode(state);
    GameLoop();
    // Record the event
    gtag("event", "level_start", {
        level_name: LevelName,
        parameter1: ControlWidget.Regrowth,
    });
}

/**
 * Handles the 'stop' action of the model
 */
function HandleStop() {
    if(!state.isRunning) return;
    state.isRunning = false;
    SwitchMode(state);
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
        state.isRunning = false;
        SwitchMode(state);
        ResultsTab();
    } else if (!state.isRunning ) {
        // stop button has been pressed
        ResultsTab();
    }
    else {
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
    var slider = $("input[type='range'].styled-slider");
    slider.css('--value', value);
    slider.val(value);
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
var OfficialS = [{"x":1,"y":0.0},{"x":2,"y":176.1},{"x":3,"y":59.7},{"x":4,"y":0.0},{"x":5,"y":0.0},{"x":6,"y":243.0},{"x":7,"y":250.1},{"x":8,"y":453.9},{"x":9,"y":542.5},{"x":10,"y":760.7},{"x":11,"y":655.9},{"x":12,"y":510.0},{"x":13,"y":533.1},{"x":14,"y":447.5},{"x":15,"y":404.7},{"x":16,"y":261.8},{"x":17,"y":148.2},{"x":18,"y":148.9},{"x":19,"y":213.7},{"x":20,"y":251.2},{"x":21,"y":186.2},{"x":22,"y":190.6},{"x":23,"y":167.6},{"x":24,"y":145.7},{"x":25,"y":154.2},{"x":26,"y":150.1},{"x":27,"y":164.9},{"x":28,"y":164.4},{"x":29,"y":161.7},{"x":30,"y":160.4},{"x":31,"y":146.1},{"x":32,"y":160.5},{"x":33,"y":153.8},{"x":34,"y":156.0},{"x":35,"y":170.1},{"x":36,"y":152.1},{"x":37,"y":162.3},{"x":38,"y":157.4},{"x":39,"y":163.1},{"x":40,"y":164.0},{"x":41,"y":166.0},{"x":42,"y":165.1},{"x":43,"y":162.9},{"x":44,"y":169.0},{"x":45,"y":164.8},{"x":46,"y":165.3},{"x":47,"y":160.0},{"x":48,"y":156.9},{"x":49,"y":161.9},{"x":50,"y":159.3},{"x":51,"y":151.8},{"x":52,"y":151.3},{"x":53,"y":147.3},{"x":54,"y":146.4},{"x":55,"y":146.9},{"x":56,"y":139.5},{"x":57,"y":140.6},{"x":58,"y":129.0},{"x":59,"y":129.5},{"x":60,"y":133.3},{"x":61,"y":134.0},{"x":62,"y":121.0},{"x":63,"y":109.2},{"x":64,"y":108.7},{"x":65,"y":108.3},{"x":66,"y":126.0},{"x":67,"y":135.1},{"x":68,"y":107.7},{"x":69,"y":93.5},{"x":70,"y":81.5},{"x":71,"y":105.9},{"x":72,"y":122.1},{"x":73,"y":133.0},{"x":74,"y":135.9},{"x":75,"y":101.8},{"x":76,"y":70.1},{"x":77,"y":63.4},{"x":78,"y":75.1},{"x":79,"y":101.2},{"x":80,"y":111.2},{"x":81,"y":135.3},{"x":82,"y":115.0},{"x":83,"y":111.7},{"x":84,"y":65.6},{"x":85,"y":47.8},{"x":86,"y":46.5},{"x":87,"y":49.7},{"x":88,"y":85.8},{"x":89,"y":94.6},{"x":90,"y":110.0},{"x":91,"y":108.6},{"x":92,"y":116.5},{"x":93,"y":96.7},{"x":94,"y":64.7},{"x":95,"y":68.0},{"x":96,"y":54.1},{"x":97,"y":39.5},{"x":98,"y":44.7},{"x":99,"y":40.3},{"x":100,"y":62.9}];
var OfficialW = [{"x":1,"y":0.0},{"x":2,"y":0.0},{"x":3,"y":0.0},{"x":4,"y":0.0},{"x":5,"y":0.0},{"x":6,"y":0.0},{"x":7,"y":0.0},{"x":8,"y":0.0},{"x":9,"y":0.0},{"x":10,"y":0.0},{"x":11,"y":21.4},{"x":12,"y":12.0},{"x":13,"y":8.4},{"x":14,"y":36.9},{"x":15,"y":76.3},{"x":16,"y":84.8},{"x":17,"y":143.1},{"x":18,"y":87.8},{"x":19,"y":72.7},{"x":20,"y":78.6},{"x":21,"y":96.5},{"x":22,"y":114.9},{"x":23,"y":96.8},{"x":24,"y":94.8},{"x":25,"y":98.1},{"x":26,"y":93.0},{"x":27,"y":84.1},{"x":28,"y":83.3},{"x":29,"y":80.7},{"x":30,"y":76.9},{"x":31,"y":80.7},{"x":32,"y":70.0},{"x":33,"y":68.6},{"x":34,"y":63.9},{"x":35,"y":54.6},{"x":36,"y":55.0},{"x":37,"y":49.7},{"x":38,"y":44.8},{"x":39,"y":40.5},{"x":40,"y":34.5},{"x":41,"y":32.0},{"x":42,"y":23.5},{"x":43,"y":21.8},{"x":44,"y":10.6},{"x":45,"y":8.6},{"x":46,"y":6.0},{"x":47,"y":2.8},{"x":48,"y":2.2},{"x":49,"y":1.8},{"x":50,"y":0.4},{"x":51,"y":0.0},{"x":52,"y":0.0},{"x":53,"y":0.0},{"x":54,"y":0.0},{"x":55,"y":0.0},{"x":56,"y":0.0},{"x":57,"y":0.0},{"x":58,"y":0.0},{"x":59,"y":0.0},{"x":60,"y":0.0},{"x":61,"y":0.0},{"x":62,"y":0.0},{"x":63,"y":0.0},{"x":64,"y":0.0},{"x":65,"y":0.0},{"x":66,"y":0.0},{"x":67,"y":0.0},{"x":68,"y":0.0},{"x":69,"y":0.0},{"x":70,"y":0.0},{"x":71,"y":0.0},{"x":72,"y":0.0},{"x":73,"y":0.0},{"x":74,"y":0.0},{"x":75,"y":0.0},{"x":76,"y":0.0},{"x":77,"y":0.0},{"x":78,"y":0.0},{"x":79,"y":0.0},{"x":80,"y":0.0},{"x":81,"y":0.0},{"x":82,"y":0.0},{"x":83,"y":0.0},{"x":84,"y":0.0},{"x":85,"y":0.0},{"x":86,"y":0.0},{"x":87,"y":0.0},{"x":88,"y":0.0},{"x":89,"y":0.0},{"x":90,"y":0.0},{"x":91,"y":0.0},{"x":92,"y":0.0},{"x":93,"y":0.0},{"x":94,"y":0.0},{"x":95,"y":0.0},{"x":96,"y":0.0},{"x":97,"y":0.0},{"x":98,"y":0.0},{"x":99,"y":0.0},{"x":100,"y":0.0}];
/**
 * Displays the results tab with model statistics
 */
function ResultsTab() {
    GetFinalCount().then(Counts => {
        // Show the results tab
        ShowResultTab();
        // Update texts where necessary
        var Regrowth = ControlWidget.CurrentRegrowth;
        let RegrowthLabel = GetResultLabel(0);
        let SheepLabel = GetResultLabel(1);
        let WolfLabel = GetResultLabel(2);
        RegrowthLabel.text(`${Regrowth}`);
        SheepLabel.text(`${Counts[0].toFixed(1)}`);
        WolfLabel.text(`${Counts[1].toFixed(1)}`);
        // Record the event
        gtag("event", "level_end", {
            level_name: LevelName,
            parameter1: Regrowth,
            result1: Counts[0],
            result2: Counts[1],
            success: true
        });
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
        Series[0].data = [];
        Series[1].data = [];
        // Try again button functionality
        $('.results-summary-button:first').on('click', function () {
            CallCommand("setup");
            state.isRunning = false;
            SwitchMode(state);
            HideResultTab();
            ResetResultState();
        });

        // Learn more functionality
        $('.results-summary-button:last').on('click', function () {
            CallCommand("setup");
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