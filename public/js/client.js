$(function() {
	var socket = io.connect('http://localhost:4000');
	var drawingBoard = new DrawingBoard('board');
	var container = document.getElementsByClassName("video-container")[0];
	var marquee = $('.marquee');
	var streams = [];

	// jQuery scrolling marquee text
    marquee.marquee({
		duration: 5000,
		delayBeforeStart: 0,
		direction: 'right',
		allowCss3Support: true,
		css3easing: 'ease-in'
	});

	// webrtc connection handling
	rtc.connect('ws://localhost:4001');
	rtc.on('add remote stream', addNewUser);
	rtc.on('disconnect stream', removeUser);

	/*** socket actions ***/

	socket.on('draw', function(data) {
		drawingBoard.draw(data);
	});

	// socket.on('greeting', function(data) {
	// 	var $message = $('#message');
	// 	$message.text(data);
	// });

	/*
	 * Adds a user to the webRTC lobby
	 * @params stream - the new video stream
	 */
	function addNewUser(stream) {
		var videoWrapper = document.createElement("div");
		var newVideo = document.createElement("video");
		newVideo.autoplay = true;
		videoWrapper.className = 'video-wrapper';

		videoWrapper.appendChild(newVideo);
		container.appendChild(videoWrapper);
		streams.push(videoWrapper);

		rtc.attachStream(stream, newVideo);

		newVideo.addEventListener("playing", function() {
			videoWrapper.className += ' fade-in';
		});
		console.log("Adding new user #" + streams.length);
	};

	/*
	 * Removes a user whom disconnects from the webRTC lobby
	 * @params stream - the video stream being removed
	 */
	function removeUser(stream) {
		if (streams.length > 0) {
			Object.keys(rtc.peerConnections).forEach(function(element, index, array) {
				if (element == stream) {
					container.removeChild(streams[index]);
					streams.splice(index, 1);
					console.log("Removing user #" + (index + 1));
				}
			});
		}
	};
});
