import { ElNotification, ElMessage } from 'element-plus';


export const Message = ({ message, type }) => {
    ElMessage({
        message: message,
        type: type || 'error',
        offset: 140,
        duration: 2000,
        dangerouslyUseHTMLString: true, // 允许解析 HTML
    })
}

export const Notification = ({ title, message, type, position }) => {
    ElNotification({
        type: type || 'error',
        title: title,
        message: message,
        offset: 20,
        position: position || 'bottom-right',
        duration: 2000
    })
}