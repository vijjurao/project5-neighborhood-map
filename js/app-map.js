//Global array of markers that are created inside Pin function
var markers = [];

//Open marker infowindow to corresponding marker from the list
function listClick(id) {
    google.maps.event.trigger(markers[id], 'click');
}

//Executes when window has loaded creating map, markers, and infowindows.
function init() {
    //Google map created inside the map div
    var map;
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(0, 0),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    //Initial bounds that is empty
    var bounds = new google.maps.LatLngBounds();

    //Single infowindow to be used by each marker
    var infowindow = new google.maps.InfoWindow();

    //Create markers with a given a name, latitude, longitude, and ID
    function Pin(map, name, lat, lng, id) {
        var marker;

        //Properties that each marker will have
        this.name = ko.observable(name);
        this.lat = ko.observable(lat);
        this.lng = ko.observable(lng);
        this.id = ko.observable(id);
        this.marker = ko.observable(marker);

        //Latitude and Longitude for each marker stored in a variable
        var LatLng = new google.maps.LatLng(lat, lng);

        //Options for each marker
        marker = new google.maps.Marker({
            position: LatLng,
            animation: google.maps.Animation.DROP,
            title: name,
            icon: 'images/golf.png',
            map: map
        });

        //Extend the boundries for each marker that is placed on the map
        bounds.extend(LatLng);

        //When a marker is clicked the toggleBounce function is executed
        marker.addListener('click', toggleBounce);

        /**
         * Generates a random number and returns it as a string for OAuthentication
         * @return {string}
         */

        function nonce_generate() {
            return (Math.floor(Math.random() * 1e12).toString());
        }
        //Yelp API key and token which would normally not be visible to users
        YELP_KEY = "0dt_RWZ_onDeRN_tx-JyhA";
        YELP_KEY_SECRET = "fo8iIXS_u_TjOil8uMnNTm8LdEc";
        YELP_TOKEN = "jRyu-QVU-IozwSQnZHW4u2U2Z0DVoGjd";
        YELP_TOKEN_SECRET = "AyCSVZzGk-1kxF1I34unTYKw0vc";
        var yelp_url = 'http://api.yelp.com/v2/search';

        //Parameters for retrieving Yelp information based on location and name
        //passed in for each marker
        var parameters = {
            oauth_consumer_key: YELP_KEY,
            oauth_token: YELP_TOKEN,
            oauth_nonce: nonce_generate(),
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0',
            callback: 'cb',
            location: 'Temecula',
            term: name,
            limit: 1
        };

        var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
        parameters.oauth_signature = encodedSignature;

        var settings = {
            url: yelp_url,
            data: parameters,
            cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
            dataType: 'jsonp',
            success: function(data) {

                //Content based on the name of each marker with rating, review, image, and location
                var contentString = '<div style="float:left; width:60%;">' + '<a href=' + data.businesses[0].url + '>' + data.businesses[0].name + '</a><br>' + '<img src="' + data.businesses[0].rating_img_url + '"/>' + ' ' + data.businesses[0].review_count + ' reviews<br><br>' + data.businesses[0].location.address + '<br>' + data.businesses[0].location.city + ', ' + data.businesses[0].location.state_code + ' ' + data.businesses[0].location.postal_code + '</div>' + '<div class="yelp-img" style="float:right; width:40%;"><img src="' + data.businesses[0].image_url + '">' + '</div>';

                //Change each marker back to what it was intially set at
                google.maps.event.addListener(marker, 'click', function() {
                    for (var i = 0; i < markers.length; i++) {
                        markers[i].setIcon('images/golf.png');
                    }
                    //Change the current selected marker to a golfer, open infowindow, and pan to that marker
                    this.setIcon('images/golfer.png');
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
                    map.panTo(LatLng);
                });
            },
            error: function() {
                //Set the content of the infowindow when Yelp fails
                var contentErrorString = "<p>Couldn't load Yelp information.</p>";
                infowindow.setErrorContent(contentString);
                infowindow.open(map, marker);
            }
        };

        // Send AJAX query via jQuery library.
        $.ajax(settings);

        //Filter visibility of markers on the map
        this.isVisible = ko.observable(false);

        this.isVisible.subscribe(function(currentState) {
            if (currentState) {
                marker.setMap(map);
            } else {
                marker.setMap(null);
            }
        });

        this.isVisible(true);

        //push created marker into global markers array
        markers.push(marker);
    }

    //Bounce the selected marker twice then turn off the animation
    function toggleBounce() {
        var self = this;
        if (self.getAnimation() !== null) {
            self.setAnimation(null);
        } else {
            self.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.setAnimation(null);
            }, 1400);
        }
    }

    //Set the map to fit inside the bounds of the markers
    map.fitBounds(bounds);

    //Close whichever infowindow is open when the map is clicked
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
    });

    //Set the center of the map when the window is being resized
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    //ViewModel controller that seperates model from view
    var ViewModel = function() {
        var self = this;

        //Array of pins that call the Pin function to create each marker
        self.pins = ko.observableArray([
            new Pin(map, 'Journey At Pechanga', 33.453157, -117.106526, 0),
            new Pin(map, 'Temecula Creek Inn', 33.4676068, -117.1291816, 1),
            new Pin(map, 'The Golf Club at Rancho California', 33.562563, -117.145126, 2),
            new Pin(map, 'Redhawk Golf Club', 33.468955, -117.091304, 3),
            new Pin(map, 'The Legends Golf Club', 33.515210, -117.113069, 4),
            new Pin(map, 'CrossCreek Golf Club', 33.496457, -117.225794, 5),
            new Pin(map, 'Bear Creek Golf Club', 33.582178, -117.262248, 6),
            new Pin(map, 'Fallbrook Golf Club', 33.342399, -117.191919, 7),
            new Pin(map, 'Links at Summerly', 33.649294, -117.306694, 8),
            new Pin(map, 'Diamond Valley Golf Club', 33.666240, -116.958691, 9)
        ]);

        //Take in keywords users put into search bar
        self.query = ko.observable('');

        //Filter the list and markers on the map
        self.filterPins = ko.computed(function() {
            //Make search query non case-sensitive
            var search = self.query().toLowerCase();

            //Return names of matched markers and set their visibility to true if matched
            return ko.utils.arrayFilter(self.pins(), function(pin) {
                var doesMatch = pin.name().toLowerCase().indexOf(search) >= 0;

                pin.isVisible(doesMatch);

                return doesMatch;
            });
        });
    };

    ko.applyBindings(new ViewModel());
};

//Execute init function to after the window has loaded
window.onload = init;