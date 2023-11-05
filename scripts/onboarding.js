// Page data
const pages = [
    {
        img: 'assets/fire.png',
        title: 'WHAT IS IT?',
        description: 'This is the fire model from NetLogo. It simulates the spread of a fire through a forest.'
    },
    {
        img: 'assets/burning.gif',
        title: 'HOW DOES IT WORK?',
        description: 'The fire starts on the left edge of the forest and spreads to neighboring trees.'
    },
    {
        img: 'assets/burning_close.gif',
        title: 'HOW DOES IT WORK?',
        description: 'The fire spreads in four directions: north, east, south, and west.',
        buttonText: 'GET STARTED'
    }
];


function updateContent(pageIndex) {
    const { img, title, description, buttonText } = pages[pageIndex];
    document.querySelector('.demo-img').src = img;
    document.querySelector('.onboarding-title').innerText = title;
    document.querySelector('.onboarding-descript').innerText = description;
    let button = document.querySelector('#button-next');
    if (buttonText) {
        button.innerText = buttonText;
    }
}

function loadFireModel(parent) {
    parent.innerHTML = `<iframe id="fire-model" src="simulation.html#models/fire.nlogo"></iframe>`;
}

document.querySelector('.container').addEventListener('click', function(event) {
    const target = event.target;

    if (target.matches('#button-next')) {
        currentPage++;
        if (currentPage < pages.length) {
            updateContent(currentPage);
        } else {
            loadFireModel(document.querySelector('.container'));
        }
    }

});


