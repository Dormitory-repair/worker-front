// 模拟工人账户数据
const mockWorkers = [
    { workerId: "W10023", password: "123456", name: "张明" },
    { workerId: "W10024", password: "123456", name: "李师傅" },
    { workerId: "W10025", password: "123456", name: "王师傅" }
];

// DOM元素
const loginForm = document.getElementById('login-form');
const workerIdInput = document.getElementById('worker-id');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('toggle-password');
const successModal = document.getElementById('success-modal');
const errorModal = document.getElementById('error-modal');
const errorMsg = document.getElementById('error-msg');
const closeErrorBtn = document.getElementById('close-error-btn');

// 页面加载初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('登录页面初始化');
    initEventListeners();
});

// 初始化事件监听
function initEventListeners() {
    // 显示/隐藏密码
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    // 表单提交
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // 关闭错误模态框
    closeErrorBtn.addEventListener('click', function() {
        errorModal.style.display = 'none';
    });
    
    // 点击模态框外部关闭模态框
    window.addEventListener('click', function(event) {
        if (event.target === errorModal) {
            errorModal.style.display = 'none';
        }
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // 回车键提交表单
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (workerIdInput === document.activeElement || passwordInput === document.activeElement)) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
}

// 处理登录
function handleLogin() {
    const workerId = workerIdInput.value.trim();
    const password = passwordInput.value;
    
    // 验证输入
    if (!workerId) {
        showError('请输入员工ID');
        return;
    }
    
    if (!password) {
        showError('请输入密码');
        return;
    }
    
    // 查找工人
    const worker = mockWorkers.find(w => 
        w.workerId === workerId && w.password === password
    );
    
    if (worker) {
        // 保存当前工人信息到sessionStorage，供维修界面使用
        sessionStorage.setItem('currentWorker', JSON.stringify(worker));
        
        // 显示成功提示
        showSuccess();
        
        // 2秒后跳转到维修界面
        setTimeout(() => {
            window.location.href = 'index.html'; // 跳转到维修主界面
        }, 2000);
    } else {
        showError('员工ID或密码错误，请重试');
    }
}

// 显示成功提示
function showSuccess() {
    successModal.style.display = 'flex';
}

// 显示错误提示
function showError(message) {
    errorMsg.textContent = message;
    errorModal.style.display = 'flex';
    
    // 添加错误动画效果
    workerIdInput.style.animation = 'shake 0.5s';
    passwordInput.style.animation = 'shake 0.5s';
    
    setTimeout(() => {
        workerIdInput.style.animation = '';
        passwordInput.style.animation = '';
    }, 500);
}

// 添加错误动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);