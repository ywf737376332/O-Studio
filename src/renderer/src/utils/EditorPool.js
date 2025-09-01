/**
 * 编辑器对象实例池
 */
class EditorPool {
    constructor() {
        if (EditorPool._instance) {
            return EditorPool._instance
        }
        EditorPool._instance = this
        this.editors = new Set() // 使用 Set 存储编辑器实例，避免重复
        return this
    }

    // 添加编辑器实例
    add(editor) {
        this.editors.add(editor)
        Logger.info('monaco editor对象已缓存！');
    }

    // 移除编辑器实例
    remove(editor) {
        this.editors.delete(editor)
        Logger.info('monaco editor对象已移除！');
    }

    // 批量更新配置
    updateAllOptions(options) {
        this.editors.forEach(editor => {
            if (editor.getOriginalEditor && editor.getModifiedEditor) {
                // 是差异编辑器
                const originalEditor = editor.getOriginalEditor();
                const modifiedEditor = editor.getModifiedEditor();
                // 更新原始编辑器的配置
                originalEditor.updateOptions(options.original || options);
                // 更新修改后编辑器的配置
                modifiedEditor.updateOptions(options.modified || options);
                Logger.info('差异编辑器配置修改成功:',options)
            } else {
                // 是普通编辑器
                editor.updateOptions(options)
                Logger.info('普通编辑器配置修改成功:',options)
            }

        })
    }

    // 销毁所有实例（可选）
    disposeAll() {
        this.editors.forEach(editor => toRaw(editor).dispose())
        this.editors.clear()
        Logger.info('所有monaco editor对象已销毁！')
    }

    // 获取所有编辑器实例
    getAllEditors() {
        return Array.from(this.editors) // 返回一个数组形式的编辑器实例
    }
}

// 导出单例实例
export const editorPool = new EditorPool()