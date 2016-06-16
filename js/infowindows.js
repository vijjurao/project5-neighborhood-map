function setMarkers(map, locations) {
  // Add markers to the map

    for (var i = 0; i < locations.length; i++) {
        var place = locations[i];
        var myLatLng = new google.maps.LatLng(place.lat, place.lng);
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            icon: '/images/google_maps/numbers/'+(i+1)+'.png',
            html: place.name,
            id: place.id,
            title: place.name
        });

        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function() {
          load_content(map,this,infowindow);
        });
    }
}

function load_content(map,marker,infowindow){
  $.ajax({
    url: '/places/' + marker.id + '.js',
    success: function(data){
      infowindow.setContent(data);
      infowindow.open(map, marker);
    }
  });
}

/**
 * Generates a random number and returns it as a string for OAuthentication
 * @return {string}
 */
function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

var yelp_url = YELP_BASE_URL + 'business/' + self.selected_place().Yelp.business_id;

    var parameters = {
      oauth_consumer_key: 0dt_RWZ_onDeRN_tx-JyhA,
      oauth_token: jRyu-QVU-IozwSQnZHW4u2U2Z0DVoGjd,
      oauth_nonce: nonce_generate(),
      oauth_timestamp: Math.floor(Date.now()/1000),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version : '1.0',
      callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    };

    var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, fo8iIXS_u_TjOil8uMnNTm8LdEc, AyCSVZzGk-1kxF1I34unTYKw0vc);
    parameters.oauth_signature = encodedSignature;

    var settings = {
      url: yelp_url,
      data: parameters,
      cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
      dataType: 'jsonp',
      success: function(results) {
        // Do stuff with results
        console.log("success");
      },
      error: function() {
        // Do stuff on fail
        console.log("error");
      }
    };

    // Send AJAX query via jQuery library.
    $.ajax(settings);