<template>
    <!-- 右侧展开抽屉 -->
    <DrawerViewer :showDrawer="showDrawer" :title="`待开发清单`" :size="50" @handleClose="handleClose">
        <template #main>
            <div class="drawer-container">
                <ul type="A">
                    <li>1、代码导出图片功能引入到其他页面✔️</li>
                    <li>2、下拉框组件封装✔️</li>
                    <li>3、所有界面导出(图片、文本)，复制(图片、文本)功能优化，增加二级菜单(已全部集成到预览界面)✔️</li>
                    <li>4、JSON预览增加JSON排序功能✔️</li>
                    <li>5、合并差异编辑器和常规编辑器的配置参数✔️</li>
                    <li>6、改造语言选择的组件，变的体验好点✔️</li>
                    <li>7、状态栏，事件总线改造✔️</li>
                    <li>14、打包发布✔️</li>
                    <li>9、编辑器右键菜单(electron原生右键菜单或编辑器自身右键菜单)</li>
                    <li>10、编辑器分栏功能开发</li>
                    <li>12、图片水印清晰度处理(后期重构)</li>
                    <li>13、集成SqlLate,进行配置数据存储</li>
                    <li>13、首页开发</li>
                    <li>14、增加耗时操作的进度条功能(出现问题，后期在解决❌)</li>
                    <li>15、主题配置</li>
                    <li>16、设置界面</li>
                    <li>17、历史记录功能开发</li>
                    <li>18、部分页面的单独配置功能开发</li>
                    <li>19、启动界面开发</li>
                    <li>20、导出代码图片增加专属水印</li>
                    <li>21、二维码工具可以和条形码共存，优化二维码清晰度，最好是生成二维码矢量图，二维码增加复制二维码内容(后期重构)</li>
                </ul>
            </div>
        </template>
    </DrawerViewer>
</template>

<script setup>
import DrawerViewer from '@/components/DrawerViewer/index.vue'
const props = defineProps({
    showDrawer: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(['handleClose', 'routePage'])
const handleClose = () => {
    emit('handleClose')
}

const routePage = (item) => {
    emit('routePage', item)
}

const menuList = [

]
</script>

<style scoped lang="scss">
.drawer-container {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: space-around;

    ul>li:not(:last-child) {
        margin-bottom: 12px;
    }
    ul>li {
        margin-left: 15px;
        font-size: 12px;
        color: var(--main-btn-font-color);
    }

}
</style>