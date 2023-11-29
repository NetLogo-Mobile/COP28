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
}

// Load content for a specific page and set up event listeners
function LoadPageContent(CurrentPage) {
  let container = $(".container")[0];
  // Event listener for navigating through pages
    // create the two go backs 
  var outerBackContainer = $('.go-back-btn').eq(1);
  var outerBackBtn = CreateGoBackButton(goBack);
  outerBackContainer.append(outerBackBtn);
  outerBackContainer.hide();

  var innerBackContainer = $('.go-back-btn').eq(0);
  var innerBackBtn = CreateGoBackButton(goBack);
  innerBackContainer.prepend(innerBackBtn);

  function goBack() {
    if(CurrentPage == 3) {
      HideModel();
      outerBackContainer.hide();
      innerBackContainer.show();
    }
    else if(CurrentPage == 0) {
      window.location.href = "index.html";
      return;
    }
    CurrentPage--;
    UpdateContent(CurrentPage);
  }

  container.addEventListener("click", function (event) {
    const target = event.target;

    if (target.matches("#button-next")) {
      CurrentPage++;
      if (CurrentPage < IntroMetadata.length) {
        UpdateContent(CurrentPage);
      } else {
        // hide the inner back button
        innerBackContainer.hide();
        outerBackContainer.show();
        Setup(container); // Assuming the definition of Setup is elsewhere in the code
      }
    }
  });
  // Initial content load
  UpdateContent(CurrentPage);
}

// Start loading content from the first page
var CurrentPage = 0;
CurrentPage = LoadPageContent(CurrentPage);
