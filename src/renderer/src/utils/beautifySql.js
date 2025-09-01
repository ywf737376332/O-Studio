import * as sqlFormatter from 'sql-formatter'

/**
 * 格式化SQL
 * @param {String} value
 * @returns
 */
export const formatSql = (value) => {
    if (value) {
      return sqlFormatter.format(value, {
        // language: 'sql', // 支持 'sql', 'n1ql', 'db2', 'pl/sql', 'tsql', 'pg', 'mysql', 'mariadb', 'mssql'
        tabWidth: 4, // 缩进字符，默认是两个空格
        keywordCase: 'upper', // 是否将关键字转换为大写
        linesBetweenQueries: 2 // 每个查询之间的空行数
      })
    }
  }
  
  /**
   * 压缩Sql
   * @param {String} value
   * @returns
   */
  export const compressSql = (value) => {
    if (value) {
      return value.replace(/\s+/g, ' ').trim()
    }
  }