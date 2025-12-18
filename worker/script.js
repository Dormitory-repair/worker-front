// ==================== 完整版维修界面JS ====================

// 核心功能函数
function handleLogout() {
    console.log('退出函数被调用');
    
    if (confirm('确定要退出登录吗？')) {
        console.log('用户确认退出');
        
        // 清除sessionStorage
        sessionStorage.removeItem('currentWorker');
        console.log('sessionStorage已清除');
        
        // 直接跳转，不加延迟
        window.location.href = 'login.html';
        return true;
    }
    return false;
}

function getTypeText(type) {
    const typeMap = {
        'carpentry': '木工',
        'metalwork': '金工',
        'plumbing': '水工',
        'electric': '电工',
        'other': '其他'
    };
    return typeMap[type] || '未知';
}

// 显示通知
function showNotification(message, type) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.8rem;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // 添加动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // 3秒后移除通知
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        
        // 添加滑出动画
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(slideOutStyle);
        
        setTimeout(() => {
            notification.remove();
            style.remove();
            slideOutStyle.remove();
        }, 300);
    }, 3000);
}

// ==================== 模拟数据 ====================

const mockData = {
    worker: {
        name: "张明",
        workerId: "W10023",
        phone: "138-0013-8000",
        specialty: "木工/水电",
        joinDate: "2022-05-15",
        monthlyOrders: 24,
        todayOrders: 2,
        completedThisMonth: 18
    },
    unclaimedOrders: [
        {
            id: "R20231115001",
            type: "carpentry",
            building: "3号楼",
            room: "305",
            description: "床板断裂需要更换",
            studentName: "李同学",
            studentPhone: "138-0013-8001",
            time: "2023-11-15 09:30",
            urgent: false
        },
        {
            id: "R20231115002",
            type: "plumbing",
            building: "5号楼",
            room: "412",
            description: "卫生间水管漏水",
            studentName: "王同学",
            studentPhone: "138-0013-8002",
            time: "2023-11-15 10:15",
            urgent: true
        },
        {
            id: "R20231115003",
            type: "electric",
            building: "2号楼",
            room: "208",
            description: "宿舍插座无电",
            studentName: "赵同学",
            studentPhone: "138-0013-8003",
            time: "2023-11-15 08:45",
            urgent: false
        },
        {
            id: "R20231114004",
            type: "metalwork",
            building: "4号楼",
            room: "317",
            description: "窗户锁损坏",
            studentName: "刘同学",
            studentPhone: "138-0013-8004",
            time: "2023-11-14 16:20",
            urgent: false
        },
        {
            id: "R20231114005",
            type: "other",
            building: "1号楼",
            room: "105",
            description: "门锁卡住无法打开",
            studentName: "陈同学",
            studentPhone: "138-0013-8005",
            time: "2023-11-14 14:10",
            urgent: true
        }
    ],
    activeOrders: [
        {
            id: "R20231114001",
            type: "carpentry",
            building: "6号楼",
            room: "502",
            description: "书桌抽屉轨道损坏",
            studentName: "孙同学",
            studentPhone: "138-0013-8006",
            time: "2023-11-14 10:30",
            acceptedTime: "2023-11-14 11:15",
            status: "active"
        },
        {
            id: "R20231113002",
            type: "plumbing",
            building: "3号楼",
            room: "210",
            description: "洗手池下水缓慢",
            studentName: "周同学",
            studentPhone: "138-0013-8007",
            time: "2023-11-13 15:45",
            acceptedTime: "2023-11-13 16:20",
            status: "active"
        }
    ],
    historyOrders: [
        {
            id: "R20231112001",
            type: "electric",
            building: "5号楼",
            room: "408",
            description: "照明灯不亮",
            studentName: "吴同学",
            studentPhone: "138-0013-8008",
            time: "2023-11-12 09:15",
            completedTime: "2023-11-12 10:30",
            status: "completed"
        },
        {
            id: "R20231111002",
            type: "carpentry",
            building: "2号楼",
            room: "115",
            description: "椅子腿松动",
            studentName: "郑同学",
            studentPhone: "138-0013-8009",
            time: "2023-11-11 14:20",
            completedTime: "2023-11-11 15:10",
            status: "completed"
        },
        {
            id: "R20231110003",
            type: "metalwork",
            building: "4号楼",
            room: "303",
            description: "阳台护栏生锈需处理",
            studentName: "钱同学",
            studentPhone: "138-0013-8010",
            time: "2023-11-10 11:05",
            cancelledTime: "2023-11-10 11:40",
            status: "cancelled"
        }
    ]
};

// ==================== DOM元素 ====================

// 导航相关
const navButtons = document.querySelectorAll('.nav-btn');
const contentSections = document.querySelectorAll('.content-section');

