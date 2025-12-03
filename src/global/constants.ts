/**
 * @Author: weipc 755197142@qq.com
 * @Date: 2025-02-18 14:54:25
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2025-02-27 23:58:53
 * @FilePath: src/global/constants.ts
 * @Description: 常量配置文件
 */

// 全局storage的前缀
export const GLOBAL_STORAGE_PREFIX = 'xlt_';

export const LOGIN_URL = '/login';

// 验证码过期时间
export const CAPTCHA_EXPIRE_TIME = 1000 * 60 * 2;

export const LAYOUT_CONSTANTS = {
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1440
    },
    DEBOUNCE_DELAY: 150,
    RESIZE_THRESHOLD: 50
} as const;
