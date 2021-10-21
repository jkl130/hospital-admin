exports.install = function (Vue, options) {
  let _addZero = function (num) {//时间数字个位数时添加0
    return num < 10 ? "0" + num : num;
  };

  Vue.prototype.changeDate = function (time, type) {//dataTime date
    if(!time){
      return '';
    }
    let currDate = new Date(time);
    let changeDate = currDate.getFullYear() + "-" + _addZero(currDate.getMonth() + 1) + "-" + _addZero(currDate.getDate());
    let changeDateTime = changeDate + " " + _addZero(currDate.getHours()) + ":" + _addZero(currDate.getMinutes()) + ":" + _addZero(currDate.getSeconds());
    return type == "dateTime" ? changeDateTime : changeDate;
  };

  Vue.prototype.getBase64 = function (imgUrl,node,str) {
    window.URL = window.URL || window.webkitURL;
    var xhr = new XMLHttpRequest();
    xhr.open("get", imgUrl, true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      if (this.status == 200) {
        var blob = this.response;
        let oFileReader = new FileReader();
        oFileReader.onloadend = function (e) {
          node[str] = e.target.result;
        };
        oFileReader.readAsDataURL(blob);
      }
    };
    xhr.send();
  };
  Vue.prototype.deepClone = function(obj){
    function isClass(o){
      if(o===null) return "Null";
      if(o===undefined) return "Undefined";
      return Object.prototype.toString.call(o).slice(8,-1);
    }
    var result,oClass=isClass(obj);
    //确定result的类型
    if(oClass==="Object"){
      result={};
    }else if(oClass==="Array"){
      result=[];
    }else{
      return obj;
    }
    for(let key in obj){
      var copy=obj[key];
      if(isClass(copy)=="Object"){
        result[key]=arguments.callee(copy);//递归调用
      }else if(isClass(copy)=="Array"){
        result[key]=arguments.callee(copy);
      }else{
        result[key]=obj[key];
      }
    }
    return result;
  };
  /**
   * 过滤对象在值为空的键值对
   * @param {Object} data 需要过滤的对象
   * @returns 过滤后的结果
   */
  Vue.prototype.getSearchParams = function (data) {
    const result = {};
    for (const key in data) {
      const element = data[key];
      const type = Object.prototype.toString.call(element)
      if (type === '[object Boolean]' || type === '[object Number]') {
        result[key] = element
      }
      if (type === '[object Array]' && element.length) {
        result[key] = element
      }
      if (type === '[object String]' && element.length) {
        result[key] = element
      }
    }
    return result
  }
  Vue.prototype.uploadError = function (err) {
    try {
      const messageObj = JSON.parse(err.message)
      if (messageObj.errMessage) {
        this.$message({ type: 'error', message: messageObj.errMessage })
      } else if (messageObj.message) {
        this.$message({ type: 'error', message: messageObj.message })
      } else if (messageObj.error) {
        this.$message({ type: 'error', message: messageObj.error })
      }
    } catch (error) {
      this.$message({ type: 'error', message: '上传出错，请稍后再试' })
    }
  }
};
