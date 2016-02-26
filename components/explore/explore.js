var module = angular.module("explore", ['ui.filters', 'uiGmapgoogle-maps']);

module.directive('explore', [function() {
  return {
    templateUrl: 'components/explore/explore-tpl.html',
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {
      admin: '='
    },
    controller: function ($scope, $timeout, $http, $sce, $interval, $filter) {
      
      // The input is an array of all artists playing in area
      this.filterData = function(retVal) {
        // Sort by popularity
        retVal = retVal.sort(function(a,b) {
          return b.popularity - a.popularity;
        });
        this.artists = retVal;
      }
      
      this.getSpotifyArtists = function() {
        var that = this;
        var retVal = [];
        
        
        // Build an array of artists
        var artistsArr = [];
        for (key in this.dict) {
          artistsArr.push({
            name: key,
            spotify_id: that.dict[key].spotify_id
          });
        }
        
        // Filter out any artists that have no spotify ID
        artistsArr = artistsArr.filter(function(a) {
          return a.spotify_id != null;
        });
        
        var n = artistsArr.length;
        var limit = 50;
        
        var mod = n % limit;
        
        var num_calls = Math.ceil(n / 50);
        
        for (i = 0; i < num_calls; i++) {
          var url = "https://api.spotify.com/v1/artists/?ids=";
          
          for (j = 0; j < limit; j++) {
            if (i * 50 + j > n - 1) 
              break;
            url += artistsArr[i * 50 + j].spotify_id + ",";
          }
          // Trim url
          url = url.slice(0, -1);
          $http.get(url).success(function(artists) {
            retVal = retVal.concat(artists.artists);
            if (retVal.length == n) {
              that.filterData(retVal);
            }

          });  
        }
        
            
      }
      
      // Retrieves spotify IDs and matches to artist in dict
      this.getArtists = function() {
        var that = this;
        var query = "";
        for (artist in this.dict) {
          query = query + this.dict[artist].info.id + ",";
        }
        query = query.slice(0, -1);
        var url = "https://api.seatgeek.com/2/performers?id=" + query;
        
        $http.get(url).success(function(artists) {
          // Now we have the artist profiles with the spotify IDs
          // Cross reference them with the dict
          // Plug the spotify IDs into the dict
          artists.performers.forEach(function(artist) {
            var spotify_link = null;
            var links = artist.links;
            links = links.filter(function(l) {
              return l.provider == "spotify";
            });
            
            if (links.length > 0) {
              spotify_link = links[0].id.slice(15);
            }
            
            // Put the spotify_link into the artists dict
            that.dict[artist.name].spotify_id = spotify_link;
            
          });
          
          that.getSpotifyArtists();
          
        });
        
      }
      
      this.getConcerts = function() {
        var that = this;
        var zip = "02138";
        var radius = "10mi";
        var max_date = "2016-3-25";
        var query = "https://api.seatgeek.com/2/events?postal_code=" + zip + "&range=" + radius + "&type=concert&per_page=1000&venue.name=" + this.venue.id;
        $http.get(query).success(function(concerts) {
          that.concerts = concerts.events;
          
          // Create a mapping of artists to concerts
          dict = {};
          that.concerts.forEach(function(concert) {
            
            concert.performers.forEach(function(p) {
              if (dict.hasOwnProperty(p.name)) {
                dict[p.name].concerts.push(concert);
              }
              else {
                dict[p.name] = {info: p, concerts: [concert]};
              }
              
            });
            
          });
          
          that.dict = dict;
          
        });
      }
      
      
      
      
      
      this.initialize = function() {
        var that = this;
        this.venues = [{
          id:"sinclair",
          name:"Sinclair",
          location: {
            latitude: 42.374446,
            longitude:-71.120633
          }
        }, {
          id:"brighton+music+hall",
          name:"Brighton Music Hall",
          location: {
            latitude: 42.352894,
            longitude:-71.132557
          }
        },{
          id:"house+of+blues+boston",
          name:"House of Blues",
          location: {
            latitude: 42.347600,
            longitude:-71.095636
          }
        }];
        this.venue = this.venues[0];
        this.concert = null;
        
        this.getConcerts();
        
        this.selected = {};
        
        this.map = { center: this.venue.location, zoom: 13 };
        
      }
      
      this.initialize();
      
      this.getPopularSongs = function(artist) {
        var that = this;
        var id = artist.id;
        var url = "https://api.spotify.com/v1/artists/" + id + "/top-tracks?country=US";
        $http.get(url).success(function(tracks) {
            var top_tracks = tracks.tracks;
            var iframe_url = "https://embed.spotify.com/?uri=spotify:trackset:Top Tracks:";
            top_tracks.forEach(function(t) {
              iframe_url += t.id + ",";
            });
            // take off one comma
            iframe_url.slice(0,-1);
          
            that.selected.iframe_url.push($sce.trustAsResourceUrl(iframe_url));
          
        });
        
      }
      
      this.select = function(concert) {
        var that = this;
        this.selected.concert = concert;
        this.selected.iframe_url = [];
        this.selected.spotify_images = [];
        var performers = concert.performers;
        
        performers.forEach(function(performer) {
          var url = "https://api.spotify.com/v1/search?q=artist:%22" + encodeURI(performer.name) + "%22&type=artist";

          $http.get(url).success(function(artists) {
            var artist = artists.artists.items[0];
            that.getPopularSongs(artist);
          });

        });
        
        
        
      }
      
      this.venueClick = function(venue) {
        this.venue=venue; 
        this.getConcerts();
        this.map.center = venue.location;
      }
      var that = this;
      
      this.markerClicked = function(a,b, venue) {
        that.venueClick(venue);
      }
      
      
      

  }
}
}]);





