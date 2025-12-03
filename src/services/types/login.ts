/**
 * 登录账号
 */
export interface ILoginAccount {
    /**
     * 用户名
     */
    username: string;
    /**
     * 密码
     */
    password: string;
    /**
     * 验证码
     */
    captcha: string;
    /**
     * 验证码ID
     */
    captchaId: string;
}

/**
 * 登录用户信息
 */
export interface IUserInfo {
    /**
     * 用户名
     */
    username: string;
    /**
     * 角色
     */
    roles: string[];
    /**
     * 权限
     */
    permissions: string[];
    /**
     * ID
     */
    id: number | undefined;
    /**
     * 头像
     */
    headPic?: string | undefined;
    /**
     * 昵称
     */
    nickname?: string | undefined;
    /**
     * 邮箱
     */
    email?: string | undefined;

    /**
     * 其他属性
     */
    [key: string]: any;
}
/**
 * 登录响应
 */
export interface ILoginResponse {
    /**
     * 访问令牌
     */
    accessToken: string;
    /**
     * 刷新令牌
     */
    refreshToken: string;
    /**
     * 用户信息
     */
    userInfo: IUserInfo;

    [key: string]: any;
}

/**
 * 验证码
 */
export interface ICaptcha {
    /**
     * 验证码ID
     */
    captchaId: string;
    /**
     * 验证码图片
     */
    captcha: string;
}
