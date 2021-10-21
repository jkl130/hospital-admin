
/** 重置message，防止重复点击重复弹出message弹框 */
import { Message } from 'element-ui'

// 用于存储消息提示的变量
let messageInstance = null;
/**
 * 重置消息提示的方法
 * @param {Object|string} options 消息提示配置选项，同el-message
 */
const resetMessage = (options) => {
  // 在生产消息提示前，如果存在消息提示则关闭
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = Message(options)
}
;['error', 'info', 'success', 'warning'].forEach(type =>{
  resetMessage[type] = options => {
    // 如果配置选项options为string，则将options作为提示消息
    if (typeof options === 'string') {
      options = {
        message: options
      }
    };
    // 消息类型
    options.type = type;
    return resetMessage(options)
  }
})

/** 基于el-message的消息提示 */
export const message = resetMessage