import jsQR from 'jsqr'
import QRCode from 'qrcode';


/**
 * 从 base64 图片解析二维码内容
 * @param {string} base64String base64 图片字符串
 * @returns {Promise<string>} 解析出的文本内容
 */
export const decodeQRCode = async (base64String) => {
  try {
    // 创建 canvas 和 context
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    // 加载图片
    const img = await loadImage(base64String)
    // 设置 canvas 大小
    canvas.width = img.width
    canvas.height = img.height
    // 绘制图片到 canvas
    ctx.drawImage(img, 0, 0)
    // 获取图片数据
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // 使用 jsQR 解析
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    if (code) {
      return code.data
    } else {
      throw new Error("未能识别二维码！");
    }
  } catch (error) {
    throw new Error("二维码解析失败！");
  }
}


/**
 * 加载图片
 * @param {string|File} input 
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = (input) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('图片加载失败'))

    if (input instanceof File) {
      // 如果是文件，转换为 base64
      const reader = new FileReader()
      // 当文件读取成功时，将结果设置为 img.src
      reader.onload = (e) => {
        img.src = e.target.result
      }
      reader.onerror = () => reject(new Error('文件读取失败'))
      // 开始读取文件内容并将其转换为 Data URL。
      reader.readAsDataURL(input)
    } else {
      // 如果是 URL 或 base64
      img.src = input
    }
  })
}

/**
 * 生成svg二维码图片
 * 
 * @param {*} options 
 * @returns 
 */
export const generateQRCodeToSvg = (text, options = {}) => {
  const defaultOptions = {
    type: 'svg',
    width: 430,
    color: {
      dark: '#000000', // 前景色（二维码颜色）
      light: '#FFFFFF', // 背景色
    },
    errorCorrectionLevel: 'M',
    margin: 1
  };
  // 合并选项
  const finalOptions = { ...defaultOptions, ...options };
  return new Promise((resolve, reject) => {
    try {
      if (!text) {
        throw new Error('二维码内容不能为空！');
      }
      QRCode.toString(text, finalOptions, (err, svgDataURL) => {
        if (err) {
          reject(err)
        }
        else resolve(svgDataURL);
      });
    } catch (error) {
      reject(error);
    }
  })
}

/**
 * 将svg二维码转换成base64
 * @param {*} svgDataURL 
 * @returns 
 */
export const svgImgToBase64 = (svgDataURL) => {
  // 将 SVG 字符串转换为 Base64
  const base64 = btoa(unescape(encodeURIComponent(svgDataURL)));
  return `data:image/svg+xml;base64,${base64}`;
}

// 创建带有白边和圆角的 Logo 图片，返回 Base64 字符串
function createLogoWithBorder(logoImage, borderWidth = 3, borderRadius = 3) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // 计算画布大小（Logo 大小 + 白边宽度）
  const logoWidth = logoImage.width;
  const logoHeight = logoImage.height;
  const canvasWidth = logoWidth + borderWidth * 2;
  const canvasHeight = logoHeight + borderWidth * 2;

  // 设置画布大小
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 绘制白边
  context.fillStyle = '#FFFFFF'; // 白色
  context.beginPath();
  context.roundRect(0, 0, canvasWidth, canvasHeight, borderRadius);
  context.fill();

  // 绘制 Logo
  context.beginPath();
  context.roundRect(borderWidth, borderWidth, logoWidth, logoHeight, borderRadius);
  context.clip(); // 使用圆角裁剪
  context.drawImage(logoImage, borderWidth, borderWidth);

  // 返回 Base64 图片字符串
  return canvas.toDataURL('image/png', 1); // 确保图片质量为 100%
}

/**
 * 生成带 Logo 的二维码（SVG 格式）
 * 
 * @param {*} text 
 * @param {*} logoOps 
 * @param {*} options 
 * @returns 
 */
export async function generateQRCodeWithLogoSVG(text, logoOps, options = {}) {
  try {

    if (!text) {
      throw new Error('二维码内容不能为空！');
    }

    const defaultOptions = {
      type: 'svg',
      width: 430,
      color: {
        dark: '#000000', // 前景色（二维码颜色）
        light: '#FFFFFF', // 背景色
      },
      errorCorrectionLevel: 'M',
      margin: 1
    };

    // 合并选项
    const finalOptions = { ...defaultOptions, ...options };

    // 生成二维码的 SVG 字符串
    const qrCodeSVG = await QRCode.toString(text, finalOptions);
    // 解析 SVG 字符串
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(qrCodeSVG, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    // 加载 Logo 图片
    const logoImage = await loadImage(logoOps.url);

    // 创建带有白边和圆角的 Logo，并获取 Base64 字符串
    const logoWithBorderBase64 = createLogoWithBorder(logoImage, logoOps.borderWidth, logoOps.borderRadius);

    // 从 logoOps 中获取 Logo 大小（动态指定），默认值为二维码宽度的 20%
    const logoSizePercentage = logoOps.size || 20; // 动态指定 Logo 大小百分比
    const logoSize = Math.min(logoSizePercentage, 20); // 限制 Logo 最大为 20%

    // 创建 Logo 的 <image> 标签
    const logo = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    logo.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', logoWithBorderBase64);
    logo.setAttribute('width', `${logoSize}%`);
    logo.setAttribute('height', `${logoSize}%`);

    // Logo 居中位置计算
    const centerOffset = (100 - logoSize) / 2;
    logo.setAttribute('x', `${centerOffset}%`);
    logo.setAttribute('y', `${centerOffset}%`);

    // 将 Logo 添加到 SVG 中
    svgElement.appendChild(logo);

    // 将 SVG 重新序列化为字符串
    const serializer = new XMLSerializer();
    const finalSVG = serializer.serializeToString(svgElement);
    return finalSVG;
  } catch (err) {
    console.error('生成带 Logo 的二维码失败:', err);
    throw err;
  }
}