/** Segregation: The segregation model specific code goes here. */
const LevelName = "segregation";
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
    ShowSlider(SetWanted, 30, 'segregation-model');
}

/**
 * Handles the 'run' action of the model
 */
async function HandleRun() {
    SwitchMode(true);
    GameLoop();
    // Record the event
    gtag("event", "level_start", {
        level_name: LevelName,
        parameter1: ControlWidget.Wanted,
    });
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
    var slider = $("input[type='range'].styled-slider");
    slider.css('--value', value);
    slider.val(value);
}

/**
 * Get the similarity ratio for display
 */
async function GetSimilarity() {
    return await CallReporter("get-similar");
}

var Results = [];
var Estimation = {};
var Official = [[{"x":1,"y":50.5},{"x":2,"y":50.6},{"x":3,"y":50.6},{"x":4,"y":50.6},{"x":5,"y":50.6},{"x":6,"y":50.6},{"x":7,"y":50.6},{"x":8,"y":50.5},{"x":9,"y":50.6},{"x":10,"y":50.5},{"x":11,"y":50.6},{"x":12,"y":50.6},{"x":13,"y":53.2},{"x":14,"y":53.3},{"x":15,"y":55.2},{"x":16,"y":55.4},{"x":17,"y":56.0},{"x":18,"y":55.9},{"x":19,"y":55.9},{"x":20,"y":56.0},{"x":21,"y":56.0},{"x":22,"y":56.0},{"x":23,"y":55.9},{"x":24,"y":55.9},{"x":25,"y":55.8},{"x":26,"y":71.7},{"x":27,"y":71.5},{"x":28,"y":71.5},{"x":29,"y":75.1},{"x":30,"y":74.8},{"x":31,"y":75.0},{"x":32,"y":74.9},{"x":33,"y":74.8},{"x":34,"y":75.5},{"x":35,"y":75.5},{"x":36,"y":75.6},{"x":37,"y":75.4},{"x":38,"y":83.4},{"x":39,"y":83.6},{"x":40,"y":83.4},{"x":41,"y":83.6},{"x":42,"y":83.5},{"x":43,"y":86.4},{"x":44,"y":86.4},{"x":45,"y":86.4},{"x":46,"y":86.4},{"x":47,"y":86.4},{"x":48,"y":86.5},{"x":49,"y":86.4},{"x":50,"y":86.5},{"x":51,"y":95.5},{"x":52,"y":95.4},{"x":53,"y":95.5},{"x":54,"y":95.5},{"x":55,"y":95.6},{"x":56,"y":95.5},{"x":57,"y":95.5},{"x":58,"y":96.6},{"x":59,"y":96.7},{"x":60,"y":96.6}]];
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
        // Record the event
        gtag("event", "level_end", {
            level_name: LevelName,
            parameter1: Wanted,
            result1: Similarity,
            success: true
        });
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
            low: 40,
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