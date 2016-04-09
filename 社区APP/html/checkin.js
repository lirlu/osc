mui.plusReady(function () {
	var now = new Date();
	$('.now-day').text(now.getMonth() + 1 + '月' + now.getDate() + '日');
	$('.now-year').html(now.getYear() + '<p>今日</p>')
	
	var days = new Date(now.getYear(), now.getMonth(), 0).getDate();
	var from = new Date(now.getYear(), now.getMonth(), 1).getDay();
	var i = 0;
	
	$('.calendar table>tbody td').each(function (idx, dom) {
		if (idx >= from && i <= days) {
			$(dom).html('<span>'+ (++i) +'</span>');
			if (i == now.getDate()) { $(dom).addClass('checked round'); }
		}
	});
});