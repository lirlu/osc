mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	
	$('#shop-name').text(view.extras.name);
	
	locate(view.extras.addr, view.extras.lng, view.extras.lat);
});

function locate (addr, lng, lat) {
	// 百度地图API功能
	var map = new BMap.Map("allmap");
	var point = new BMap.Point(lng, lat);
	map.centerAndZoom(point, 12);
	// 创建地址解析器实例
	var myGeo = new BMap.Geocoder();
	// 将地址解析结果显示在地图上,并调整地图视野
	myGeo.getPoint(addr, function(point){
		if (point) {
			map.centerAndZoom(point, 16);
			map.addOverlay(new BMap.Marker(point));
		}else{
			alert("您选择地址没有解析到结果!");
		}
	}, "北京市");
	app.log('lng：'+lng + '    lat：' + lat);
}
