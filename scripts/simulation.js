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
