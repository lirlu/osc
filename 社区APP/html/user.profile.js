$('.fre4 .sex').click(function() {
	$(this).addClass('active');
	$(this).siblings().removeClass('active');
});


// 选择头像
$('.btn-pick-image').on('tap', function () {
	var btns = [{title:"拍照" }, {title: "从手机相册选择"}];
	
	plus.nativeUI.actionSheet({
		title   : "选择照片",
		cancel  : "取消",
		buttons : btns
	}, function(btn) {
		switch (btn.index) {
			case 0:
				break;
			case 1:
				getFromCamera();
				break;
			case 2:
				getFromGallery();
				break;
			default:
				break
		}
	});
});


function getFromCamera () {
	var camera = plus.camera.getCamera();
	camera.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			cutter({'path':entry.toLocalURL()});
		}, function(e) {
			plus.nativeUI.toast("读取拍照文件错误：" + e.message);
		});
	}, function(res) {
		plus.nativeUI.toast(res);
	}, {
		filename: "_doc/head.jpg"
	});
}

function getFromGallery () {
	plus.gallery.pick(function(a) {
		plus.io.resolveLocalFileSystemURL(a, function(entry) {
			cutter({'path':entry.toLocalURL()});
		}, function(e) {
			console.log("读取本地相册错误：" + e.message);
		});
	}, function(a) {}, {
		filter: "image"
	});
};
function cutter (image) {
	$('.container-cropper-holder img').cropper('replace', image.path);
	$('.container-cropper-holder').attr('data-path', image.path).show();
	//upload(image);
}
function upload (image) {
	//console.log('上传数据' + JSON.stringify(image));
	$('.touxia>img').attr('data-name', '');
	plus.nativeUI.showWaiting('正在处理...');
	function _cb (result, status) {
		var res = result.responseText;
		plus.nativeUI.closeWaiting();
		
		try { res = JSON.parse(res); } catch (e) { status = 404 }
		
		if (status == 200) {
			//plus.nativeUI.toast('上传文件成功');
			append({'path':image.path, 'id':res.id, 'name':res.img});
		} else {
			console.log('上传头像失败：' + result.responseText);
			plus.nativeUI.toast('上传图片失败');
		}
	}
	var task = plus.uploader.createUpload(app.url('mobile/userinfo/upload'), { method:"POST",blocksize:204800,priority:100 }, _cb);
	task.addFile(image.path, {key:"testdoc"});
	task.addData('key', app.store('key'));
	task.addData('thumb', image);
	task.start();
}
function append (image) {
	//console.log(JSON.stringify(image));
	$('.touxia>img').attr('data-name', image.name).attr('src', app.link.image + image.name);
}
// 取消编辑头像
$('.btn-no').on('tap', function (e) {
	e.stopPropagation();
	$('.container-cropper-holder').hide();
});
// 确认上传新头像
$('.btn-ok').on('tap', function (e) {
	e.stopPropagation();
	var data  = $('.container-cropper-holder img').cropper('getData');
	data.path = $('.container-cropper-holder').attr('data-path');
	
	$('.container-cropper-holder').hide();
	upload(data);
});
$('.container-cropper-holder img').cropper({
	aspectRatio : 1,
	viewMode    : 3,
});

// 提交用户信息
$('.btn-submit').on('tap', function () {
	var dom  = this;
	var data = {
		'key'      : app.store('key'),
		'img'      : $('.touxia>img').attr('data-name'),
		'sex'      : $('.sex.active').attr('data-sex'),
		'nickname' : $('#name').val(),
		'mobile'   : $('#mobile').val(),
	};
	if (!data.nickname) { plus.nativeUI.toast('请填写昵称'); return; }
	if (!data.mobile) { plus.nativeUI.toast('请填写手机号'); return; }
	
	console.log('修改用户信息：' + JSON.stringify(data));
	plus.nativeUI.showWaiting();
	$(dom).prop('disabled', true);
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/userinfo/head_portrait_update'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('保存用户信息失败：' + JSON.stringify(res));
		app.error('保存用户信息失败');
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
	})
	.done(function (res) {
		console.log('保存用户信息：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
		
		document.activeElement.blur();
		if (res.error && res.error.msg) { app.error(res.error.msg); localStorage.removeItem('key'); return; }
		if (false == res.status) {app.error(res.msg); localStorage.removeItem('key'); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		
		plus.webview.getWebviewById('user.html').evalJS('refresh()');
		setTimeout(function () {
			plus.webview.currentWebview().close();
		}, 500);
	})
	;
});

mui.plusReady(function () {
	var user = app.store('user');
	$('.touxia>img').attr('src', user.img ? (app.link.image + user.img) : '../img/iconfont-morentouxiang.png'),
	//$('.sex.active').attr('data-sex');
	$('#name').val(user.nickname);
	$('#mobile').val(user.mobile);
});



