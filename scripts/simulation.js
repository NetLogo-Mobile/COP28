/** Simulation: supporting code for the embedded simulation. */
/** Loading the Simulation */
$(document).ready(function () {
  var modelLocation = window.location.hash.substring(1);

  if (modelLocation) {
    $.get(modelLocation, function (data) {
      // Create and append the first <script> tag with loaded content
      $("<script>", {
        type: "text/nlogo",
        id: "nlogo-code",
        "data-filename": modelLocation,
        html: data,
      }).appendTo("body");

      // Create and append the second <script> tag with the specified src attribute
      $("<script>", {
        type: "module",
        src: "https://www.netlogoweb.org/assets/javascripts/pages/f4bbcf41debbd7805121041f6ac5212d-simulation.js",
      }).appendTo("body");

      // Once scripts are appended, check if the canvas is available.
      // If not, we'll periodically check until it's present.
      function moveCanvasToTop() {
        var canvas = $(".netlogo-canvas");
        if (canvas.length) {
          $("body").prepend(canvas); // Move the canvas to the top level of the page.
        } else {
          // If canvas is not yet available, check again after a delay.
          setTimeout(moveCanvasToTop, 100);
        }
      }
      moveCanvasToTop(); // Initiate the check and move process.
    }).fail(function () {
      console.error("Error loading " + modelLocation);
    });
  } else {
    console.error("No model location provided in the URL bookmark.");
  }
});

/** Taking messages from the parent iFrame */
window.addEventListener("message", (event) => {
    if (!event.data) return;
    switch (event.data.sender) {
      case "CallCommand":
        CallCommand(event.data.command);
        break;
      case "CallReporter":
        window.parent.postMessage({
          sender: "CallReporter",
          result: CallReporter(event.data.command),
          id: event.data.id
        }, "*");
        break;
      case "RunCommand":
        RunCommand(event.data.command);
        break;
      case "RunReporter":
        window.parent.postMessage({
          sender: "RunReporter",
          result: RunReporter(event.data.command),
          id: event.data.id
        }, "*");
        break;
      case "Click":
        $(event.data.selector).click();
      case "ExportCanvas":
        window.parent.postMessage({
          sender: "ExportCanvas",
          result: ExportCanvas(),
          id: event.data.id
        }, "*");
    }
});

/** Call a Command */
function CallCommand(Command) {
  workspace.procedurePrims.callCommand(Command);
}

/** Call a Reporter */
function CallReporter(Reporter) {
  return workspace.procedurePrims.callReporter(Reporter);
}

/** Run a Reporter Statement */
function RunReporter(Statement) {
  return session.runReporter(Statement).value;
}

/** Run a Command Statement */
function RunCommand(Statement) {
  return session.run("command", Statement);
}

/** Export the canvas image */
function ExportCanvas() {
  return $("canvas").get(0).toDataURL("image/png");
}