// 订单相关
const filterButtons = document.querySelectorAll('.filter-btn');
const unclaimedOrdersList = document.getElementById('unclaimed-orders-list');
const activeOrdersList = document.getElementById('active-orders-list');
const historyOrdersList = document.getElementById('history-orders-list');
const historyFilter = document.getElementById('history-filter');

// 模态框相关
const acceptModal = document.getElementById('accept-modal');
const completeModal = document.getElementById('complete-modal');

// 用户相关
const logoutBtn = document.getElementById('logout-btn');
const editProfileBtn = document.querySelector('.edit-profile-btn');

// 当前选中的订单ID
let selectedOrderId = null;

// ==================== 业务逻辑函数 ====================

// 页面加载初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
    
    // 初始化工人信息
    initWorkerInfo();
    
    // 渲染订单列表
    renderOrders();
    
    // 初始化事件监听
    initEventListeners();
    
    // 设置退出按钮（使用单一方式）
    setupLogoutButton();
});

// 初始化工人信息
function initWorkerInfo() {
    // 优先从sessionStorage获取
    const storedWorker = sessionStorage.getItem('currentWorker');
    
    if (storedWorker) {
        try {
            const worker = JSON.parse(storedWorker);
            console.log('从sessionStorage加载:', worker);
            
            // 更新工人姓名
            document.getElementById('worker-name').textContent = worker.name;
            document.getElementById('profile-worker-name').textContent = worker.name;
            document.getElementById('detail-name').textContent = worker.name;
            
            // 更新工人ID
            document.getElementById('profile-worker-id').textContent = worker.workerId;
            document.getElementById('detail-worker-id').textContent = worker.workerId;
            
            // 更新其他信息
            document.getElementById('detail-phone').textContent = worker.phone || mockData.worker.phone;
            document.getElementById('detail-specialty').textContent = worker.specialty || mockData.worker.specialty;
            
        } catch (error) {
            console.error('解析工人信息失败:', error);
            useDefaultWorkerInfo();
        }
    } else {
        useDefaultWorkerInfo();
    }
}

function useDefaultWorkerInfo() {
    const worker = mockData.worker;
    
    // 更新工人姓名
    document.getElementById('worker-name').textContent = worker.name;
    document.getElementById('profile-worker-name').textContent = worker.name;
    document.getElementById('detail-name').textContent = worker.name;
    
    // 更新工人ID
    document.getElementById('profile-worker-id').textContent = worker.workerId;
    document.getElementById('detail-worker-id').textContent = worker.workerId;
    
    // 更新电话号码
    document.getElementById('detail-phone').textContent = worker.phone;
    
    // 更新工种
    document.getElementById('detail-specialty').textContent = worker.specialty;
    
    // 更新入职日期
    document.getElementById('detail-join-date').textContent = worker.joinDate;
    
    // 更新本月订单数
    document.getElementById('detail-month-orders').textContent = worker.monthlyOrders;
    
    // 更新今日订单数
    document.getElementById('today-orders').textContent = worker.todayOrders;
    
    // 更新本月完成数
    document.querySelector('.stat-number').textContent = worker.completedThisMonth;
}

// 专门设置退出按钮的函数 - 修复版
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (!logoutBtn) {
        console.error('退出按钮未找到！');
        return;
    }
    
    console.log('找到退出按钮:', logoutBtn);
    
    // 移除所有可能的事件监听器
    const newLogoutBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
    
    // 更新引用
    const currentLogoutBtn = newLogoutBtn;
    
    // 只使用一种方式绑定事件
    currentLogoutBtn.addEventListener('click', function(e) {
        console.log('退出按钮被点击');
        
        // 防止事件冒泡
        e.preventDefault();
        e.stopPropagation();
        
        // 调用退出函数
        handleLogout();
        
        // 返回false阻止默认行为
        return false;
    });
    
    console.log('退出按钮设置完成');
}

// 初始化其他事件监听
function initEventListeners() {
    // 导航按钮点击事件
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // 更新活动按钮
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应内容区域
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // 分类筛选按钮点击事件
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // 更新活动按钮
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 根据类别筛选订单
            filterUnclaimedOrders(category);
        });
    });
    
    // 历史订单筛选事件
    if (historyFilter) {
        historyFilter.addEventListener('change', filterHistoryOrders);
    }
    
    // 模态框关闭按钮事件
    document.querySelectorAll('.close-modal, .cancel-btn').forEach(button => {
        button.addEventListener('click', function() {
            acceptModal.style.display = 'none';
            completeModal.style.display = 'none';
        });
    });
    
    // 编辑个人信息按钮事件
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            alert('编辑个人信息功能正在开发中...');
        });
    }
    
    // 点击模态框外部关闭模态框
    window.addEventListener('click', function(event) {
        if (event.target === acceptModal) {
            acceptModal.style.display = 'none';
        }
        if (event.target === completeModal) {
            completeModal.style.display = 'none';
        }
    });
}

