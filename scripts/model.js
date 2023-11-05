/** Model: All model-general code goes here. */

/** Load the simulation & window */
var Simulation = null;
var Handlers = {};
var SimulationFrame = document.getElementById("simulation");
SimulationFrame.onload = () => { 
    Simulation = SimulationFrame.contentWindow; 
};

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
    if (event.data.type == "nlw-resize") {
        // Resize the view
        RunCommand(`resize ${Simulation.outerWidth} ${Simulation.outerHeight}`);
    }
    if (!event.data || !event.data.id) return;
    Handlers[event.data.id](event.data.result);
    delete Handlers[event.data.id];
});
