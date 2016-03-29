
// 上传图片
$('.mui-icon-plusempty').on('tap', function () {
	var btns = [{title:"拍照" }, {title: "从手机相册选择"}];
	
	plus.nativeUI.actionSheet({
		title   : "产中照片",
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
		
		try { res = JSON.parse(res); } catch (e) { status = 404 }
		
		if (status == 200) { 
			//plus.nativeUI.toast('上传文件成功');
			append({'path':image.path, 'id':res.id, 'name':res.img});
		} else {
			plus.nativeUI.toast('上传图片失败');
		}
	}
	var task = plus.uploader.createUpload(app.url('mobile/Property/upload'), { method:"POST",blocksize:204800,priority:100 }, _cb);
	task.addFile(image.path, {key:"testdoc"});
	task.addData('key',      app.store('key'));
	task.addData('order_id', data.order_id);
	task.addData('order_no', data.order_no);
	task.start();
}

// 追加图片显示到页面
function append (image) {
	//console.log(JSON.stringify(image));
	var dom = $('<div class="mui-col-xs-4"><span class="mui-icon mui-icon-closeempty"></span></div>').appendTo($('.image-evidence'));
	$('<img />').attr('src', image.path).attr('data-id', image.id).attr('data-name', image.name).appendTo(dom);
}
// 移除上传图片
$('.image-evidence').delegate('.mui-icon', 'tap', function () {
	var dom = this;
		
	$(dom).closest('div').remove();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/Property/refund_img_del'),
		'data'     : {'key':app.store('key'), 'id':$(dom).siblings('img').attr('data-id')}
	})
	.fail(function (res) {
		console.log('删除图片失败：' + JSON.stringify(res));
		app.error('删除图片失败');
	})
	.done(function (res) {
		console.log('删除图片：' + JSON.stringify(res));
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
	})
	;
});

// 发布活动
$('.btn-submit').on('tap', function () {
	var dom  = this;
	var view = plus.webview.currentWebview();
	
	var data = {
		'key'        : app.store('key'),// 用户KEY
		'content'    : $('#content').val(),// 内容
		'title'      : $('#title').val(),// 名称
		'addr'       : $('#addr').val(),// 活动地址
		'act_day'    : $('#act_day').val(),// 日期
		'act_time'   : $('#act_time').val(),// 时间
		'start_time' : $('#act_day').val() + ' ' + $('#act_time').val(),
		'img'        : [],// 图片数据
	};
	$('.image-evidence img').each(function (idx, item) {
		data.img.push({
			'id'   : $(item).attr('data-id'),
			'name' : $(item).attr('data-name'),
		});
	});
	if (!data.title   || data.content.title  < 3)  { alert('活动标题至少输入3个字'); return; }
	if (!data.act_day)  { alert('请输入活动日期'); return; }
	if (!data.act_time) { alert('请输入活动开始时间'); return; }
	if (!data.addr)     { alert('请输入活动地点'); return; }
	if (data.img.length == 0)     { alert('请至少上传一张产品图片'); return; }
	if (!data.content || data.content.length < 10) { alert('活动内容至少输入10个字'); return; }
	
	console.log('发布数据：' + JSON.stringify(data));
	plus.nativeUI.showWaiting('正在提交...');
	$(dom).prop('disabled', true);
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/Property/activity_update'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('发布失败：' + JSON.stringify(res));
		app.error('发布失败');
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
	})
	.done(function (res) {
		console.log('发布结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		//app.open('refund.succeed.html', view.extras);
		plus.webview.getWebviewById('activity.list.scroll.html').evalJS('reinit()');
		setTimeout(function () { plus.webview.currentWebview().close(); }, 500);
	})
	;
});
