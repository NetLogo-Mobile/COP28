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

// about netlogo btns 
const downloadBtns = document.querySelectorAll('.download-btn');
    if(downloadBtns.length > 0){
        downloadBtns[0].addEventListener('click' , () => {
        top.location.href = 'https://ccl.northwestern.edu/netlogo/download.shtml';
        console.log("download");
    });
    
    downloadBtns[1].addEventListener('click' , () => {
        top.location.href = 'https://www.netlogoweb.org/launch';
    });
    
    downloadBtns[2].addEventListener('click' , () => {
        top.location.href = 'https://turtlesim.com/products/turtle-universe/';
    });
}

// subscribe btn
function subscribeToList() {
    let email = document.querySelector('#subscribe-input').value;
    console.log(email);
    // do smth
}

//donate btn
const donateBtn = document.querySelector('.donate-btn');
if(donateBtn){
    donateBtn.addEventListener('click' , () => {
        top.location.href = 'https://secure.ard.northwestern.edu/s/1479/282-giving/basic-page-nonav-campaign.aspx?sid=1479&gid=282&pgid=19841&cid=31575';
    });
}