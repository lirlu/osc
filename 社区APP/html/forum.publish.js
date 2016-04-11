var _Data = {'dom':null};
// 添加图片
$('body').delegate('.btn-add-image', 'tap', function () {
	var btns = [{title:"拍照" }, {title: "从手机相册选择"}];
	_Data.dom = this;
	
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

// 点击提交
$('.btn-submit').on('tap', function () {
	var dom = this;
	var data = {
		'key'     : app.store('key'),
		'title'   : $('[name=name]').val(),
		'cate_id' : '1',
		'content' : $('[name=content]').val(),
		'image'   : [],
	};
	$('.btn-imaged').each(function (idx, imaged) {
		data.image.push({
			'id'   : $(imaged).attr('data-id'),
			'name' : $(imaged).attr('data-name'),
		});
	});
	
	console.log('帖子数据：' + JSON.stringify(data));
	if (!data.title || data.title.length < 5)      { plus.nativeUI.toast('标题最少输入5个字'); return; }
	if (!data.content || data.content.length < 10) { plus.nativeUI.toast('内容最少输入10个字'); return; }
	
	plus.nativeUI.showWaiting('发布中...');
	$(dom).prop('disabled', true);
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/forum/forum_add'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('发布帖子失败：' + JSON.stringify(res));
		app.error('发布帖子失败');
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
	})
	.done(function (res) {
		console.log('发布帖子：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		$(dom).prop('disabled', false);
		
		
		if (res.error && res.error.msg) { plus.nativeUI.toast(res.error.msg); return; }
		if (res.msg) { plus.nativeUI.toast(res.msg); }
		
		plus.webview.getWebviewById('forum.scroll.html').evalJS('forum.prepend('+JSON.stringify(data)+')');
		setTimeout(function () { plus.webview.currentWebview().close(); }, 200);
	})
	;
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
	upload(image);
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
	var task = plus.uploader.createUpload(app.url('mobile/forum/upload'), { method:"POST",blocksize:204800,priority:100 }, _cb);
	task.addFile(image.path, {key:"testdoc"});
	task.addData('key', app.store('key'));
	task.addData('thumb', image);
	task.start();
}
function append (image) {
	//console.log(JSON.stringify(image));
	var tpl = template('tpl-imaged', image);
	console.log(JSON.stringify(image));
	$(_Data.dom).closest('.image-item').replaceWith(tpl);
}
template.helper('image', function (v) {
	return app.link.image + v;
});