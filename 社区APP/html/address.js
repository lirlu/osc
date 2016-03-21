var picker = new mui.PopPicker({layer: 3});
picker.setData(cityData3);

$('.btn-area').on('tap', function(event) {
	console.log('show');
	picker.show(function(items) {
		$('.btn-area .deji').text((items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text);
		
		//返回 false 可以阻止选择框的关闭
		//return false;
	});
});