//require('./landing');
//require('./album');
//require('./collection');
//require('./profile');

// Example album.
 var albumPicasso = {
	 name: 'The Colors',
	 artist: 'Pablo Picasso',
	 label: 'Cubism',
	 year: '1881',
	 albumArtUrl: '/images/album-placeholder.png',

	 songs: [
			 { name: 'Blue', length: 163.38, audioUrl: '/music/placeholders/blue' },
			{ name: 'Green', length: 105.66 , audioUrl: '/music/placeholders/green' },
			{ name: 'Red', length: 270.14, audioUrl: '/music/placeholders/red' },
			{ name: 'Pink', length: 154.81, audioUrl: '/music/placeholders/pink' },
			{ name: 'Magenta', length: 375.92, audioUrl: '/music/placeholders/magenta' }
		 ]
 };


 blocJams = angular.module('BlocJams', ['ui.router']);


blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
	 $locationProvider.html5Mode(true);

	 $stateProvider.state('landing', {
		 url: '/',
		 controller: 'Landing.controller',
		 templateUrl: '/templates/landing.html'
	 });

	 $stateProvider.state('song', {
		 url: '/song',
		 controller: 'Landing.controller',
		 templateUrl: '/templates/song.html'
	 });

	 $stateProvider.state('collection', {
		 url: '/collection',
		 controller: 'Collection.controller',
		 templateUrl: '/templates/collection.html'
	 });

	 $stateProvider.state('album', {
		url: '/album',
		templateUrl: '/templates/album.html',
		controller: 'Album.controller'
	 });

	 $stateProvider.state('charts', {
		url: '/charts',
		templateUrl: '/templates/charts.html',
		controller: 'Charts.controller'
	 });


 }]);





blocJams.controller('Charts.controller', ['$scope', 'ConsoleLogger', 'Metric', '$rootScope', function($scope, ConsoleLogger, Metric, $rootScope){


	$scope.metric = Metric;

	$scope.makeGraph = function(){

		if(document.getElementById('myChart')){

			console.log('chart');

			var dataGraph = {
				labels: ["Play", "pause", "prev", "next"],
				datasets: [
					{
						label: "My First dataset",
						fillColor: "rgba(220,220,220,0.2)",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: [Metric.clickedBtns.play, Metric.clickedBtns.pause, Metric.clickedBtns.prev, Metric.clickedBtns.nxt]
					}
				]
			};

			if (window.myNewChart) {
     		window.myNewChart.destroy();
			}

			var ctx = document.getElementById("myChart").getContext("2d");
			ctx.canvas.style.width = 500;
			ctx.canvas.style.height = 500;
			window.myNewChart = new Chart(ctx).Radar(dataGraph);
		}

	};//makegraph





	ConsoleLogger.log();

	Metric.onClickUpdate(function(event){
		$scope.makeGraph();
	});

	//first time run
	$scope.makeGraph();

	
}]);





blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', 'Metric', function($scope, SongPlayer, ConsoleLogger, Metric) {
	$scope.songPlayer = SongPlayer;
	$scope.consoleLogger = ConsoleLogger;

	$scope.logData_click = function(elementClicked){
		Metric.setLoggedClick(elementClicked);
	};

	$scope.play = function(){
		SongPlayer.play(); 
		$scope.logData_click('play');
	};

	$scope.pause = function(){
		SongPlayer.pause();
		$scope.logData_click('pause');
	};

	$scope.next = function(){
		SongPlayer.next();
		$scope.logData_click('next');
	};

	$scope.prev = function(){
		SongPlayer.previous();
		$scope.logData_click('prev');
	};
	
	$scope.volumeClass = function() {
		 return {
			'fa-volume-off': SongPlayer.volume == 0,
			'fa-volume-down': SongPlayer.volume <= 70 && SongPlayer.volume > 0,
			'fa-volume-up': SongPlayer.volume > 70
		};
	};

	SongPlayer.onTimeUpdate(function(event, time){

		$scope.$apply(function(){
			$scope.playTime = time;
		});
	});

	ConsoleLogger.log();
}]);








blocJams.controller('Collection.controller', ['$scope', 'ConsoleLogger', 'SongPlayer', function($scope, ConsoleLogger, SongPlayer){

	ConsoleLogger.log();

	$scope.albums = [];
	$scope.showOverlay = true;

	for (var i = 0; i < 33; i++) {
		 $scope.albums.push(angular.copy(albumPicasso));
	 }

	 $scope.playAlbum = function(album){
		 SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
	 }

}]);






