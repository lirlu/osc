var _url = 'http://192.168.2.15/index.php?s=/mobile/index/union_seller';
//请求函数
$.ajax({
	url: 'http://192.168.2.15/index.php?s=/mobile/index/union_seller',
	type: 'get',
	data: {
		page: 1
	},
	success: function(data) {

		var datas = JSON.stringify(data);
		console.log(datas);
		var html = template(id, data);		alert(html)
		document.querySelector(text).innerHTML = html;
		fn && fn();
	},
	error: function(err) {

		alert(JSON.stringify(err));
	},
	dataType: 'json'
});
alert()