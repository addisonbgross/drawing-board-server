var express = require('express');
var mustache = require('mustache-express');
var favicon = require('serve-favicon');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var port = process.env.PORT || 4000;
var rtcPort = 4001;
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var webRTC = require('webrtc.io').listen(rtcPort);

// express setup
app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(bodyParser.json());                         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

// mustache-express templating engine
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/public/views'));

/*** routing ***/

// enable cross-origin requests
app.all ('*', function (req, res, next) {
	res.header ('Access-Control-Allow-Origin', '*');
	res.header ('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});

app.get('/', function (req, res) {
	res.render('projector.html');
});

/*** server ***/

http.listen(port, function(error) {
    if (error) {
        return console.log("ERROR: ", error);
    }
	console.log('node on: ' + port);
    console.log('rtc on: ' + rtcPort);
});

/*** socket actions ***/

io.on('connection', function(socket) {
    socket.on('draw', function(data) {
		io.emit('draw', data);
    });

	socket.on('greeting', function(data) {
		io.emit('greeting', data);
	});
});