blocJams.controller('Landing.controller', ['$scope', 'ConsoleLogger', function($scope, ConsoleLogger) {

	ConsoleLogger.log();

	$scope.pageTitle = "//Bloc Jams";
	$scope.subText = "Turn the music up!";

	$scope.albumURLs = [
		'/images/album-placeholders/album-1.jpg',
		'/images/album-placeholders/album-2.jpg',
		'/images/album-placeholders/album-3.jpg',
		'/images/album-placeholders/album-4.jpg',
		'/images/album-placeholders/album-5.jpg',
		'/images/album-placeholders/album-6.jpg',
		'/images/album-placeholders/album-7.jpg',
		'/images/album-placeholders/album-8.jpg',
		'/images/album-placeholders/album-9.jpg',
	];

	$scope.subTextClicked = function() {
		 $scope.subText += '!';
	 };


	$scope.extraCoins = function(){

		$scope.randomURLS = $scope.setFunctions.shuffle($scope.albumURLs);
	};


	$scope.setFunctions = {

		shuffle: function(o){  //v1.0
				for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
				return o;
		}

	}
}]); //Landing.controller









blocJams.controller('Album.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger){

	ConsoleLogger.log();

	 $scope.album = angular.copy(albumPicasso);

	 var hoveredSong = null;

	 $scope.onHoverSong = function(song) {
		 hoveredSong = song;
	 };

	 $scope.offHoverSong = function(song) {
		 hoveredSong = null;
	 };

	 $scope.getSongState = function(song) {
		 if (song === SongPlayer.currentSong && SongPlayer.playing) {
			 return 'playing';
		 }
		 else if (song === hoveredSong) {
			 return 'hovered';
		 }
		 return 'default';
	 };

		$scope.playSong = function(song) {
			SongPlayer.setSong($scope.album, song);
		};

		$scope.pauseSong = function(song) {
			playingSong = null;
		};


 }]); //Album.controller






/*-------------------------


SERVICES


--------------------------*/


blocJams.service('SongPlayer', ['$rootScope', function($rootScope) {
	var currentSoundFile = null;


	var trackIndex = function(album, song){
		//console.log(album);
		return album.songs.indexOf(song);
	};


	return {
		currentSong: null,
		currentAlbum: null,
		playing: false,
		volume: 90,
		prevVolume: null,

		play: function() {
			this.playing = true;
			currentSoundFile.play();
		},
		pause: function() {
			this.playing = false;
			currentSoundFile.pause();
		},
		seek: function(time) {
			 // Checks to make sure that a sound file is playing before seeking.
			 if(currentSoundFile) {
				 // Uses a Buzz method to set the time of the song.
				 currentSoundFile.setTime(time);
			 }
		 },
		onTimeUpdate: function(callback){
			return $rootScope.$on('sound:timeupdate', callback);
		},
		setVolume: function(volume) {
			if(currentSoundFile){
				currentSoundFile.setVolume(volume);
			}
			this.volume = volume;
		},
		muteToggle: function(){

			//stored previous value
			if(this.prevVolume === null){
				this.prevVolume = this.volume;
			}

			//if the volume is 0, then we want to revert to the original volume
			if(this.volume == 0){

				console.log('setting it back to old value which is ' + this.prevVolume);
				this.volume = this.prevVolume;
			}
			else {
				this.volume = 0;
			}

			//if song is playing, let's set the volume to 0
			if(currentSoundFile){
				currentSoundFile.setVolume(this.volume);
			}
		},
		setSong: function(album, song) {
			if (currentSoundFile) {
				currentSoundFile.stop();
			}

			this.currentAlbum = album;
			this.currentSong = song;

			currentSoundFile = new buzz.sound(song.audioUrl, {
				formats: [ "mp3" ],
				preload: true
			});

			currentSoundFile.setVolume(this.volume);

			currentSoundFile.bind('timeupdate', function(e){
				$rootScope.$broadcast('sound:timeupdate', this.getTime());
			});

			this.play();

		},
		next: function(){
			var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
			currentTrackIndex++;

			if(currentTrackIndex >= this.currentAlbum.songs.length){

				this.playing = false;
				this.currentSong = null;
				this.currentAlbum = null;

				currentSoundFile.pause();
				currentSoundFile = null;

				return;
			}

			var song = this.currentAlbum.songs[currentTrackIndex];
			this.setSong(this.currentAlbum, song);

			this.currentSong = this.currentAlbum.songs[currentTrackIndex];
		},
		previous: function(){
			var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
			currentTrackIndex--;

			if(currentTrackIndex < 0) {
				this.playing = false;
				this.currentSong = null;
				this.currentAlbum = null;

				currentSoundFile.pause();
				currentSoundFile = null;

				return;
			}

			var song = this.currentAlbum.songs[currentTrackIndex];
			this.setSong(this.currentAlbum, song);

			this.currentSong  = this.currentAlbum.songs[currentTrackIndex];
		}
	};
}]);




blocJams.service('ConsoleLogger', function() {
	return {
		string: 'hello world',
		log: function(){
			console.log(this.string);
		}
	}
});



