var _Data = {'lat':'', 'lng':''};
mui.init();


mui.plusReady(function () {
	if (!app.store('key')) {
		plus.nativeUI.toast('请先登录后再发布');
		plus.webview.currentWebview().close();
		return;
	}
	
	plus.geolocation.getCurrentPosition(
		function (res) {
			_Data.lng = res.coords.longitude;
			_Data.lat = res.coords.latitude;
		}, 
		function () {
		}, 
		{ provider : 'baidu' }
	);
});

// 上传图片
$('.mui-icon-plusempty').on('tap', function () {
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
	plus.gallery.pick(function(e) {
		for (var i in e.files) {
			upload({'path':e.files[i]});
		}
	}, function(e) {}, {
		filter: "image", multiple:true
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
		
		try { res = JSON.parse(res); } catch (e) { status = 404 }
		
		if (status == 200) { 
			//plus.nativeUI.toast('上传文件成功');
			if (res.error && res.error.msg) { plus.nativeUI.toast(res.error.msg); return; }
			append({'path':image.path, 'id':res.id, 'name':res.img});
		} else {
			plus.nativeUI.toast('上传图片失败');
		}
	}
	var task = plus.uploader.createUpload(app.url('mobile/SecondHand/upload'), { method:"POST",blocksize:204800,priority:100 }, _cb);
	task.addFile(image.path, {key:"testdoc"});
	task.addData('key',      app.store('key'));
	task.addData('order_id', data.order_id);
	task.addData('order_no', data.order_no);
	task.start();
}

function append (image) {
	//app.log(JSON.stringify(image));
	var dom = $('<div class="mui-col-xs-4"><span class="mui-icon mui-icon-closeempty"></span></div>').appendTo($('.image-evidence'));
	$('<img />').attr('src', image.path).attr('data-id', image.id).attr('data-name', image.name).appendTo(dom);
}

// 提交退款申请
$('.btn-submit').on('tap', function () {
	var dom  = this;
	var view = plus.webview.currentWebview();
	
	var data = {
		'key'       : app.store('key'),// 用户KEY
		'lat'       : _Data.lat,
		'lng'       : _Data.lng,
		'content'   : $('[name=desc]').val(),// 二手商品描述
		'name'      : $('#name').val(),// 商品名称
		'category'  : $('#category').val(),// 产品分类
		'phone'     : $('#phone').val(),// 联系电话
		'money'     : $('#origin').val(),// 原价
		'price'     : $('#price').val(),// 二手价
		'addr'      : $('[name=addr]').val(),// 详细地址
		'images'    : [],// 图片数据
	};
	$('.image-evidence img').each(function (idx, item) {
		data.images.push({
			'id'   : $(item).attr('data-id'),
			'name' : $(item).attr('data-name'),
		});
	});
	if (!data.content || data.content.length < 10) { alert('商品描述至少输入10个字'); return; }
	if (!data.name    || data.content.name   < 3)  { alert('商品描述至少输入3个字'); return; }
	if (!data.category) { alert('请选择产品分类'); return; }
	if (!data.phone)    { alert('请输入联系电话'); return; }
	if (!data.money)    { alert('请输入原价'); return; }
	if (!data.price)    { alert('请输入二手价格'); return; }
	if (!data.addr)     { alert('请输入交易的详细地地址'); return; }
	if (data.images.length == 0)     { alert('请至少上传一张产品图片'); return; }
	
	app.log('发布数据：' + JSON.stringify(data));
	plus.nativeUI.showWaiting('正在提交...');
	$(dom).prop('disabled', true);
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/SecondHand/goods_update'),
		'data'     : data
	})
	.fail(function (res) {
		app.log('发布失败：' + JSON.stringify(res));
		app.error('发布失败');
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
	})
	.done(function (res) {
		app.log('发布结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		//app.open('refund.succeed.html', view.extras);
		setTimeout(function () { plus.webview.currentWebview().close(); }, 500);
	})
	;
});

$('.image-evidence').delegate('.mui-icon', 'tap', function () {
	var dom = this;
	plus.nativeUI.showWaiting('正在提交...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/refund_img_del'),
		'data'     : {'key':app.store('key'), 'id':$(dom).siblings('img').attr('data-id')}
	})
	.fail(function (res) {
		app.log('删除图片失败：' + JSON.stringify(res));
		app.error('删除图片失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('删除图片：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$(dom).closest('div').remove();
	})
	;
});







