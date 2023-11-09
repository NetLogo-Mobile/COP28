// Page data
const pages = [
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
  ],
  [
    {
      img: "assets/fire.png",
      title: "WHAT IS IT?",
      description:
        "The model you will be playing with simulates the spread of a fire through a forest.",
    },
    {
      img: "assets/burning.gif",
      title: "HOW DOES IT WORK?",
      description:
        "You will be able to change the density of the trees in the forest, and add fires through touching, to understand how fires spread in forests.",
    },
    {
      img: "assets/burning_close.gif",
      title: "HOW DOES IT WORK?",
      description:
        "The fire spreads in four directions: to the tree directly north, and to trees to the east, south, and west.",
      buttonText: "GET STARTED",
    },
  ],
  null,
];

function updateContent(pageIndex, modelIndex) {
  const { img, title, description, buttonText } = pages[modelIndex][pageIndex];
  document.querySelector(".demo-img").src = img;
  document.querySelector(".onboarding-title").innerText = title;
  document.querySelector(".onboarding-descript").innerText = description;
  let button = document.querySelector("#button-next");
  if (buttonText) {
    button.innerText = buttonText;
  }
}

function loadPageContent(currentPage, modelIndex) {
  let container = document.querySelector(".container");
  container.addEventListener("click", function (event) {
    const target = event.target;

    if (target.matches("#button-next")) {
      currentPage++;
      if (currentPage < pages.length) {
        updateContent(currentPage, modelIndex);
      } else {
        setup(container);
      }
    }
  });
  updateContent(currentPage, modelIndex);
}
