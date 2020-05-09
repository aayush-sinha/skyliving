$(document).ready(function () {
    //Preloader
    preloaderFadeOutTime = 500;
    function hidePreloader() {
        var preloader = $('.loading-screen');
        preloader.fadeOut(preloaderFadeOutTime);
    }
    hidePreloader();
});