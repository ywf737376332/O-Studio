<template>
  <div class="translate-container">
    <div class="top-menu no-drag">
      <ToolBar :funMenuList="funMenuList" class="fun-pane" :width="20"></ToolBar>
    </div>
    <div class="translate-content">
      <div class="function-list">
        <p>需要启用的功能请拖拽到当前框，拖拽可排序</p>
        <draggable v-model="sourceList" group="blocks" item-key="name" class="function-container" :animation="350"
          @change="handleChange">
          <template #item="{ element }">
            <div class="item">
              <i :class="['iconfont', element.icon]"></i>
              <span>{{ element.title }}</span>
            </div>
          </template>
        </draggable>
      </div>
      <!-- 元素容器 -->
      <div class="function-list">
        <p>需要隐藏的功能请拖拽的当前框</p>
        <draggable v-model="targetList" group="blocks" item-key="id" class="function-container" :animation="350"
          @change="handleChange">
          <template #item="{ element }">
            <div class="item">
              <i :class="['iconfont', element.icon]"></i>
              <span>{{ element.title }}</span>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup name="TranslateTools">
import { ref, reactive } from 'vue'
import { ToolBar } from '@/layout/components'
import draggable from 'vuedraggable';
import routes from '@/router/routes/index';

// 源数据列表（初始数据）
const sourceList = routes.map(item => {
  return { 
    name: item.name, 
    title: item.meta.title, 
    icon: item.meta.icon
  }
})

// 目标容器列表（初始为空）
const targetList = ref([])

// 拖拽事件处理
const handleChange = (event) => {
  console.log('拖拽事件:', event)
}

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
