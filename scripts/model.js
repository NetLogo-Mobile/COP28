/** Model: All model-general code goes here. */

/** The model interaction */
/** WaitFor: A helper for Async Timeout. */
const WaitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

/** Load the simulation & window */
var Simulation = null;
var Handlers = {};
var SimulationFrame = document.getElementById("simulation");
SimulationFrame.onload = () => { 
    Simulation = SimulationFrame.contentWindow; 
};

/** Click a Button */
function Click(Selector) {
    Simulation.postMessage({
        sender: "Click",
        selector: Selector
    })
}

/** Call a Command */
function CallCommand(Command) {
    Simulation.postMessage({
        sender: "CallCommand",
        command: Command,
    }, "*");
}

/** Call a Reporter */
function CallReporter(Reporter) {
    return CallWithCallback({
        sender: "CallReporter",
        command: Reporter
    });
}

/** Run a Reporter Statement */
function RunReporter(Statement) {
    return CallWithCallback({
        sender: "RunReporter",
        command: Statement
    });
}

/** Call a Something with Callback */
function CallWithCallback(Data) {
    var Handler = new Promise((resolve, reject) => {
        Data.id = "handler" + Math.random();
        Simulation.postMessage(Data, "*")
        Handlers[Data.id] = resolve;
    });
    return Handler;
}

/** Run a Command Statement */
function RunCommand(Statement) {
    Simulation.postMessage({
        sender: "RunCommand",
        command: Statement,
    }, "*");
}

/** Taking messages from the simulation iFrame */
window.addEventListener("message", (event) => {
    if (!event.data || !event.data.id) return;
    Handlers[event.data.id](event.data.result);
    delete Handlers[event.data.id];
});

/** The controlling interface */
// The control widget
var ControlWidget;
/**
 * Hide the Introduction and show the model
 */
function ShowModel(Widgets) {
    // Show and hide
    $('#intro').hide();
    $('.model-container').removeClass('invisible-element');
    $(".container").addClass("no-padding");
    $(".play-container").on("click", HandleRun);
    // Define objects
    ControlWidget = Widgets;
    Widgets.Slider = $('.styled-slider');
    // Switch the mode
    SwitchMode(false);
}
/**
 * Switches the mode of the application between running and not running
 * @param {boolean} isRunning - Indicates whether the model is running
 */
function SwitchMode(isRunning) {
    $(".slider-label-container").toggle(!isRunning);
    $(".running-model-stats").toggle(isRunning);
}
/**
 * Initializes and shows the parameter slider
 */
function ShowSlider(Callback, DefaultValue) {
    ControlWidget.Slider.on('input', function() {
        var value = $(this).val();
        $(this).css('--value', value);
        Callback(value);
    });
    Callback(DefaultValue);
}