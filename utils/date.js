/**
 * 格式化日期
 * @param {Date|string|number} date 日期对象/时间戳/日期字符串
 * @returns {string} YYYY-MM-DD
 */
export function formatDate(dateStr) {
    // 将日期字符串转换为 iOS 支持的格式
    if (typeof dateStr === 'string') {
        dateStr = dateStr.replace(/-/g, '/');
    }
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;  // 只返回月/日格式，用于图表显示
}

/**
 * 格式化时间
 * @param {Date|string|number} date 日期对象/时间戳/日期字符串
 * @returns {string} HH:mm:ss
 */
export function formatTime(date) {
    const d = new Date(date)
    const hour = String(d.getHours()).padStart(2, '0')
    const minute = String(d.getMinutes()).padStart(2, '0')
    const second = String(d.getSeconds()).padStart(2, '0')
    
    return `${hour}:${minute}:${second}`
}

/**
 * 格式化时间
 * @param {Date|string|number} date 日期对象/时间戳/日期字符串
 * @returns {string} YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(date) {
    // 将日期字符串转换为 iOS 支持的格式
    if (typeof date === 'string') {
        date = date.replace(/-/g, '/');
    }

    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hour = String(d.getHours()).padStart(2, '0')
    const minute = String(d.getMinutes()).padStart(2, '0')
    const second = String(d.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

/**
 * 格式化时间
 * @param {Date|string|number} date 日期对象/时间戳/日期字符串
 * @returns {string} YYYY-MM-DD
 */
export function formatDateTimeToYMD(date) {
    // 将日期字符串转换为 iOS 支持的格式
    if (typeof date === 'string') {
        date = date.replace(/-/g, '/');
    }

    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
}