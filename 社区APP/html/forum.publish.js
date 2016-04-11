var _Data = {'dom':null};
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
	var task = plus.uploader.createUpload(app.url('mobile/userinfo/upload'), { method:"POST",blocksize:204800,priority:100 }, _cb);
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