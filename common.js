// common.js
(function() {
    'use strict';
    
    // 全局配置
    const CONFIG = {
        API_BASE_URL: 'http://localhost:8080',
        TOKEN_KEY: 'workerToken',
        TOKEN_HEADER: 'token'
    };
    
    // 检查并加载 axios
    if (!window.axios) {
        console.error('axios 未加载，请确保在 common.js 之前引入 axios');
        return;
    }
    
    // 设置 axios 默认配置
    axios.defaults.baseURL = CONFIG.API_BASE_URL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.timeout = 10000;
    
    // ==================== Token 管理函数 ====================
    
    // 保存 token
    function saveToken(token) {
        if (token) {
            localStorage.setItem(CONFIG.TOKEN_KEY, token);
            // 设置默认请求头
            axios.defaults.headers.common[CONFIG.TOKEN_HEADER] = token;
            console.log('Token 已保存并设置到请求头');
        }
    }
    
    // 获取 token
    function getToken() {
        return localStorage.getItem(CONFIG.TOKEN_KEY);
    }
    
    // 清除 token
    function clearToken() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        delete axios.defaults.headers.common[CONFIG.TOKEN_HEADER];
        console.log('Token 已清除');
    }
    
    // 验证 token 是否有效
    function validateToken() {
        const token = getToken();
        if (!token) {
            return false;
        }
        
        // 这里可以添加更复杂的 token 验证逻辑
        // 比如检查过期时间等
        return true;
    }
    
    // ==================== 请求拦截器 ====================
    
    // 请求拦截器 - 自动添加 token
    axios.interceptors.request.use(
        function(config) {
            // 从本地存储获取 token
            const token = getToken();
            if (token) {
                config.headers[CONFIG.TOKEN_HEADER] = token;
            }
            
            // 显示 loading（如果需要）
            if (config.showLoading !== false) {
                // 这里可以添加全局 loading 效果
            }
            
            return config;
        },
        function(error) {
            return Promise.reject(error);
        }
    );
    
    // ==================== 响应拦截器 ====================
    
    // 响应拦截器 - 处理 token 过期等
    axios.interceptors.response.use(
        function(response) {
            // 隐藏 loading
            // 这里可以隐藏全局 loading 效果
            
            // 检查响应中是否包含新的 token（用于 token 刷新）
            if (response.data && response.data.token) {
                saveToken(response.data.token);
            }
            
            return response;
        },
        function(error) {
            // 隐藏 loading
            
            if (error.response) {
                // 处理 HTTP 状态码错误
                switch (error.response.status) {
                    case 401:
                        // token 过期或无效
                        console.warn('Token 无效或已过期');
                        clearToken();
                        
                        // 如果不是在登录页，跳转到登录页
                        if (!window.location.pathname.includes('login.html')) {
                            window.location.href = 'login.html';
                        }
                        break;
                        
                    case 403:
                        console.error('权限不足');
                        break;
                        
                    case 404:
                        console.error('请求的资源不存在');
                        break;
                        
                    case 500:
                        console.error('服务器内部错误');
                        break;
                        
                    default:
                        console.error('请求错误:', error.message);
                }
            } else if (error.request) {
                // 请求已发送但没有收到响应
                console.error('网络连接失败，请检查网络');
            } else {
                // 请求配置出错
                console.error('请求配置错误:', error.message);
            }
            
            return Promise.reject(error);
        }
    );
    
    // ==================== 公共函数 ====================
    
    // 检查登录状态（页面加载时调用）
    function checkLoginStatus() {
        return new Promise((resolve, reject) => {
            const token = getToken();
            
            if (!token) {
                console.log('未检测到 token');
                resolve(false);
                return;
            }
            
            // 如果有 token，验证其有效性
            if (validateToken()) {
                console.log('Token 验证通过');
                resolve(true);
            } else {
                console.log('Token 无效');
                clearToken();
                resolve(false);
            }
        });
    }
    
    // 处理登录成功
    function handleLoginSuccess(token, redirectUrl = 'woker.html') {
        if (!token) {
            console.error('登录成功但未收到 token');
            return false;
        }
        
        // 保存 token
        saveToken(token);
        
        // 设置一个短暂的延迟确保 token 保存成功
        setTimeout(() => {
            // 跳转到指定页面
            window.location.href = redirectUrl;
        }, 500);
        
        return true;
    }
    
    // 处理退出登录
    function handleLogout(redirectUrl = 'login.html') {
        clearToken();
        window.location.href = redirectUrl;
    }
    
    // ==================== 暴露公共接口 ====================
    
    // 全局对象
    window.Common = {
        // 配置
        CONFIG: CONFIG,
        
        // Token 管理
        saveToken: saveToken,
        getToken: getToken,
        clearToken: clearToken,
        validateToken: validateToken,
        
        // 公共函数
        checkLoginStatus: checkLoginStatus,
        handleLoginSuccess: handleLoginSuccess,
        handleLogout: handleLogout,
        
        // 简化 axios 调用
        request: axios
    };
    
    console.log('Common.js 初始化完成');
    
})();