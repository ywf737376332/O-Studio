import { html as html_beautify, css as css_beautify, js as js_beautify } from 'js-beautify';

// 格式化代码的函数
export const formatCode = (code, type = 'js') => {
    // 基础配置
    const baseOptions = {
        indent_size: 4,          // 缩进空格数
        indent_char: ' ',        // 缩进字符
        max_preserve_newlines: 2, // 最大连续保留换行
        preserve_newlines: true,  // 保留换行
        keep_array_indentation: false,
        break_chained_methods: false,
        indent_scripts: 'normal',
        brace_style: 'collapse', // 大括号风格
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: true,
        wrap_line_length: 0,
        indent_inner_html: false,
        comma_first: false,
        e4x: false,
        indent_empty_lines: false
    };

    try {
        switch (type.toLowerCase()) {
            case 'html':
                return html_beautify(code, {
                    ...baseOptions,
                    extra_liners: ['head', 'body', '/html'], // 额外换行的标签
                    inline: ['span', 'a', 'img'],            // 内联元素
                    unformatted: ['code', 'pre'],           // 不格式化的标签
                });

            case 'css':
                return css_beautify(code, {
                    ...baseOptions,
                    newline_between_rules: true,     // 规则之间换行
                    selector_separator_newline: true, // 选择器分隔符后换行
                });

            case 'js':
            case 'javascript':
                return js_beautify(code, {
                    ...baseOptions,
                    space_after_anon_function: true,  // 匿名函数后空格
                    space_after_named_function: true, // 命名函数后空格
                });

            default:
                return code; // 不支持的类型返回原始代码
        }
    } catch (error) {
        console.error('Format error:', error);
        return code; // 发生错误时返回原始代码
    }
};