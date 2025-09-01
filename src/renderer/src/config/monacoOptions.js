import useSettingStore from '@/store/modules/settings';
const settingStore = useSettingStore();

export const getMonacoOptions = () => (
    {
    minimap: {
        enabled: false,             // 是否启用缩略图
        side: 'right',              // 位置：'right' 或 'left'
        size: 'proportional',       // 大小：'proportional' 或 'fill'
        showSlider: 'always',       // 滑块显示：'always' 或 'mouseover'
        renderCharacters: false,    // 是否渲染字符
        maxColumn: 120,             // 最大列数
        scale: 1                    // 缩放比例
    },
    colorDecorators: true,		    // 颜色装饰器
    readOnly: false,			    // 是否开启已读功能
    theme: settingStore.getEditorTheme(),	// 主题 vs-dark
    codeLens: true,                 // 代码透镜
    folding: true,                  // 代码折叠
    snippetSuggestions: 'inline',   // 代码提示
    tabCompletion: 'on',            // 代码提示按tab完成
    foldingStrategy: 'auto',        // 折叠策略
    smoothScrolling: true,          // 滚动动画
    autoIndent: true,               // 自动缩进
    overviewRulerBorder: false,     // 是否绘制概览尺子边框
    hideCursorInOverviewRuler: true,// 在概览标尺中隐藏光标
    overviewRulerLanes: 0,          // 设置概览标尺通道数为0
    automaticLayout: true,          // 自动缩放
    placeholder: '请输入内容',
    wordWrap: settingStore.wordWrap,// 或者 'off' 来禁用自动换行
    contextmenu: false,              // 启用上下文菜单
    links: true,                    // 是否点击链接
    scrollBeyondLastLine: false,    // 设置编辑器是否可以滚动到最后一行之后
    fontSize: settingStore.fontSize,
    fontFamily: settingStore.fontFamily,
    selectOnLineNumbers: true,      // 这个选项控制当用户点击行号时，是否会自动选择整行
    lineNumbers: settingStore.lineNumbers, // 行号 取值： "on" | "off" | "relative" | "interval" | function
    lineNumbersMinChars: 4,         // 行号最小字符   number
    enableSplitViewResizing: true,  // 这个选项控制是否允许调整分割视图的大小
    mouseWheelZoom: false,           // 鼠标滚轮改变字体大小
    renderLineHighlight: 'line',    // 控制代码编辑器中行高亮显示的位置：'none': 不显示行高亮；'gutter': 将行高亮显示在编辑器的行号区域 'line': 将行高亮显示在整个行的左侧背景区域
    /**
     * 'line'：默认的光标样式，为一条竖线。'block'：块状光标，通常覆盖多个字符位置，类似传统的文本编辑光标样式。'underline'：下划线光标，在光标所在位置显示下划线。
     * 'line-thin'：比默认的“line”样式更细的竖线光标。
     * 'block-outline'：块状轮廓光标，与“block”类似，但具有轮廓效果。
     * 'underline-thin'：比默认的“underline”更细的下划线光标。
     */
    cursorStyle: 'line',
    rulers: [],                     // 首行最右侧有个红色的竖线 设置为空数组移除所有标尺,可设置多个标尺。rulers: [{column: 20,  // 标尺位置（字符数） color: '#eee'  // 标尺颜色}]
    stickyScroll: {
        enabled: false,             // 禁用粘性滚动
        maxLineCount: 5,            // 最大显示行数
        scrollWithEditor: true      // 是否跟随编辑器滚动
    },
    scrollbar: {
        useShadows: false,                              // 禁用滚动条阴影
        horizontalScrollbarSize: 5,                     // 水平滚动条的高度（像素）。默认值为10（像素）
        horizontal: 'auto',                             // 水平滚动条显示策略:auto->自动显示/隐藏（默认值）,visible->始终显示,hidden->始终隐藏,force->强制显示（即使内容未超出）
        horizontalHasArrows: false,                     // 禁用水平滚动条箭头
        verticalScrollbarSize: 5,                       // 垂直滚动条的宽度（像素）。默认值为10（像素）
        vertical: 'auto',                               // 垂直滚动条显示策略
        verticalHasArrows: false,                       // 禁用垂直滚动条箭头
        alwaysConsumeMouseWheel: false,                 // 允许滚动穿透
        ignoreHorizontalScrollbarInContentHeight: true  //设置后，水平滚动条不会影响编辑器的内容高度。默认值为false，会占用编辑器的内容高度
    }
})