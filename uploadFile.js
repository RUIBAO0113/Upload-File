
// MeiDi.G.220407
class uploadFile {
	constructor(options) {
		// 上传文件格式后缀
		this.canUploadFormat = options.canUploadFormat || []
		this.onChange = options.onChange || null
		this.uploadUrl = options.uploadUrl || "https://web.wbthink.cn/CommonAudio/CommonHelper.aspx?Method=UpLoadAudio"
		this.formDataAppend = options.formDataAppend || {}
		this.onLoad = options.onLoad || null
		this.onComplete = options.onComplete || null
		this.canUpload = true;
		this.xhr = null //异步请求对象
		this.ot = null //时间
		this.oloaded = null //上传时文件大小
		this.size = 0; //文件本身大小
		this.root = null
		this.onInit()
	}
	onInit() {
		// 是否已经存在实例 移除重新创建
		if (uploadFile.Target) {
			return
		}
		uploadFile.Target = this
		let el = document.createElement('input')
		el.setAttribute("type", 'file')
		el.setAttribute("style", `z-index:-999;opacity:0;position:absolute;left: 0;right: 0;`)
		document.body.appendChild(el)
		uploadFile.El = el
		// 挂载事件
		uploadFile.El.addEventListener('change', () => {
			this.UpFile()
		})
	}
	start() {
		uploadFile.El.click()
	}
	del() {
		// file 清空
		uploadFile.El.value = ''; 
	}
	// 正则匹配文件后缀名
	getCaption(obj) {
		var index = obj.lastIndexOf("\.");
		obj = obj.substring(index + 1, obj.length);
		// console.log(obj);
		return obj;
	}
	UpFile() {
		let fileObj = uploadFile.El.files[0]; // js 获取文件对象
		// console.log(fileObj);
		if (fileObj.name) {
			//上传完成 存在作品名 fileObj.name 
			let file = this.getCaption(fileObj.name).toLowerCase(); // 后缀名
			// console.log("后缀名:" + file); // 文件本身大小
			this.size = fileObj.size;
			let isCan = 0;
			let canUpload;
			if (Object.keys(this.canUploadFormat).length == 0) {} else {
				for (let i = 0; i < this.canUploadFormat.length; i++) {
					if (this.canUploadFormat[i] == file) {
						isCan = 1
					}
				}
			}
			if (isCan == 1) {
				// $(".uploadMusic-name").html(fileObj.name)
				canUpload = true;
				this.uploadMusic(canUpload)
			} else {
				this.del()
				canUpload = false; // 清空file
			}
			this.onChange(canUpload, fileObj.name)
		} else {
			console.log("未知错误")
		}
	}
	uploadMusic(canUpload) {
		var fileObj = uploadFile.El.files[0]; // js 获取文件对象
		if (fileObj == undefined || fileObj == "") {
			alert("请选择文件");
			return;
		};
		if (!canUpload) {
			alert("上传文件格式有误，请重新上传！");
			return;
		}
		// 接收上传文件的后台地址
		let form = new FormData(); // FormData 对象
		form.append("mf", fileObj); // 文件对象
		form.append("Size", this.size); // 视频本身大小
		if (Object.keys(this.formDataAppend).length != 0) {
			for (let key in this.formDataAppend) {
				form.append(key, this.formDataAppend[key])
			}
		}
		let xhr = this.xhr
		xhr = new XMLHttpRequest(); // XMLHttpRequest 对象

		xhr.open("post", this.uploadUrl, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。

		xhr.onload = this.uploadComplete; //请求完成

		xhr.onerror = this.onComplete(null); //请求失败

		xhr.upload.onprogress = this.uploadProgress; //【上传进度调用方法实现】

		xhr.upload.onloadstart = () => {
			//上传开始执行方法
			this.ot = new Date().getTime(); //设置上传开始时间
			this.oloaded = 0; //设置上传开始时，以上传的文件大小为0
		};
		xhr.send(form); //开始上传，发送form数据
	}
	uploadProgress(evt) {
		let progress //百分比
		// event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
		if (evt.lengthComputable) {
			/*进度条显示进度*/
			progress = Math.round(evt.loaded / evt.total * 100)
		}
		var nt = new Date().getTime(); //获取当前时间
		var pertime = (nt - this.ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
		this.ot = new Date().getTime(); //重新赋值时间，用于下次计算

		var perload = evt.loaded - this.oloaded; //计算该分段上传的文件大小，单位b

		this.oloaded = evt.loaded; //重新赋值已上传文件大小，用以下次计算
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
		var resTime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
		let s = speed + units
		uploadFile.Target.onLoad(progress, resTime, s)
		// if (bspeed == 0) time.innerHTML = '上传已取消';
	}
	uploadComplete(evt) {
		console.log(evt.currentTarget.responseText);
		var res = JSON.parse(evt.currentTarget.responseText); //服务断接收完文件返回的结果  注意返回的字符串要去掉双引号
		if (res.resultCode == 1) {
			// 成功
			var url = res.originurl || res.url;
			uploadFile.Target.onComplete(url)
		} else {
			uploadFile.Target.onComplete()
		}
	} //上传失败
}
uploadFile.Target = null
uploadFile.El = null
