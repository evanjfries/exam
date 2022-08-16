var elem = document.documentElement;

document.addEventListener("click", () => { 
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { 
      elem.msRequestFullscreen();
    }
    });
    
    document.addEventListener("fullscreenchange", () => {
        console.log("FULLSCREEN CHANGE");
    });