var module = angular.module("music", ['ui.filters']);

module.directive('music', [function() {
  return {
    templateUrl: 'components/music/music-tpl.html',
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {
      admin: '='
    },
    controller: function ($scope, $timeout, $http, $sce, $interval, $filter) {
      var that = this;
      
      this.loadAow = function(id) {
        var that = this;
        $http.get("https://api.spotify.com/v1/albums/" + id).success(function(album) {
          that.aow = album;
        });
        
      }
      
      this.getFM = function() {
        $http.get(this.lastfm_url).
          success(function(data) {
            that.track = data.recenttracks.track[0];
            if (that.track["@attr"] != null) {
              that.currentlyPlaying = that.track["@attr"].nowplaying;
            }
          
            // This stuff is used to show images
            var allTracks = data.recenttracks.track;
            that.otherTracks = allTracks;
            
            // Filter out any tracks that don't have an associated image
            that.otherTracks.forEach(function(t) {
              t.pic_id = t.image[2]["#text"];
            });
          
            that.otherTracks = that.otherTracks.filter(function(t) {
              return t.pic_id!="";
            });
          
            that.otherTracks = that.otherTracks.slice(1);
          
            spotify_request_url = encodeURI(that.track.name + " " + that.track.artist["#text"] + " " + that.track.album["#text"]);
            that.spotify(spotify_request_url);
            
          });
      }
      
      this.initialize = function() {
        var that = this;
        
        this.lastfm_url ='http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=cabotcafe&api_key=abda6dd3690d6390af3a31c97eaf36b3&format=json';
        
        this.tweenTime = 2000;
        
        // Array of suggested songs
        this.suggested = [];
        
        this.aow_id = "6r3zqNcZez592ryTIWUWce";
        this.aow_url = $sce.trustAsResourceUrl("https://embed.spotify.com/?uri=spotify%3Aalbum%3a" + this.aow_id);
        
        this.loadAow(this.aow_id);
        
        // Whether or not to show submitted song message
        this.submitted = false;
        
        this.getFM();
      }
      
      this.initialize();
      
      this.spotify = function(spotify_request_url) {
        console.log(spotify_request_url);
        var that = this;
        spotify_request_url = spotify_request_url.replace(":", "");
        $http.get("https://api.spotify.com/v1/search?q=" + spotify_request_url + "&type=track").success(function(spotify_track) {
          var track = spotify_track;
          // Check whether items is empty - this is a backup in case there is an album issue
          if (track.tracks.items.length == 0) {
            spotify_request_url = encodeURI(that.track.name + " " + that.track.artist["#text"]);
            spotify_request_url = spotify_request_url.replace(":", "");
            $http.get("https://api.spotify.com/v1/search?q=" + spotify_request_url + "&type=track").success(function(t) {
              track = t;
              that.spotifyURLs(track);
            });
          }
          else {    
            that.spotifyURLs(track);
          }
          
      });
      }
      
      this.spotifyURLs = function(track) {
          var that = this;
          that.track_s = track.tracks.items[0];
          var url = "https://embed.spotify.com/?uri=spotify%3Aalbum%3a" + that.track_s.album.id + "&theme=white&view=coverart";
          var follow_url = "https://embed.spotify.com/follow/1/?uri=spotify:artist:" + that.track_s.artists[0].id + "&size=detail&theme=light";

          that.widget_url = $sce.trustAsResourceUrl(url);
          that.follow_url = $sce.trustAsResourceUrl(follow_url);
            
      }
      
      
      
      
      $interval(function() {
        that.getFM();
      }, this.tweenTime);
      
      // search for playlists based on ctrl.plSearch
      this.searchForTracks = function() {
        var that = this;
        
        // Make sure the submitted message is disabled
        this.submitted = false;
        
        if (this.tSearch == "" && this.aSearch == "") {
          this.searchTracks = [];
          return true;
        }
        
        var query = encodeURI(this.tSearch);
        var artistQuery = encodeURI(this.artSearch);
        var search = 'https://api.spotify.com/v1/search?q=track:"' + query + '"+artist:"' + artistQuery + '"&type=track&limit=50';
        $http.get(search).success(function(tracks) {
          // get the array of playlist objects
          tracks = tracks.tracks.items;
          
          // tag each with an identifier for filtering
          tracks.forEach(function(t) {
            t.identifier = t.name + t.artists[0].name;
          });
          that.searchTracks = tracks;
        });
      }
      
      
      this.suggestTrack = function(track) {
        var email = "music@cabotcafe.com";
        var openLink = "https://open.spotify.com/track/" + track.id;
        var message = "Someone just suggested that we add " + track.name + " by " + track.artists[0].name + " to our playlist. The link to open this song in Spotify is: " + openLink;
        $http.post("//formspree.io/" + email, {message: message });
        
        this.suggestedTrack = track;
        this.suggested.unshift(track);
        this.artSearch = "";
        this.tSearch = "";
        this.searchTracks = [];
        
        this.submitted = true;
        
      }
      

      
  }
}
}]);





