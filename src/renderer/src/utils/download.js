import { toRaw } from 'vue'
import { Message, Notification } from '@/utils/message'
import html2canvas from 'html2canvas'
import { isElectron } from '@/utils/electron'
import { loading } from '@/utils/loading'
import { getRootStyleValue } from '@/utils'

export const handelMainCallBack = (action, data) => {
  loading.show()
  return new Promise((resolve, reject) => {
    window.ipcRenderer
      .invoke(action, data)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
      .finally(() => {
        loading.close()
      })
  })
}

/**
 * 复制到电脑剪切板
 * @param {*} textToCopy
 */
export const copyTextToClipboard = async (textToCopy) => {
  loading.show()
  if (textToCopy) {
    await navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        Message({
          message: '内容复制成功！',
          type: 'success'
        })
      })
      .catch((error) => {
        Message({
          message: '内容复制失败！' + error,
          type: 'error'
        })
      })
      .finally(() => {
        loading.close()
      })
  }
}

const canvasImageFactory = (domContainer, { width, height }) => {
  const scale = 4
  const dpr = window.devicePixelRatio || 1
  const actualScale = scale * dpr
  const imageBackgroundColor = getRootStyleValue('--main-theme-export-text-image-background-color')
  return new Promise((resolve, reject) => {
    html2canvas(domContainer, {
      backgroundColor: imageBackgroundColor,
      scale: actualScale,
      useCORS: true,
      logging: false,
      allowTaint: true, // 允许跨域图片
      width: width,
      height: height,
      // 字体设置
      letterRendering: true,
      // 抗锯齿
      imageSmoothing: true
    })
      .then((canvas) => {
        resolve(canvas)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/**
 * 将画布内容复制到剪贴板
 * @param {*} domContainer
 * @param {*} param1
 */
export const copyImageToClipboard = async (domContainer, { width, height }) => {
  loading.show()
  await canvasImageFactory(domContainer, { width, height })
    .then((canvas) => {
      canvas.toBlob((blob) => {
        const item = new ClipboardItem({ 'image/png': blob })
        navigator.clipboard
          .write([item])
          .then(() => {
            Message({
              message: '图片复制成功！',
              type: 'success'
            })
          })
          .catch((error) => {
            Message({
              message: '图片复制失败！' + error,
              type: 'error'
            })
          })
          .finally(() => {
            loading.close()
          })
      })
    })
    .catch((error) => {
      reject(error)
    })
}

/**
 * 将 base64 图片复制到剪贴板
 * @param {string} base64Image base64 格式的图片字符串
 * @returns {Promise<void>}
 */
export const copyBase64ImageToClipboard = async (base64Image) => {
  try {
    // 创建 canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 创建图片对象
    const img = await createImageFromBase64(base64Image);

    // 设置 canvas 尺寸为图片尺寸的 scale 倍
    const scale = 4; // 放大倍数
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    // 绘制图片到 canvas，放大 scale 倍
    ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);


    // 从 canvas 获取 blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });

    // 创建 ClipboardItem
    const data = new ClipboardItem({
      'image/png': blob,
    });

    // 写入剪贴板
    await navigator.clipboard.write([data]);

    Message({
      message: '图片复制成功！',
      type: 'success',
    });
  } catch (error) {
    Message({
      message: `图片复制失败！: ${error.message}`,
      type: 'error',
    });
  }
};

/**
 * 从 base64 创建图片
 * @param {string} base64
 * @returns {Promise<HTMLImageElement>}
 */
const createImageFromBase64 = (base64) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

/**
 * 检查浏览器是否支持剪贴板 API
 * @returns {boolean}
 */
export const isClipboardSupported = () => {
  return !!(navigator.clipboard && navigator.clipboard.write && window.ClipboardItem)
}

/**
 * 下载代码生成的图片
 * @param {*} domContainer
 * @param {*} param1
 */
export const downloadImageToFile = async (domContainer, { width, height }) => {
  return canvasImageFactory(domContainer, { width, height })
}

export const downloadBase64Img = async (baseUrl) => {
  if (isElectron()) {
    handelMainCallBack('exportImageToFile', baseUrl)
      .then((res) => {
        if (res && res.success) {
          Message({
            message: '图片导出成功！',
            type: 'success'
          })
        }
      })
      .catch(() => {
        Message({
          message: '图片导出失败！',
          type: 'error'
        })
      })
  }
}

/**
 * 将画布内容复制为图片文件
 * @param {*} canvas
 */
const canvasToJPG = (originalCanvas, width, height) => {
  const w = originalCanvas.width
  const h = originalCanvas.height
  const newCanvas = document.createElement('canvas')
  const ctx = newCanvas.getContext('2d')
  newCanvas.width = width
  newCanvas.height = height
  ctx.drawImage(originalCanvas, 0, 0, w, h, 0, 0, width, height)
  return newCanvas.toDataURL('jpeg')
}

/**
 * 导出选中的内容
 * @param {*} editor
 */
export const selectedTextToImg = (editor) => {
  const selectedText = toRaw(editor.value).getModel().getValueInRange(editor.value.getSelection())
  if (selectedText) {
    // 创建一个临时元素来包含选中的文本
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = selectedText
    tempDiv.style.whiteSpace = 'pre' // 保持文本格式
    document.body.appendChild(tempDiv)
    // 使用 html2canvas 将临时元素转换为图像
    html2canvas(tempDiv).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      Logger.info(imgData)
      // 移除临时元素
      document.body.removeChild(tempDiv)
    })
  } else {
    Notification({
      title: '截图提醒',
      message: '请先选中您要截取的内容！',
      type: 'warning'
    })
  }
}
