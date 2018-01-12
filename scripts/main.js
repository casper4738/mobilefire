'use strict';

(function(){
	//Checking if browser supports serviceWorker
	if ('serviceWorker' in navigator) {
	  console.log('Service Worker is supported on this browser');
	  //alert("SW Run!");
	  
	  navigator.serviceWorker.register('sw.js').then(function() {
	    return navigator.serviceWorker.ready;
	  }).then(function(reg) {
	    console.log('Service Worker is ready to go!', reg);
	    reg.pushManager.subscribe(
	      {
	        userVisibleOnly: true
	      }
	    ).then(function(sub) {
			var xhr = new XMLHttpRequest();
			var url = "https://mobilefire-fandy91.c9users.io/sendSubscription";
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					console.log("JSON SENT SUCCESSFULLY");
				}
			};
			var data = JSON.stringify(sub);
			xhr.send(data);
		  console.log('Service worker calling push manager subscribe');
	      console.log(JSON.stringify(sub));
	    });
	  }).catch(function(error) {
	    console.log('Service Worker failed to boot', error);
	  });
	}
})();