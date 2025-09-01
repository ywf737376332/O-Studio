<template>
  <div class="translate-container">
    <div class="top-menu no-drag">
      <ToolBar :funMenuList="funMenuList" class="fun-pane" :width="20"></ToolBar>
    </div>
    <div class="translate-content">
      <div class="translate-content" v-html="svgDataURL">

      </div>
    </div>
  </div>
</template>

<script setup name="TranslateTools">
import { ref, reactive } from 'vue'
import { ToolBar } from '@/layout/components'
// import QRCode from 'qrcode';
import { generateQRCodeToSvg,svgImgToBase64, generateQRCodeWithLogoSVG } from '@/utils/qrcodeTools'

const svgDataURL = ref(null)
// 生成二维码并保存为 Data URL
// QRCode.toDataURL('https://example.com', {
//   errorCorrectionLevel: 'H',
//   type: 'image/png',
//   width: 300,
//   margin: 1
// }, (err, url) => {
//   if (err) throw err;
//   console.log(url); // 输出二维码的 Data URL
// });

// QRCode.toString('https://example.com', { type: 'svg', width: 300, errorCorrectionLevel: 'H' }, (err, string) => {
//   if (err) throw err;
//   svgDataURL.value = string
//   console.log(string); // 输出 SVG 字符串
// });

// generateQRCodeToSvg("https://example.com", { width: 800 }).then((res) => {
//   svgDataURL.value = res
//   svgImgToBase64(res)
// }).catch(() => {
//   console.log("出错了:")
// })

generateQRCodeWithLogoSVG("https://example.com","logo").then(res=>{
  svgDataURL.value = res
}).catch((err) => {
  console.log("出错了:",err)
})


const funMenuList = [
  {
    menuName: '清空',
    menuIco: 'icon-clean',
    position: 'right',
    menuFun: () => {
    }
  },
  {
    menuName: '格式化',
    menuIco: 'icon-formatCode',
    position: 'right',
    menuFun: () => {

    }
  }
]
</script>

<style scoped lang="scss">
.translate-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .top-menu {
    height: 46px;
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    .setting-pane {
      margin: 15px 0 8px 0;
      padding: 0 20px;
    }

    .fun-pane {
      flex: 1;
    }
  }

  .translate-content {
    width: 100%;
    flex: 1;
    padding: 10px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .function-list {
      width: 100%;
      border: 1px solid var(--main-dashed-border-color);
      border-radius: 5px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;

      &:first-child {
        margin-bottom: 20px;
      }

      >p {
        font-size: 13px;
        margin-left: 10px;
      }

      .function-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 110px;
        /* 关键：确保内容撑开 */
        white-space: nowrap;
        // flex-wrap: wrap;

        padding: 15px 0px;

        overflow-x: auto;
        overflow-y: hidden;

        .item {
          width: 80px;
          height: 80px;
          background-color: var(--main-btn-background-color);
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          border-radius: 5px;
          margin: 0 10px 0 10px;
          padding: 0 3px;
          cursor: move;
          display: inline-flex;
          user-select: none;
          flex-shrink: 0;

          .iconfont {
            font-size: 24px;
            color: var(--main-btn-font-color);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
            width: 100%;
            height: 40px;
            line-height: 50px;
          }

          >span {
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            width: 80px;
            height: 40px;
            font-size: 11px;
            color: var(--main-btn-font-color);
            /* 防止文本换行 */
            overflow: hidden;
            /* 使用省略号表示溢出的文本 */
            text-overflow: ellipsis;
            /* 限制最多显示两行 */
            -webkit-line-clamp: 2;
            /* 控制显示的行数 */
            -webkit-box-orient: vertical;
            line-clamp: 2;
            /* 标准属性，部分浏览器支持 */
            box-orient: vertical;
            /* 标准属性，部分浏览器支持 */
          }

          &:hover {
            background-color: var(--main-btn-active-color);
          }
        }
      }
    }
  }
}
</style>
