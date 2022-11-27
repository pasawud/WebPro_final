window.onload = pageload;
function pageload() {
    var clickbutton = document.getElementById("register")
    clickbutton.onsubmit = validateform
}

function validateform() {
    var password = document.forms["register"]["password"].value;
    var repassowrd = document.forms["register"]["repassword"].value;

    if (password != repassowrd) {
        alert("Your passowrd in not match")
        return false;
    }
    else {

    }
}