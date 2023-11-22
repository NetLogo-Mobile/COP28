/** Fire: The fire model specific code goes here. *
/**
 * Sets up the model interface and initializes components
 */
function Setup() {
    // Show the model
    ShowModel({
        Density: 0,
        DensityLabel: $('.density-label'),
        DensityVal: $('.density-val'),
        BurnedVal: $('.burned-val'),
    });
    // Setup the model
    RunCommand(`resize ${SimulationFrame.clientWidth} ${SimulationFrame.clientHeight}`);
    Click("#netlogo-button-5 input");
    // Define objects
    ShowSlider(SetDensity, 50);
}

/**
 * Handles the 'run' action of the model
 */
function HandleRun() {
    SwitchMode(true);
    InitializeValues();
    GameLoop();
}

/**
 * Game loop function for running the model
 */
async function GameLoop() {
    CallCommand("go");
    // Check if the game is over
    var finished = await CallReporter("is-finished");
    CallReporter("report-burned-trees").then(burnedTrees => {
        let burnedPercentage = (burnedTrees / InitialValues.initialTrees) * 100;
        $('.burned-val').text(`${burnedPercentage.toFixed(1)}%`);
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

// Metadata for Introduction
const IntroMetadata =
    [
        {
            img: "assets/fire.png",
            title: "BACKGROUND STORY",
            description:
                "Forest fires are becoming increasingly destructive. It is important to understand how they spread.",
        },
        {
            img: "assets/burning.gif",
            title: "WHAT IS IT?",
            description:
                "In this simple simulation, the forest is modeled as a grid of trees and empty spots. We’ll explore how the density of trees affects fire spread. ",
        },
        {
            img: "assets/burning_close.gif",
            title: "HOW DOES IT WORK?",
            description:
                "Each step, fires spread to neighboring trees and then burn out.",
            buttonText: "GET STARTED",
        },
    ];

/**
    [
        {
          img: "assets/wolfsheep.png",
          title: "WHAT IS IT?",
          description:
            "This model explores the stability of predator-prey ecosystems. Such a system is called unstable if it tends to result in extinction for one or more species involved. In contrast, a system is stable if it tends to maintain itself over time, despite fluctuations in population sizes.",
        },
        {
          img: "assets/sheep.gif",
          title: "HOW DOES IT WORK?",
          description:
            'There are two main variations to this model. In the first variation, the "sheep-wolves" version, wolves and sheep wander randomly around the landscape, while the wolves look for sheep to prey on. Each step costs the wolves energy, and they must eat sheep in order to replenish their energy - when they run out of energy they die. To allow the population to continue, each wolf or sheep has a fixed probability of reproducing at each time step. In this variation, we model the grass as "infinite" so that sheep always have enough to eat, and we don\'t explicitly model the eating or growing of grass. As such, sheep don\'t either gain or lose energy by eating or moving.',
        },
        {
          img: "assets/sheep2.gif",
          title: "HOW DOES IT WORK?",
          description:
            'The second variation, the "sheep-wolves-grass" version explictly models grass (green) in addition to wolves and sheep. The behavior of the wolves is identical to the first variation, however this time the sheep must eat grass in order to maintain their energy - when they run out of energy they die. Once grass is eaten it will only regrow after a fixed amount of time. ',
          buttonText: "GET STARTED",
        },
      ], */
    
/**
 * Displays the results tab with model statistics
 */
function ResultsTab() {
    RunReporter("report-burned-trees").then(burnedTrees => {
        let FiresAdded = (InitialValues.initialTreesBurned / InitialValues.initialTrees * 100).toFixed(1);
        let BurnedTrees = (burnedTrees / InitialValues.initialTrees * 100).toFixed(1);

        ShowResultTab();
        // Update texts where necessary
        let FireAddedLabel = GetResultLabel(0);
        let TreeDensityLabel = GetResultLabel(1);
        let BurnedLabel = GetResultLabel(2);
        TreeDensityLabel.text(`${ControlWidget.CurrentDensity}%`);
        FireAddedLabel.text(`${FiresAdded}%`);
        BurnedLabel.text(`${BurnedTrees}%`);
        // Drag effect
        dragEffect();
        // Try again button functionality
        $('.results-summary-button').on('click', function () {
            SetDensity(ControlWidget.CurrentDensity);
            SwitchMode(false);
            HideResultTab();
        });
    });
}



function dragEffect() {
    const draggableElement = $('.sliding-window')[0];
    let isDragging = false;

    draggableElement.addEventListener('mousedown', startDrag);
    draggableElement.addEventListener('touchstart', startDrag);
    document.addEventListener('mousemove', dragging);
    document.addEventListener('touchmove', dragging);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    const navigationDestination = "Results::scoreboard";
    const animationTimingFunction = "ease-out";
    const animationDuration = "300ms";

    let startX = 0;
    let currentX = 0;
    let pageIndex = 0;

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;

        if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
        } else {
            startX = e.clientX;
        }
    }

    function dragging(e) {
        if (!isDragging) return;

        e.preventDefault();

        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX;
        } else {
            currentX = e.clientX;
        }

        const distanceX = currentX - startX;
        draggableElement.style.transform = `translateX(${distanceX}px)`;
    }

    function endDrag(e) {
        if (!isDragging) return;

        isDragging = false;
        const distanceX = currentX - startX;
        console.log(distanceX);
        const dragThreshold = 70; 

        if (Math.abs(distanceX) >= dragThreshold) {
            navigateAndAnimate();
            shiftPage(distanceX);
        } else {
            draggableElement.style.transform = 'translateX(0)';
        }
    }

    // shiftPage: shifts the page to destPage
    function shiftPage(dragDistance) {
        // get length of resultPage 
        const resultPageLen = $('.results-summary-container').outerWidth();
        console.log(dragDistance);
        // check if drag is right direction:
        if(dragDistance < 0 && pageIndex == 0) {
            draggableElement.style.transition = `transform ${animationDuration} ${animationTimingFunction}`;
            draggableElement.style.transform = `translateX(${-resultPageLen}px)`;
            // set index to next page
            pageIndex = 1;
        }
        else if(dragDistance > 0 && pageIndex == 1) {
            draggableElement.style.transition = `transform ${animationDuration} ${animationTimingFunction}`;
            draggableElement.style.transform = `translateX(${0}px)`;
            // set index to next page
            pageIndex = 0;
        }
    }

    function navigateAndAnimate() {
        draggableElement.style.transition = `transform ${animationDuration} ${animationTimingFunction}`;
        draggableElement.style.transform = 'translateX(0)'; 
    }
}