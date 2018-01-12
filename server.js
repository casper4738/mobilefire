const express = require('express');
const bodyParser = require('body-parser');
var http = require('http');
//var https = require('https');

const app = express();
const fs = require("fs");
const cors = require('cors');
const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

var server = http.createServer(app);

webpush.setGCMAPIKey('AAAAJCPGdbM:APA91bFTPfF0IbUeaZ05zLuW92IdjftylQ46WpX5zv8qRgi8Ygq-46t2VSB3vIna6qjo9aLzoXtJX61zhRcvVIOAUMcA03LJFaa9K-PLK0K00jJP5WO-t5-MMf5Fm4zu7EfvXIwih8Mi');

webpush.setVapidDetails(
  'mailto:a.williamrusli@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.use(bodyParser.json());
app.use("/", express.static(__dirname + "/"));
app.use("/pages", express.static(__dirname + "/pages"));
app.use("/scripts", express.static(__dirname + "/scripts"));
//app.set('PORT_HTTP', 8080);
//app.set('PORT_HTTPS', 8443);

app.use(cors());

var credentials = {
    //key: fs.readFileSync('cert/chatbot_uatmb_com-key.pem'),
    //cert: fs.readFileSync('cert/chatbot_uatmb_com-cert.pem')
    //secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2,
};

/*app.use(function(req, res, next) {
  if(!req.secure) {
  	console.log("REDIRECT");
    return res.redirect('https://mobilefire-fandy91.c9users.io/' + req.url);
  }
  next();
});*/

var pushSubscription = '';

var advRegisComplete = false;

var isTimerRun = false;

function sendPromoNotif(){
	console.log("PUSH PROMO INITIATED");
	webpush.sendNotification(pushSubscription, 'Big Discount up to 60%!')
	.then(function(result){
	  console.log(result);
	}).catch(function(error){
	  console.log('error', error);
	});
}

/*app.get('*', function(req, res) {  
    res.redirect('https://' + req.headers.host + req.url);
    // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
    // res.redirect('https://example.com' + req.url);
})*/

app.post('/sendSubscription', function(req, res){
	if(!isTimerRun)
	{
		console.log("TIMER STARTED");
		setTimeout(sendPromoNotif, 100000);
		isTimerRun = true;
	}
	
	pushSubscription = req.body;
	console.log(req.body);
	res.end("SUBSCRIPTION COMPLETED");
});

app.post('/advanced_regis_cpl', function(req, res){
	advRegisComplete = true;
	res.end("REGISTRATION COMPLETED");
});

app.get('/verificationCode', function(req, res){
	console.log("GET REQUEST VERIF CD");
	var verifCd = Math.floor(1000 + Math.random() * 9000);
	webpush.sendNotification(pushSubscription, 'Your verification code : ' + verifCd)
	.then(function(result){
	  console.log(result);
	}).catch(function(error){
	  console.log('error', error);
	});
});

app.get('/logon', function(req, res){
	if(advRegisComplete){
		advRegisComplete = false;
		res.sendFile( __dirname + "/pages/" + "login_landing_afteradv.html" );
	}
	else
		res.sendFile( __dirname + "/pages/" + "login_landing_nonadv.html" );
});

app.get('/sendPromoNotification', function(req, res){
	webpush.sendNotification(pushSubscription, 'Big Discount up to 60%!')
	.then(function(result){
	  console.log(result);
	}).catch(function(error){
	  console.log('error', error);
	});
	res.end("PROMO SEND SUCCESFULLY");
});

/*app.get('/index', function(req, res){
	if(req.secure)
		res.sendFile( __dirname + "/" + "index.html" );
	else
		res.redirect('https://' + req.headers.host + req.url);
});*/


/*var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});*/

//config when publishing 

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});

/*server.listen(app.get("PORT_HTTPS"), function () {
    console.log("I'm working https:) Port : " + app.get("PORT_HTTPS"));
});*/