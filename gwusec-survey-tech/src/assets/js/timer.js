window.addEventListener('load', function() {

  var button = document.getElementById("showArticle");

  document.addEventListener("click", function(){
    
    var button = document.getElementById("showArticle");
    button.hidden = true;
    document.getElementById("article").hidden = false;
    // Set the date we're counting down to
    var countDownDate = new Date(new Date().getTime() + 10000).getTime();

    // Update the count down every 1 second
    var x = setInterval(function() {

      // Get today's date and time
      var now = new Date().getTime();
        
      // Find the distance between now and the count down date
      var distance = countDownDate - now;
        
      // Time calculations for days, hours, minutes and seconds
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
      // Output the result in an element with id="timer"
      document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";

      var allButtons = document.querySelectorAll("input[type=button]");
      for(var i=0; i<allButtons.length; i++){
        allButtons[i].disabled = true;
      }

      // If the count down is over, write some text 
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("timer").innerHTML = "0m 0s";
        for(var i=0; i<allButtons.length; i++){
          allButtons[i].disabled = false;
        }
        document.getElementById("article").hidden = true;
      }
    }, 1000);

  });
});