var map,
    infowindow,
    marker;

document.getElementById("searchBar").addEventListener('keypress', function(e) {
    var key = e.which || e.keyCode;
    if (key == 13) {
        event.preventDefault()
    }
});

function point(name, lat, long, content) {
    this.name = name;
    this.lat = ko.observable(lat);
    this.long = ko.observable(long);
    this.content = content;
    infowindow = new google.maps.InfoWindow({
        content: content
    });
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        title: name,
        animation: google.maps.Animation.DROP,
        map: map
    });
    marker.addListener('click', toggleBounce);
    marker.addListener('click', function() {
        infowindow.open(map, this);
    });

    this.isVisible = ko.observable(false);

    this.isVisible.subscribe(function(currentState) {
        if (currentState) {
            marker.setMap(map);
        } else {
            marker.setMap(null);
        }
    });
//
    this.isVisible(true);
}


function toggleBounce() {
    if (this.getAnimation() !== null) {
        this.setAnimation(null);
    } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
    }
}
// self.filterPins = ko.computed(function () {
//     var search = self.query().toLowerCase();

//     return ko.utils.arrayFilter(self.pins(), function (pin) {
//         var math = pin.name().toLowerCase().indexOf(search) >= 0;

//         pin.marker.setVisible(match);
//         return match;
//     });
// });

// function addMarker() {
//     var marker = new google.maps.Marker({
//     position: new google.maps.LatLng(lat, long),
//     title: 'hi',
//     map: map,
//     draggable: true
//     });
// }

//function initMap() {
 // latLng = new google.maps.LatLng(33.480, -117.160)
 // var mapOptions = {
 //    center: latLng,
 //    zoom: 12,
 //    maptTypeId: google.maps.MapTypeId.ROADMAP
 // };
 // var map = new google.maps.Map(document.getElementById("map"), mapOptions);

 // marker = new google.maps.Marker({
 //    position: latLng,
 //    title: 'Sup',
 //    visible: true
 // });
 // marker.setMap(map);


 // map = new google.maps.Map(document.getElementById('map'), {

 //    center: new google.maps.LatLng(33.480, -117.160),
 //    zoom: 12,

 //    mapTypeId: google.maps.MapTypeId.ROADMAP

 //    });



 // map = new google.maps.Map(document.getElementById('map'), {

 //    //center: new google.maps.LatLng(33.493, -117.148),
 //    center: new google.maps.LatLng(33.480, -117.160),
 //    zoom: 12,

 //    mapTypeId: google.maps.MapTypeId.ROADMAP

 //    });

    //var i = 0;

    // var marker = new google.maps.Marker({

    // position: new google.maps.LatLng(ko.toJS(self.markers.lat), ko.toJS(self.markers.long)),

    // map: map,

    // clickable: true

    //marker.info = new google.maps.InfoWindow(),

    // google.maps.event.addListener(marker, 'click', function() {

    // marker.info.open(map, marker);

    // });

    // markers[i++] = marker;

    // });

    // var bounds = new google.maps.LatLngBounds();

    // for (var i = 0; i < markers.length; i++) {

    // bounds.extend(markers[i].getPosition());

    // }

    // map.fitBounds(bounds);

    // var marker = new google.maps.Marker({
    //     position: {lat: 33.480, lng: -117.160},
    //     map: map,
    //     title: 'Sup'
    // })

//}

 map = new google.maps.Map(document.getElementById('map'), {

    center: new google.maps.LatLng(33.480, -117.160),
    zoom: 12,

    mapTypeId: google.maps.MapTypeId.ROADMAP

    });

var markers = [
        new point('Temeku Hills Golf Club', 33.516145, -117.115446, '1'),
        new point('Temecula Creek Inn', 33.4676068, -117.1291816, '2'),
        new point('CrossCreek Golf Club', 33.496457, -117.225794, '3'),
        new point('The Golf Club at Rancho California', 33.562563, -117.145126, '4'),
        new point('Redhawk Golf Club', 33.468955, -117.091304, '5')
];

var ViewModel = {
    // courses: ko.observableArray([]),
    // query: ko.observable(''),

    // search: function(value) {
    //     ViewModel.courses.removeAll();

    //     if (value == '') return;

    //     for (var course in courses) {
    //         if (courses[course].nametoLowerCase().indexOf(value.toLowerCase()) >= 0) {
    //             ViewModel.users.push(courses[course]);
    //         }
    //     }
    // }
    //search: ko.observable("")
    //var self = this;
 //    var that = {};
	// that.Latitude = ko.observable();

	// that.Longitude = ko.observable();

    markers: ko.observableArray([
        {name: 'Temeku Hills Golf Club'},
        {name: 'Temecula Creek Inn'},
        {name: 'CrossCreek Golf Club'},
        {name: 'The Golf Club at Rancho California'},
        {name: 'Redhawk Golf Club'}
        ]),

        // markers: ko.observableArray([
        // new point('Temeku Hills Golf Club', 33.516145, -117.115446),
        // new point('Temecula Creek Inn', 33.4676068, -117.1291816),
        // new point('CrossCreek Golf Club', 33.496457, -117.225794),
        // new point('The Golf Club at Rancho California', 33.562563, -117.145126),
        // new point('Redhawk Golf Club', 33.468955, -117.091304)]),

    // self.markers = ko.observableArray([
    //     new point('Temeku Hills Golf Club', 33.516145, -117.115446),
    //     new point('Temecula Creek Inn', 33.4676068, -117.1291816),
    //     new point('CrossCreek Golf Club', 33.496457, -117.225794),
    //     new point('Journey At Pechanga', 33.453161, -117.106523),
    //     new point('Redhawk Golf Club', 33.468955, -117.091304)])

    query: ko.observable(''),

    search: function(value) {
        ViewModel.markers.removeAll();

        //if (value == '') return;

        for (var x in markers) {
            if (markers[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                ViewModel.markers.push(markers[x]);
            }
        }
    }
};

ViewModel.query.subscribe(ViewModel.search);
ko.applyBindings(ViewModel);
// ViewModel.search = ko.dependentObservable(function() {
//     var search = this.search().toLowerCase();
//     if (!search) {
//         return null;
//     } else {
//         return ko.utils.arrayFirst(this.filteredItems(), function(item) {
//             return ko.utils.stringStartsWith(item.name().toLowerCase(), filter);
//         });
//     }
// }, ViewModel);

