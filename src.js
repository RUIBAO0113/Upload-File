/* 
template html模板
<input type="file" class="uploadMusic-input auto " name="files" id="fileUploader" multiple="">
<img src="img/2-6.png " class="animate1 img6 upload-btn"> */


// 可以上传的文件后缀名
var canUploadFormat = [
	"mp3",
	"m4a"
	// "aif",
	// "aiff",
	// "mid",
	// "ra",
	// "aqe",
	// "wma",
	// "rm",
	// "flac",
	// "ape",
	// "midi"
];
var canUpload = true;
var xhr; //异步请求对象

var ot; //时间

var oloaded; //上传时文件大小

var size = 0; //文件本身大小
//上传文件方法
document.getElementById("fileUploader").addEventListener("change", function () {
	UpFile()
})

function UpFile() {
	if (!openid) {
		toa("网络连接错误！");
		return;
	}
	// 作品名
	var fileObj = document.getElementById("fileUploader").files[0]; // js 获取文件对象
	// console.log(fileObj);
	if (fileObj.name) {
		//上传完成 存在作品名 fileObj.name 
		var file = getCaption(fileObj.name).toLowerCase(); // 后缀名
		// console.log("后缀名" + file); // 文件本身大小
		alert('file文件后缀:' + file);
		size = fileObj.size;
		let isCan = 0;
		for (let i = 0; i < canUploadFormat.length; i++) {
			if (canUploadFormat[i] == file) {
				isCan = 1
			}
		}
		if (isCan == 1) {
			$(".uploadMusic-name").html(fileObj.name)
			canUpload = true;
			$(".screenLoading").show()
			uploadMusic()
		} else {
			canUpload = false; // 清空file
			$("#fileUploader").val('');
			toa("上传音乐格式必须为mp3 m4a格式")
		}
	} else {
		toa("网络连接错误")
	}
}
/*点击取消*/


function del() {
	// file 清空
	$("#fileUploader").val(''); // $(".el-upload-list").css("display", "none");
}
/*点击提交*/


function uploadMusic() {
	/*进度条显示进度*/

	var fileObj = document.getElementById("fileUploader").files[0]; // js 获取文件对象

	if (fileObj == undefined || fileObj == "") {
		toa("请选择文件");
		return;
	};

	if (!openid) {
		toa("网络链接错误！")
		return
	}

	if (!canUpload) {
		toa("上传音乐格式必须为mp3 m4a格式")
		return;
	}
	// $(".progress").css("width", 0 + "%");
	// $(".progressMesg").html(0 + "%");
	// var url = "https://web.wbthink.cn/CommonAudio/CommonHelper.aspx?Method=UpLoadAudio";
	var url = "https://web.wbthink.cn/benVideoTest/CommonHelper.aspx?Method=UpLoadVideo" // 接收上传文件的后台地址

	var form = new FormData(); // FormData 对象

	form.append("mf", fileObj); // 文件对象

	form.append("ProjectCode", "MeiDi.G.220407"); // 标题

	form.append("Size", size); // 视频本身大小

	form.append("Openid", openid); // openid

	form.append("title", new Date().getTime()); // 时间戳

	xhr = new XMLHttpRequest(); // XMLHttpRequest 对象

	xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。

	xhr.onload = uploadComplete; //请求完成

	xhr.onerror = uploadFailed; //请求失败

	xhr.upload.onprogress = progressFunction; //【上传进度调用方法实现】

	xhr.upload.onloadstart = function () {
		//上传开始执行方法
		ot = new Date().getTime(); //设置上传开始时间

		oloaded = 0; //设置上传开始时，以上传的文件大小为0
	};

	xhr.send(form); //开始上传，发送form数据
} //上传进度实现方法，上传过程中会频繁调用该方法


function progressFunction(evt) {
	// console.log("上传进度")
	// console.log(evt)
	// event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
	if (evt.lengthComputable) {
		// $(".showProgress").css("display", "block");
		/*进度条显示进度*/
		// $(".progress").css("width", Math.round(evt.loaded / evt.total * 100) + "%");
		$(".loadProgress").html(Math.round(evt.loaded / evt.total * 100) + "%");
	}

	var time = document.getElementById("time");
	var nt = new Date().getTime(); //获取当前时间

	var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s

	ot = new Date().getTime(); //重新赋值时间，用于下次计算

	var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b

	oloaded = evt.loaded; //重新赋值已上传文件大小，用以下次计算
	//上传速度计算

	var speed = perload / pertime; //单位b/s

	var bspeed = speed;
	var units = 'b/s'; //单位名称

	if (speed / 1024 > 1) {
		speed = speed / 1024;
		units = 'k/s';
	}

	if (speed / 1024 > 1) {
		speed = speed / 1024;
		units = 'M/s';
	}

	speed = speed.toFixed(1); //剩余时间
	// var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
	// time.innerHTML = '上传速度：' + speed + units + ',剩余时间：' + resttime + 's';
	if (bspeed == 0) time.innerHTML = '上传已取消';
} //上传成功响应


function uploadComplete(evt) {
	// console.log(evt.currentTarget.responseText);
	var res = JSON.parse(evt.currentTarget.responseText); //服务断接收完文件返回的结果  注意返回的字符串要去掉双引号

	if (res.resultCode == 1) {
		// 成功
		var url = res.originurl;
		// if (res.fileFormat == ".mp3") {
		// 	// MP4格式的
		// 	url = res.originurl;
		// } else {
		// 	// 转换其他格式的
		// 	url = res.url;
		// }
		musicUrl = res.originurl
		// console.log("上传成功！")
		let html = $(".uploadMusic-name").html()
		$(".uploadMusic-name").html("上传完成:" + html)
		$(".upload-btn").attr("src", 'img/up.png')
		setTimeout(() => {
			$(".screenLoading").hide()
		}, 2000)

	} else {
		// 失败
		toa("上传失败！");
	}
} //上传失败


function uploadFailed(evt) {
	toa("上传失败！");
}

function getCaption(obj) {
	var index = obj.lastIndexOf("\.");
	obj = obj.substring(index + 1, obj.length);
	console.log(obj);
	return obj;
}