// 渲染订单
function renderOrders() {
    // 更新徽章计数
    updateBadgeCounts();
    
    // 渲染未接订单
    renderUnclaimedOrders();
    
    // 渲染已接待订单
    renderActiveOrders();
    
    // 渲染历史订单
    renderHistoryOrders();
}

// 更新徽章计数
function updateBadgeCounts() {
    document.getElementById('unclaimed-count').textContent = mockData.unclaimedOrders.length;
    document.getElementById('active-count').textContent = mockData.activeOrders.length;
}

// 渲染未接订单
function renderUnclaimedOrders() {
    const container = document.getElementById('unclaimed-orders-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    mockData.unclaimedOrders.forEach(order => {
        const orderElement = createOrderElement(order, 'unclaimed');
        container.appendChild(orderElement);
    });
}

// 渲染已接待订单
function renderActiveOrders() {
    const container = document.getElementById('active-orders-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    mockData.activeOrders.forEach(order => {
        const orderElement = createOrderElement(order, 'active');
        container.appendChild(orderElement);
    });
}

// 渲染历史订单
function renderHistoryOrders() {
    const container = document.getElementById('history-orders-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    mockData.historyOrders.forEach(order => {
        const orderElement = createOrderElement(order, 'history');
        container.appendChild(orderElement);
    });
}

// 创建订单元素
function createOrderElement(order, section) {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    
    // 根据订单类型设置样式类
    const typeClass = `type-${order.type}`;
    const typeText = getTypeText(order.type);
    
    // 根据部分设置状态文本和类
    let statusText = '';
    let statusClass = '';
    
    if (section === 'unclaimed') {
        statusText = '未接单';
        statusClass = 'status-unclaimed';
    } else if (section === 'active') {
        statusText = '维修中';
        statusClass = 'status-active';
    } else if (section === 'history') {
        if (order.status === 'completed') {
            statusText = '已完成';
            statusClass = 'status-completed';
        } else if (order.status === 'cancelled') {
            statusText = '已取消';
            statusClass = 'status-cancelled';
        }
    }
    
    // 构建订单内容
    orderCard.innerHTML = `
        <div class="order-info">
            <div class="order-header">
                <div class="order-id">${order.id}</div>
                <div class="order-status ${statusClass}">${statusText}</div>
            </div>
            <div class="order-type ${typeClass}">${typeText}</div>
            <div class="order-details">
                <p><strong>宿舍楼：</strong>${order.building}</p>
                <p><strong>房间号：</strong>${order.room}</p>
                <p><strong>报修描述：</strong>${order.description}</p>
                <p><strong>报修人：</strong>${order.studentName} (${order.studentPhone})</p>
                ${order.urgent ? '<p><strong style="color:#e74c3c;">紧急订单</strong></p>' : ''}
            </div>
            <div class="order-time">报修时间：${order.time}</div>
        </div>
        <div class="order-actions">
            ${section === 'unclaimed' ? 
                `<button class="btn accept-btn" data-order-id="${order.id}">
                    <i class="fas fa-check-circle"></i> 接单
                </button>` : ''}
            ${section === 'active' ? 
                `<button class="btn complete-btn" data-order-id="${order.id}">
                    <i class="fas fa-flag-checkered"></i> 完成
                </button>` : ''}
            <button class="btn details-btn">
                <i class="fas fa-info-circle"></i> 详情
            </button>
        </div>
    `;
    
    // 添加事件监听
    if (section === 'unclaimed') {
        const acceptBtn = orderCard.querySelector('.accept-btn');
        acceptBtn.addEventListener('click', function() {
            selectedOrderId = this.getAttribute('data-order-id');
            showAcceptModal(order);
        });
    } else if (section === 'active') {
        const completeBtn = orderCard.querySelector('.complete-btn');
        completeBtn.addEventListener('click', function() {
            selectedOrderId = this.getAttribute('data-order-id');
            showCompleteModal(order);
        });
    }
    
    // 详情按钮事件
    const detailsBtn = orderCard.querySelector('.details-btn');
    detailsBtn.addEventListener('click', function() {
        showOrderDetails(order, section);
    });
    
    return orderCard;
}

