import * as monaco from 'monaco-editor'

const changeTheme = (isDark) => {
    const html = document.documentElement
    if (isDark) {
        // 切换Element组件的主题
        html.classList.add('dark')
        // 切换编辑器的主题
        monaco.editor.setTheme('vs-dark')
        // 切换系统自定义组件的主题
        html.setAttribute('data-theme', 'dark')
        // setDarkThemeSideBarColor()
    } else {
        html.classList.remove('dark')
        monaco.editor.setTheme('vs')
        html.setAttribute('data-theme', 'light')
    }
}

export {
    changeTheme
}