/** Fire: The fire model specific code goes here. */
async function GameLoop() {
    CallCommand("go")
    var Fires = await RunReporter("count fires");
    if (Fires == 0) {
        // The game ends
        alert("Game Over!");
    } else return await GameLoop();
}

// globals so we don't have to scan the dom every time 
var iframe_document = document.getElementById("simulation").contentWindow.document;
var densityLabel;

function setDensity(value) {
    densityLabel.innerText = `Density: ${value}%`;
    RunCommand(`set density ${value}`);
    CallCommand("setup");
}

/* controlSlider:  Creates the slider for the control widget of the game */
function controlSlider(parent) {
    // will refactor this later to make it take multiple modes 
    var slider = document.createElement('input');
    slider.setAttribute('type', 'range');
    slider.setAttribute('class', 'styled-slider slider-progress');
    slider.setAttribute('min', '0');
    slider.setAttribute('max', '100');
    slider.setAttribute('value', '50');
    
    // Set the --value CSS variable for the slider
    slider.style.setProperty('--value', slider.value);
    slider.style.setProperty('--min', slider.min);
    slider.style.setProperty('--max', slider.max);
    slider.style.setProperty('--value', slider.value);

    // Add an event listener to update the value when the slider changes
    slider.addEventListener('input', function () {
        this.style.setProperty('--value', this.value);
        setDensity(this.value);
    });

    parent.appendChild(slider);
    return slider;
}

/* controlWidget: Creates the control widget for the game */
function controlWidget(parent) {
    let widgetContainer = document.createElement('div');
    widgetContainer.classList.add('control-widget-container');
    let button = document.createElement('div');
    button.classList.add('control-widget-play-container');
    let playSVG = document.createElement('img');
    playSVG.src = '../assets/ArrowCounterClockwise.svg';
    playSVG.classList.add('control-widget-play');
    button.appendChild(playSVG);
    // add event listener to the button
    button.addEventListener('click', function () {
        // ASK how to set the model speed ? 
        GameLoop();
    });
    // create density label
    densityLabel = document.createElement('span');
    densityLabel.classList.add('density-label');
    densityLabel.classList.add('not-selectable');
    densityLabel.innerText = 'Density';
    // create tooltip label
    let tooltipLabel = document.createElement('span');
    tooltipLabel.classList.add('tooltip-label');
    tooltipLabel.classList.add('not-selectable');
    tooltipLabel.innerText = 'Drag to change the density';
    // create container for slider and label
    let sliderLabelContainer = document.createElement('div');
    sliderLabelContainer.classList.add('slider-label-container');
    sliderLabelContainer.appendChild(densityLabel);
    sliderLabelContainer.appendChild(controlSlider(widgetContainer));
    sliderLabelContainer.appendChild(tooltipLabel);

    widgetContainer.appendChild(button);
    widgetContainer.appendChild(sliderLabelContainer);
    parent.appendChild(widgetContainer);
}

function setup(parent) {
    document.querySelector('#intro').remove();
    document.querySelector('.model-container').classList.remove('invisible-element');
    // when setting up, we remove the padding from the container so that the game can be full screen
    document.querySelector(".container").classList.add("no-padding");
    // hide the netlogo model container
    // only leave behind the canvas 
    iframe_document.getElementById("netlogo-model-container").style = "display: none";
    controlWidget(parent);
    setDensity(50);
    // turn on add fire  --> Ask how to do this? 
    let checkbox = iframe_document.querySelectorAll("input[type=checkbox]")[1];
    checkbox.click();
}

