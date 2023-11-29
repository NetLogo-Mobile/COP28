// Update the content of the onboarding screen based on page index
function UpdateContent(pageIndex) {
  const { img, title, description, buttonText } = IntroMetadata[pageIndex];
  document.querySelector(".demo-img").src = img;
  document.querySelector(".onboarding-title").innerText = title;
  document.querySelector(".onboarding-descript").innerText = description;

  // Update button text if available
  let button = document.querySelector("#button-next");
  if (buttonText) {
    button.innerText = buttonText;
  }

  // Record the event
  gtag("event", "select_content", {
    content_type: "intro." + pageIndex
  });
}

// Load content for a specific page and set up event listeners
function LoadPageContent(CurrentPage) {
  let container = document.querySelector(".container");

  // Event listener for navigating through pages
  container.addEventListener("click", function (event) {
    const target = event.target;

    if (target.matches("#button-next")) {
      CurrentPage++;
      if (CurrentPage < IntroMetadata.length) {
        UpdateContent(CurrentPage);
      } else {
        Setup(container); // Assuming the definition of Setup is elsewhere in the code
      }
    }
  });

  // Initial content load
  UpdateContent(CurrentPage);
}

// Start loading content from the first page
LoadPageContent(0);