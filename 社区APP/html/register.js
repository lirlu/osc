var _iid = 0, times = 59;

mui.init();

function countdown () {
	clearInterval(_iid);
	$('#code').addClass('mui-disabled');
	_iid = setInterval(function () {
		if (--times <= 0) {
			clearInterval(_iid);
			$('#code').text('验证码').removeClass('mui-disabled');
		} else {
			$('#code').text(times);	
		}
	}, 1000);
}

// 发送验证码
$('#code').on('tap', function () {
	if ($(this).hasClass('mui-disabled')) { return; }
	if (false == /^\d{11,14}$/g.test($('#tel').val())) {
		plus.nativeUI.toast('请输入手机号码'); return;
	}
	
	countdown();
	
	console.log('发送验证码：' + app.url('mobile/user/verification'));
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/user/verification'),
		'data'     : { 'mobile':$('#tel').val() }
	})
	.fail(function (res) {
		console.log('发送验证码失败：' + JSON.stringify(res));
		app.error('发送验证码失败');
		times = 0;
	})
	.done(function (res) {
		console.log('发送验证码结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		
		if (res.msg) { plus.nativeUI.toast(res.msg); };
	})
	;
	
});

// 选择服务条款
$('#checkbox').on('tap', function () {
	
});

// 点击提交
$('#submit').on('tap', function () {
	var data = {
		mobile    : $('#tel').val(),
		code      : $('#code1').val(),
		password1 : $('#password1').val(),
		password2 : $('#password2').val(),
	};
	
	if (data.mobile == '') {
		alert('手机号码输入不能为空'); return;
		
	} else if (!/^\d{11,14}$/g.test(data.mobile)) {
		alert('手机号码输入有错'); return;
		
	} else if (data.code == '') {
		alert('验证码输入不能为空'); return;
		
	} else if (data.password1 == '') {
		alert('密码输入不能为空'); return;
		
	} else if (!/^[\w\d]{5,}$/.test(data.password1)) {
		alert('密码输入不能小于六位数'); return;
		
	} else if (data.password2 != data.password1) {
		alert('两次密码输入不一致'); return;
		
	} else if (false == $('#checkbox').is(':checked')) {
		alert('请选择服务条款'); return;
	}
	
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/user/register'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('注册失败：' + JSON.stringify(res));
		app.error('注册失败');
		clearInterval(_iid);
	})
	.done(function (res) {
		console.log('注册结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		if (1 == res.status) {
			
			var js = "$('#tel').val('"+data.mobile+"');"
			try { plus.webview.getWebviewById('log.html').evalJS(js) } catch (e) {}
			//setTimeout(function () {app.open('log.html', {'mobile':data.mobile});}, 200);
			setTimeout(function () {plus.webview.currentWebview().close();}, 500);
		}
	})
	;
});


$(window).resize(function() {
	var myDataL = $(".input-div").length;
	var winWidth = $(window).width();
	var lDiv = "";
	for (i = 0; i < myDataL; i++) {
		lDiv = $(".input-div").eq(i).children(".block").width() + 15;
		$(".input-div").eq(i).children("input").width(winWidth - lDiv);
	}
}).resize();




