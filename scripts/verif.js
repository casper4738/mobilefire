'use strict';

(function(){
	//Checking if browser supports serviceWorker
	if ('serviceWorker' in navigator) {
	  navigator.serviceWorker.addEventListener('message', function(event) {
             //console.log(event.data.verif);
             document.getElementById('verif_token1').value = event.data.verif.substring(0,1);
             document.getElementById('verif_token2').value = event.data.verif.substring(1,2);
             document.getElementById('verif_token3').value = event.data.verif.substring(2,3);
             document.getElementById('verif_token4').value = event.data.verif.substring(3,4);
      });
	}
	
	$(".verif_token_input").keyup(function () {
        if (this.value.length == 1) {
          $(this).next('.verif_token_input').focus();
        }
     });
})();
