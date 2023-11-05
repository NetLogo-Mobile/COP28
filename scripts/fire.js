/** Fire: The fire model specific code goes here. */
// async function GameLoop() {
//     CallCommand("go")
//     var Fires = await RunReporter("count fires");
//     if (Fires == 0) {
//         // The game ends
        
//     } else return await GameLoop();
// }

function setup() {
    document.querySelector('#intro').remove();
    document.querySelector('.model-container').classList.remove('invisible-element');
    // when setting up, we remove the padding from the container so that the game can be full screen
    document.querySelector(".container").classList.add("no-padding");
    // hide the netlogo model container
    let iframe_document = document.getElementById("simulation").contentWindow.document;
    // only leave behind the canvas 
    iframe_document.getElementById("netlogo-model-container").replaceChildren();
    CallCommand('setup');
}