// 显示接单确认模态框
function showAcceptModal(order) {
    document.getElementById('modal-order-id').textContent = order.id;
    document.getElementById('modal-order-type').textContent = getTypeText(order.type);
    document.getElementById('modal-order-building').textContent = order.building;
    document.getElementById('modal-order-room').textContent = order.room;
    document.getElementById('modal-order-desc').textContent = order.description;
    
    // 确认接单按钮事件
    const confirmBtn = acceptModal.querySelector('.confirm-btn');
    confirmBtn.onclick = function() {
        acceptOrder(selectedOrderId);
        acceptModal.style.display = 'none';
    };
    
    acceptModal.style.display = 'flex';
}

// 显示完成订单确认模态框
function showCompleteModal(order) {
    document.getElementById('complete-modal-order-id').textContent = order.id;
    document.getElementById('complete-modal-order-type').textContent = getTypeText(order.type);
    
    // 确认完成按钮事件
    const confirmBtn = completeModal.querySelector('.confirm-btn');
    confirmBtn.onclick = function() {
        completeOrder(selectedOrderId);
        completeModal.style.display = 'none';
    };
    
    completeModal.style.display = 'flex';
}

// 显示订单详情
function showOrderDetails(order, section) {
    let detailsText = `订单号：${order.id}\n`;
    detailsText += `报修类型：${getTypeText(order.type)}\n`;
    detailsText += `宿舍楼：${order.building}\n`;
    detailsText += `房间号：${order.room}\n`;
    detailsText += `报修描述：${order.description}\n`;
    detailsText += `报修人：${order.studentName}\n`;
    detailsText += `联系电话：${order.studentPhone}\n`;
    detailsText += `报修时间：${order.time}\n`;
    
    if (section === 'active' && order.acceptedTime) {
        detailsText += `接单时间：${order.acceptedTime}\n`;
    }
    
    if (section === 'history') {
        if (order.completedTime) {
            detailsText += `完成时间：${order.completedTime}\n`;
        }
        if (order.cancelledTime) {
            detailsText += `取消时间：${order.cancelledTime}\n`;
        }
    }
    
    alert(detailsText);
}

// 接单功能
function acceptOrder(orderId) {
    // 在实际应用中，这里会发送API请求
    // 这里使用模拟数据
    
    // 找到订单
    const orderIndex = mockData.unclaimedOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    // 从未接订单中移除
    const [acceptedOrder] = mockData.unclaimedOrders.splice(orderIndex, 1);
    
    // 添加到已接待订单
    acceptedOrder.acceptedTime = new Date().toLocaleString('zh-CN');
    acceptedOrder.status = 'active';
    mockData.activeOrders.push(acceptedOrder);
    
    // 更新今日订单数
    mockData.worker.todayOrders += 1;
    document.getElementById('today-orders').textContent = mockData.worker.todayOrders;
    
    // 更新本月订单数
    mockData.worker.monthlyOrders += 1;
    document.getElementById('detail-month-orders').textContent = mockData.worker.monthlyOrders;
    
    // 重新渲染订单列表
    renderUnclaimedOrders();
    renderActiveOrders();
    
    // 更新徽章计数
    updateBadgeCounts();
    
    // 显示成功消息
    showNotification(`成功接单：${orderId}`, 'success');
}

// 完成订单功能
function completeOrder(orderId) {
    // 在实际应用中，这里会发送API请求
    // 这里使用模拟数据
    
    // 找到订单
    const orderIndex = mockData.activeOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    // 从已接待订单中移除
    const [completedOrder] = mockData.activeOrders.splice(orderIndex, 1);
    
    // 添加到历史订单
    completedOrder.completedTime = new Date().toLocaleString('zh-CN');
    completedOrder.status = 'completed';
    mockData.historyOrders.unshift(completedOrder);
    
    // 更新本月完成数
    mockData.worker.completedThisMonth += 1;
    document.querySelector('.stat-number').textContent = mockData.worker.completedThisMonth;
    
    // 重新渲染订单列表
    renderActiveOrders();
    renderHistoryOrders();
    
    // 更新徽章计数
    updateBadgeCounts();
    
    // 显示成功消息
    showNotification(`订单完成：${orderId}`, 'success');
}

// 根据类别筛选未接订单
function filterUnclaimedOrders(category) {
    const container = document.getElementById('unclaimed-orders-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    let filteredOrders = mockData.unclaimedOrders;
    
    if (category !== 'all') {
        filteredOrders = mockData.unclaimedOrders.filter(order => order.type === category);
    }
    
    filteredOrders.forEach(order => {
        const orderElement = createOrderElement(order, 'unclaimed');
        container.appendChild(orderElement);
    });
}

// 筛选历史订单
function filterHistoryOrders() {
    const container = document.getElementById('history-orders-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    let filteredOrders = mockData.historyOrders;
    const statusFilter = historyFilter.value;
    
    // 状态筛选
    if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    filteredOrders.forEach(order => {
        const orderElement = createOrderElement(order, 'history');
        container.appendChild(orderElement);
    });
}
