import http from "@/services/core/http"
import type { ICaptcha, ILoginAccount, ILoginResponse, IUserInfo } from "../types/login";



class LoginService {
    private static instance: LoginService;
    static getInstance() {
        if (!LoginService.instance) {
            LoginService.instance = new LoginService();
        }
        return LoginService.instance;
    }


    /**
     * 登录
     * @param {ILoginAccount} account 登录账号
     * @param {string} account.username 用户名
     * @param {string} account.password 密码
     * @param {string} account.captcha 验证码
     * @param {string} account.captchaId 验证码ID
     * @returns {Promise<ILoginResponse>} 登录响应
     */
    login(account: ILoginAccount) {
        return http.post<ILoginResponse>("/auth/login", account);
    }


    /**
     * 获取验证码图片
     * @returns {Promise<ICaptcha>} 验证码图片
     */
    getCaptchaImage() {
        return http.get<ICaptcha>("/captcha/image");
    }


    /**
     * 获取当前登录用户信息
     * @returns {Promise<IUserInfo>} 返回用户详细信息，包含用户基本信息、角色和权限列表
     */
    getUserInfo() {
        return http.get<IUserInfo>("/auth/info");
    }


    /**
     * 获取当前登录用户菜单
     * @returns {Promise<any[]>} 返回用户可访问的菜单树形结构
     */
    getMenuList() {
        return http.get<any[]>("/menu/user/list");
    }

    /**
     * 退出登录
     */
    logout() {
        return http.post("/auth/logout");
    }
}


export const loginService = LoginService.getInstance();
