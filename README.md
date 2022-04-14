克隆下来 导入uploadFile.js 
git https://gitee.com/ruibao-0113_admin/upload-file.git

```html
<!-- 1. -->
<!-- html中 -->
<div class="sub">点击我上传</div>
<p class="file_name"></p>
<p class="progress"></p>
<p class="file_url"></p>
<!-- script引用 不支持import -->
<script src="uploadFile.js"></script>
```

```javascript
/* 2. */
/* 实例化 */
function createUploadFile() {
  return new uploadFile({
    // 上传api地址
    uploadUrl:
      "https://web.wbthink.cn/benVideoTest/CommonHelper.aspx?Method=UpLoadVideo",
    // 上传格式后缀要求 小写大写都可
    canUploadFormat: [
      "rm",
      "mp3",
      "aif",
      "aiff",
      "mid",
      "ra",
      "aqe",
      "wma",
      "rm",
      "flac",
      "ape",
      "midi",
    ],
    // 上传时携带参数
    formDataAppend: {
      title: "MeiDi.G.220408",
      Date: new Date().getTime(),
    },
    // 本地上传完成 isSuccess是否成功 fileName上传文件名
    onChange(isSuccess, fileName) {
      console.log(fileName);
      if (isSuccess) {
        // 包含可上传文件后缀名！
        document.querySelector(".file_name").innerHTML = "文件名" + fileName;
      } else {
        alert("不包含可上传文件后缀名！");
        // "不包含可上传文件后缀名！"
        document.querySelector(".file_name").innerHTML = "文件名" + fileName;
      }
    },
    // 上传过程 progress 上传进度百分比 resTime 剩余时间 上传速度
    onLoad(progress, resTime, speed) {
      console.log(progress);
      console.log(resTime);
      console.log(speed);
      document.querySelector(
        ".progress"
      ).innerHTML = `进度:${progress}%-剩余时间:${resTime}-速度:${speed}`;
    },
    // 上传完毕 url视频地址
    onComplete(url) {
      if (url) {
        console.log("上传成功！");
        document.querySelector(".file_url").innerHTML = `链接:${url}`;
      } else {
        document.querySelector(".file_url").innerHTML = `链接:暂无`;
      }
    },
  });
}
```

```javascript
// 调用上传 这里通过原生点击事件
document.querySelector(".sub").addEventListener("click", () => {
  createUploadFile().start();
});
```
