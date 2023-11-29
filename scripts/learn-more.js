// about netlogo btns 
const downloadBtns = document.querySelectorAll('.download-btn');
if (downloadBtns.length > 0) {
    downloadBtns[0].addEventListener('click', () => {
        // Record the event
        gtag("event", "select_content", {
            content_type: "netlogo-desktop"
        });
        top.location.href = 'https://ccl.northwestern.edu/netlogo/download.shtml';
        console.log("download");
    });

    downloadBtns[1].addEventListener('click', () => {
        // Record the event
        gtag("event", "select_content", {
            content_type: "netlogo-web"
        });
        top.location.href = 'https://www.netlogoweb.org/launch';
    });

    downloadBtns[2].addEventListener('click', () => {
        // Record the event
        gtag("event", "select_content", {
            content_type: "turtle-universe"
        });
        top.location.href = 'https://turtlesim.com/products/turtle-universe/';
    });
}

// subscribe btn
function subscribeToList() {
    let email = document.querySelector('#subscribe-input').value;
    // Validate email
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    // Record the event
    gtag("event", "select_content", {
        content_type: "subscription"
    });
}

// email validation
function isValidEmail(email) {
    var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return regex.test(email);
}

//donate btn
const donateBtn = document.querySelector('.donate-btn');
if (donateBtn) {
    donateBtn.addEventListener('click', () => {
        // Record the event
        gtag("event", "select_content", {
            content_type: "donation"
        });
        top.location.href = 'https://secure.ard.northwestern.edu/s/1479/282-giving/basic-page-nonav-campaign.aspx?sid=1479&gid=282&pgid=19841&cid=31575';
    });
}