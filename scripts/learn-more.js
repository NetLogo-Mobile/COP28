/* Add event listeners to the visit site buttons */

const visitSiteButtons = document.querySelectorAll('.visit-button');
const supportButtons = document.querySelectorAll('.support-button');

visitSiteButtons.forEach((button) => {
    button.addEventListener('click' , () => {
        top.location.href = 'https://www.netlogoweb.org/';
    });
});

supportButtons.forEach((button) => {
    button.addEventListener('click' , () => {
    });
});