// Create a Metric Service.
blocJams.service('Metric', ['$rootScope', function($rootScope) {

	$rootScope.songPlays = [];

	return {
		clickedBtns : {
			pause: 0,
			play: 0,
			prev: 0,
			nxt: 0
		},

		// Function that records a metric object by pushing it to our $rootScope array.
		registerSongPlay: function(songObj) {
			// Add time to event register.
			songObj['playedAt'] = new Date();
			$rootScope.songPlays.push(songObj);
		},
		listSongsPlayed: function() {
			var songs = [];
			angular.forEach($rootScope.songPlays, function(song) {
				// Check to make sure the song isn't added twice.
				if (songs.indexOf(song.name) != -1) {
					songs.push(song.name);
				}
			});
			return songs;
		},

		onClickUpdate: function(callback){
			return $rootScope.$on('btn:click', callback);
		},

		setLoggedClick: function(elementClicked){

			switch(elementClicked) {
				case 'pause':
					this.clickedBtns.pause = this.clickedBtns.pause+1;
					$rootScope.$broadcast('btn:click', this.clickedBtns);
					break;

				case 'play':
					this.clickedBtns.play = this.clickedBtns.play+1;
					$rootScope.$broadcast('btn:click', this.clickedBtns);
					break;

				case 'next':
					this.clickedBtns.nxt = this.clickedBtns.nxt+1;
					$rootScope.$broadcast('btn:click', this.clickedBtns);
					break;

				case 'prev': 
					this.clickedBtns.prev = this.clickedBtns.prev+1;
					$rootScope.$broadcast('btn:click', this.clickedBtns);
					break;
			}
		}
	}
}]);



// var audio = 'http://lso.co.uk/images/LSO0092ex2b.mp3';

//       var fadeInOut = function(audioClip){

//         var song = new buzz.sound(audioClip).play().fadeIn(function(){
//           setTimeout(fadeSongOut, 5000)
//         });

//         var fadeSongOut = function () {
//           song.fadeOut();
//         }

//       };//

//       fadeInOut(audio);



/*-------------------------


DIRECTIVES


--------------------------*/
blocJams.directive('slider', ['$document',  function($document){

	// Returns a number between 0 and 1 to determine where the mouse event happened along the slider bar.
	 var calculateSliderPercentFromMouseEvent = function($slider, event) {
		 var offsetX =  event.pageX - $slider.offset().left; // Distance from left
		 var sliderWidth = $slider.width(); // Width of slider
		 var offsetXPercent = (offsetX  / sliderWidth);
		 offsetXPercent = Math.max(0, offsetXPercent);
		 offsetXPercent = Math.min(1, offsetXPercent);
		 return offsetXPercent;
	 };

	 var numberFromValue = function(value, defaultValue) {
		 if (typeof value === 'number') {
			 return value;
		 }
 
		 if(typeof value === 'undefined') {
			 return defaultValue;
		 }
 
		 if(typeof value === 'string') {
			 return Number(value);
		 }
	 };

	 return {
		 templateUrl: '/templates/directives/slider.html', // We'll create these files shortly.
		 replace: true,
		 scope: {
			onChange: '&'
		 }, // Creates a scope that exists only in this directive.
		 restrict: 'E',
		 link: function(scope, element, attributes) {

			scope.value = 0;

			scope.max = 100;
			var $seekBar = $(element);
	
			attributes.$observe('value', function(newValue) {
				scope.value = numberFromValue(newValue, 0);
			});
 
			attributes.$observe('max', function(newValue) {
				scope.max = numberFromValue(newValue, 100) || 100;
			});


			var percentString = function () {
				 var value = scope.value || 0;
					var max = scope.max || 100;
					percent = value / max * 100;
					return percent + "%";
			 }
 
			 scope.fillStyle = function() {
				 return {width: percentString()};
			 }
 
			 scope.thumbStyle = function() {
				 return {left: percentString()};
			 }

			 scope.onClickSlider = function(event) {
				 var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
				 scope.value = percent * scope.max;
				 notifyCallback(scope.value);
			 }

			 scope.a12 = function() {
				 $document.bind('mousemove.thumb', function(event){
					 var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
					 scope.$apply(function(){
						 scope.value = percent * scope.max;
						 notifyCallback(scope.value);
					 });
				 });
 
				 //cleanup
				 $document.bind('mouseup.thumb', function(){
					 $document.unbind('mousemove.thumb');
					 $document.unbind('mouseup.thumb');
				 });
			 };

			var notifyCallback = function(newValue) {
				 if(typeof scope.onChange === 'function') {
					 scope.onChange({value: newValue});
				 }
			 };

		}
	}// link

}]);





/*-------------------------


FILTERS


--------------------------*/
 blocJams.filter('timecode', function(){
	 return function(seconds) {
		 seconds = Number.parseFloat(seconds);
 
		 // Returned when no time is provided.
		 if (Number.isNaN(seconds)) {
			 return '-:--';
		 }
 
		 // make it a whole number
		 var wholeSeconds = Math.floor(seconds);
 
		 var minutes = Math.floor(wholeSeconds / 60);
 
		 remainingSeconds = wholeSeconds % 60;
 
		 var output = minutes + ':';
 
		 // zero pad seconds, so 9 seconds should be :09
		 if (remainingSeconds < 10) {
			 output += '0';
		 }
 
		 output += remainingSeconds;
 
		 return output;
	 }
 })


