mui.init();

mui.plusReady(function () {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	var key = app.store('key');
	plus.nativeUI.showWaiting('正在查询订单信息...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/refund_view'),
		'data'     : {'key':key, 'order_id':data.order_id, 'order_no':data.order_no}
	})
	.fail(function (res) {
		console.log('查询退款订单信息失败：' + JSON.stringify(res));
		app.error('查询退款订单信息失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('退款订单信息：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('.total').text(res.price / 100);
		$('.postage').text(res.freight);
	})
	;
});

// 上传图片
$('.mui-icon-plusempty').on('tap', function () {
	var btns = [{title:"拍照" }, {title: "从手机相册选择"}];
	
	plus.nativeUI.actionSheet({
		title   : "修改头像",
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
			upload({'path':entry.toLocalURL()});
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
			upload({'path':entry.toLocalURL()});
		}, function(e) {
			console.log("读取本地相册错误：" + e.message);
		});
	}, function(a) {}, {
		filter: "image"
	});
};

function upload (image) {
	var view = plus.webview.currentWebview();
	var data = view.extras;
	
	var key = app.store('key');
	plus.nativeUI.showWaiting('正在处理...');
	function _cb (result, status) {
		var res = result.responseText;
		plus.nativeUI.closeWaiting();
		console.log(res);
		
		// 上传完成
		if ( status == 200 ) { 
			//plus.nativeUI.toast('上传文件成功');
			append(image);
		} else {
			plus.nativeUI.toast('上传图片失败');
		}
	}
	var task = plus.uploader.createUpload(app.url('mobile/order/upload'), { method:"POST",blocksize:204800,priority:100 }, _cb);
	task.addFile(image.path, {key:"testdoc"});
	task.addData('key',      app.store('key'));
	task.addData('order_id', data.order_id);
	task.addData('order_no', data.order_no);
	task.start();
}

function append (image) {
	var dom = $('<div class="mui-col-xs-4"></div>').appendTo($('.image-evidence'));
	$('<img />').attr('src', image.path).attr('data-id', image.id).attr('data-name', image.img).appendTo(dom);
}



