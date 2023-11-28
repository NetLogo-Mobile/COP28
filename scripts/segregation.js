/** Segregation: The segregation model specific code goes here. *
/**
 * Sets up the model interface and initializes components
 */
function Setup() {
    // Show the model
    ShowModel({
        Wanted: 0,
        WantedLabel: $('.wanted-label'),
        WantedVal: $('.wanted-val'),
        SimilarityVal: $('.similarity-val'),
    });
    // Setup the model
    RunCommand(`resize ${SimulationFrame.clientWidth} ${SimulationFrame.clientHeight}`);
    // Define objects
    ShowSlider(SetWanted, 30);
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
    GetSimilarity().then(Similarity => {
        ControlWidget.SimilarityVal.text(`${Similarity.toFixed(1)}%`);
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
 * Sets the %-similar-wanted value and updates the related UI components
 * @param {number} value - The % value to set
 */
function SetWanted(value) {
    ControlWidget.WantedLabel.text(`Similarity Wanted: ${value}%`);
    ControlWidget.WantedVal.text(`${value}%`);
    ControlWidget.CurrentWanted = value;
    RunCommand(`set %-similar-wanted ${value}`);
}

/**
 * Get the similarity ratio for display
 */
async function GetSimilarity() {
    return await CallReporter("get-similar");
}

var Results = [];
var Estimation = {};
var Official = [{"x":1,"y":1.11},{"x":2,"y":0.97},{"x":3,"y":0.89},{"x":4,"y":0.87},{"x":5,"y":1.1},{"x":6,"y":0.82},{"x":7,"y":0.87},{"x":8,"y":0.83},{"x":9,"y":0.72},{"x":10,"y":0.86},{"x":11,"y":0.9},{"x":12,"y":0.98},{"x":13,"y":0.93},{"x":14,"y":0.97},{"x":15,"y":0.91},{"x":16,"y":0.84},{"x":17,"y":0.85},{"x":18,"y":1.07},{"x":19,"y":1.02},{"x":20,"y":0.81},{"x":21,"y":0.8},{"x":22,"y":0.91},{"x":23,"y":0.99},{"x":24,"y":0.93},{"x":25,"y":0.94},{"x":26,"y":1.01},{"x":27,"y":1.02},{"x":28,"y":1.1},{"x":29,"y":1.02},{"x":30,"y":1.16},{"x":31,"y":1.08},{"x":32,"y":1.17},{"x":33,"y":1.22},{"x":34,"y":1.18},{"x":35,"y":1.12},{"x":36,"y":1.5},{"x":37,"y":1.34},{"x":38,"y":1.42},{"x":39,"y":1.47},{"x":40,"y":1.52},{"x":41,"y":1.45},{"x":42,"y":1.47},{"x":43,"y":1.79},{"x":44,"y":1.63},{"x":45,"y":1.87},{"x":46,"y":2.17},{"x":47,"y":1.74},{"x":48,"y":2.38},{"x":49,"y":3.84},{"x":50,"y":4.62},{"x":51,"y":3.65},{"x":52,"y":4.43},{"x":53,"y":4.72},{"x":54,"y":8.36},{"x":55,"y":11.93},{"x":56,"y":16.01},{"x":57,"y":15.45},{"x":58,"y":27.04},{"x":59,"y":33.61},{"x":60,"y":58.36},{"x":61,"y":67.95},{"x":62,"y":76.99},{"x":63,"y":80.5},{"x":64,"y":90.5},{"x":65,"y":92.12},{"x":66,"y":93.61},{"x":67,"y":95.73},{"x":68,"y":96.63},{"x":69,"y":96.98},{"x":70,"y":97.6},{"x":71,"y":97.78},{"x":72,"y":98.24},{"x":73,"y":98.64},{"x":74,"y":99.05},{"x":75,"y":99.21},{"x":76,"y":99.36},{"x":77,"y":99.5},{"x":78,"y":99.62},{"x":79,"y":99.63},{"x":80,"y":99.72},{"x":81,"y":99.81},{"x":82,"y":99.73},{"x":83,"y":99.86},{"x":84,"y":99.87},{"x":85,"y":99.91},{"x":86,"y":99.96},{"x":87,"y":99.96},{"x":88,"y":99.96},{"x":89,"y":99.98},{"x":90,"y":99.98},{"x":91,"y":99.99},{"x":92,"y":99.99},{"x":93,"y":100},{"x":94,"y":100},{"x":95,"y":100},{"x":96,"y":100},{"x":97,"y":100},{"x":98,"y":100},{"x":99,"y":100},{"x":100,"y":100}];
/**
 * Displays the results tab with model statistics
 */
function ResultsTab() {
    GetSimilarity().then(Similarity => {
        // Show the results tab
        ShowResultTab();
        // Update texts where necessary
        var Wanted = ControlWidget.CurrentWanted;
        let WantedLabel = GetResultLabel(0);
        let SimilarityLabel = GetResultLabel(1);
        WantedLabel.text(`${Wanted}%`);
        SimilarityLabel.text(`${Similarity.toFixed(1)}%`);
        // Record the data
        Results.push({ x: Wanted, y: Similarity });
        if (typeof(Estimation[Wanted]) == 'undefined')
            Estimation[Wanted] = { Count: 0, Sum: 0 };
        Estimation[Wanted].Count++;
        Estimation[Wanted].Sum += parseFloat(Similarity);
        // Plot the data
        setTimeout(PlotResults, 100);
        // Try again button functionality
        $('.results-summary-button:first').on('click', function () {
            CallCommand("setup");
            SetWanted(Wanted);
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
            img: "assets/segregation_1.png",
            title: "CONTEXT",
            description:
                "In the map of a city above, different regions are colored based on ethnic makeup. Segregation by race and other factors remains an enduring feature of cities around the world.",
        },
        {
            img: "assets/segregation_2.gif",
            title: "WHAT IS IT?",
            description:
                "This simulation models a process of segregation due to “weak bias”: a preference to live in a neighborhood with some people of the same “type” while not having any problem with people of other types.",
        },
        {
            img: "assets/segregation_3.gif",
            title: "HOW DOES IT WORK?",
            description:
                `Each person looks at their 8 neighbors and wants at least a certain percentage to be like them (e.g., 30%). If the percentage is reached, they are happy (square) and stay put. If not, they are unhappy (X) and move to a random new spot. `,
            buttonText: "GET STARTED",
        },
    ];