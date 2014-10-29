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
       { name: 'Blue', length: '4:26' },
       { name: 'Green', length: '3:14' },
       { name: 'Red', length: '5:01' },
       { name: 'Pink', length: '3:21'},
       { name: 'Magenta', length: '2:15'}
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


 }]);


blocJams.controller('Collection.controller', ['$scope', 'ConsoleLogger', function($scope, ConsoleLogger){

  ConsoleLogger.log();

  $scope.albums = [];
  $scope.showOverlay = true;

  for (var i = 0; i < 33; i++) {
     $scope.albums.push(angular.copy(albumPicasso));
   }

}])






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
      SongPlayer.play();
    };

    $scope.pauseSong = function(song) {
      playingSong = null;
    };


 }]); //Album.controller



/////////////////////////////////
//SONG PLAYER RELATED CONTROLLER

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger) {
  $scope.songPlayer = SongPlayer;
  $scope.consoleLogger = ConsoleLogger;

  ConsoleLogger.log();
}]);









blocJams.service('SongPlayer', function() {
  var trackIndex = function(album, song){
    //console.log(album);
    return album.songs.indexOf(song);
  };


  return {
    currentSong: null,
    currentAlbum: null,
    playing: false,

    play: function() {
      this.playing = true;
    },
    pause: function() {
      this.playing = false;
    },
    setSong: function(album, song) {
      this.currentAlbum = album;
      this.currentSong = song;
    },
    next: function(){
      var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
      currentTrackIndex++;

      if(currentTrackIndex >= this.currentAlbum.songs.length){

        this.playing = false;
        this.currentSong = null;
        this.currentAlbum = null;

        return;
      }

      this.currentSong = this.currentAlbum.songs[currentTrackIndex];
    },
    previous: function(){
      var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
      currentTrackIndex--;

      if(currentTrackIndex < 0) {
        this.playing = false;
        this.currentSong = null;
        this.currentAlbum = null;
        return;
      }

      this.currentSong  = this.currentAlbum.songs[currentTrackIndex];
    }
  };
});




blocJams.service('ConsoleLogger', function() {
  return {
    string: 'hello world',
    log: function(){
      console.log(this.string);
    }
  }
});




