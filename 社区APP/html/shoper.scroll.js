var data = {'type':'', 'page':0, 'limit':9999}
function next () {
	
}

mui.plusReady(function() {
	plus.geolocation.getCurrentPosition(function(e) {
		var lat = e.coords.latitude;
		var lng = e.coords.longitude;
		var Storage = window.localStorage;
		var lat1 = Storage.getItem('lat');
		var lng1 = Storage.getItem('lng');
		var a = new plus.maps.Point(lat, lng);
		var b = new plus.maps.Point(lat1, lng1)
		plus.maps.Map.calculateDistance(a, b, function(event) {
			var Storage = window.localStorage;
			Storage.setItem('dist', event.distance / 1000);
		}, function(e) {
			alert("Failed:" + JSON.stringify(e));
		});
	}, {
		provider: 'baidu'
	});
});