document.onreadystatechange = function () {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector(".loading-screen").style.visibility = "visible";
    } else {
        document.querySelector(".loading-screen").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
    }
}; 