import { Message } from 'element-ui';

/**
 * 将文件转为二进制
 * @param {string} dataURI 文件dataURI（base64）
 * @param {string} type 文件类型（MIME type）
 * @returns {blob} 二进制流
 */
export function dataURItoBlob(dataURI, type) {
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for(var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: type});
}
/**
 * 在上传图片前校验图片格式及大小，压缩图片
 * @param {file} file 文件内容
 */
export function imgUploadVerifyAndResize(file) {
  // 上传的文件是否小于2MB
  const isLt2M = file.size / 1024 / 1024 < 2;
  // 上传的文件是否是图片
  const isImage = file.type.indexOf('image/') !== -1;
  // 包含汉字和中文符号
  const containChineseChar = /[\u4e00-\u9fa5]|[^\x00-\xff]+$/gi.test(file.name)
  if (!isLt2M) {
    Message({ message: '上传图片大小不能超过 2MB!', type: 'error' });
    return isLt2M;
  }
  if (containChineseChar) {
    Message({ message: '图片名称不能包含汉字和中文符号!', type: 'error' });
    return !containChineseChar;
 }
  if (!isImage) {
    Message({ message: '只能上传图片！', type: 'error' });
    return Promise.reject('只能上传图片')
  }
  return new Promise(resolve => {
    const reader = new FileReader()
    const image = new Image()
    image.onload = () => {
      // 创建canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      // 获取图片的width和height
      const originalWidth = image.width;
      const originalHeiht = image.height;
      // 将图片压缩后的width和height分别赋值给canvas的width和height
      canvas.width = originalWidth;
      canvas.height = originalHeiht;
      // 清除矩形区域
      context.clearRect(0, 0, originalWidth, originalHeiht);
      // 向画布上面绘制图片
      context.drawImage(image, 0, 0, originalWidth, originalHeiht);
      // 返回一个包含图片展示的 data URI (base64)
      const dataUrl = canvas.toDataURL('image/png');
      // 返回二进制流
      const blobData = dataURItoBlob(dataUrl, 'image/png');
      resolve(blobData)
    }
    // 获取图片链接
    reader.onload = (e => { image.src = e.target.result; });
    // 读取文件
    reader.readAsDataURL(file);
  })
}