# 维修工人端前端系统

基于 Vue 2 + Element UI 的维修工人端管理系统

## 功能特性

### ✅ 已实现功能

1. **用户认证**
   - 工人登录（使用工号和密码）
   - JWT Token 验证
   - 自动登录检测
   - 退出登录

2. **待接订单管理**
   - 查看所有待接订单
   - 按报修类目筛选订单
   - 自动刷新（每30秒）
   - 快速接单
   - 查看订单详情

3. **订单详情**
   - 完整的订单信息展示
   - 报修现场图片预览（支持放大查看）
   - 接单操作
   - 完成订单操作
   - 订单状态实时更新

4. **历史订单**
   - 查看所有已接订单
   - 按状态筛选（全部/进行中/已完成）
   - 表格形式展示
   - 订单详情查看
   - 快速完成订单

5. **个人信息管理**
   - 查看个人信息
   - 编辑联系方式和工种
   - 修改密码
   - 工作统计（今日接单/本月接单/本月完成）

## 技术栈

- **前端框架**: Vue 2.6.14
- **UI组件库**: Element UI 2.15.13
- **路由管理**: Vue Router 3.5.1
- **HTTP请求**: Axios 0.27.2
- **构建工具**: Vue CLI 5.0

## 项目结构

```
worker-frontend/
├── public/                 # 静态资源
│   └── index.html         # HTML模板
├── src/                   # 源代码
│   ├── assets/           # 静态资源
│   ├── router/           # 路由配置
│   │   └── index.js
│   ├── views/            # 页面组件
│   │   ├── Login.vue           # 登录页
│   │   ├── Layout.vue          # 布局组件
│   │   ├── PendingOrders.vue   # 待接订单
│   │   ├── OrderDetail.vue     # 订单详情
│   │   ├── HistoryOrders.vue   # 历史订单
│   │   └── Profile.vue         # 个人信息
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── .gitignore
├── babel.config.js       # Babel配置
├── package.json          # 项目依赖
├── vue.config.js         # Vue CLI配置
└── README.md

```

## 安装依赖

```bash
cd worker-frontend
npm install
```

## 开发运行

```bash
npm run serve
```

项目将运行在 `http://localhost:8082`

## 生产构建

```bash
npm run build
```

构建产物将输出到 `dist/` 目录

## 配置说明

### API 地址配置

在 `src/main.js` 中修改后端API地址：

```javascript
axios.defaults.baseURL = 'http://localhost:8080'
```

### 端口配置

在 `vue.config.js` 中修改开发服务器端口：

```javascript
devServer: {
  port: 8082
}
```

## JWT Token 说明

### Token 存储

- 工人端 token 存储在 `localStorage` 的 `worker_token` 字段
- 工人信息存储在 `localStorage` 的 `worker_info` 字段

### 三端 Token 区分

系统支持三种不同的 token：
- `admin_token`: 管理员端
- `student_token`: 学生端
- `worker_token`: 工人端

请求拦截器会按优先级自动选择对应的 token：`admin > worker > student`

## API 接口

### 认证接口

- `POST /worker/login` - 工人登录
- `POST /logout` - 退出登录

### 订单接口

- `GET /api/worker/orders/pending` - 获取待接订单
- `GET /api/worker/orders/accepted` - 获取已接订单
- `GET /api/worker/orders/history` - 获取历史订单
- `GET /api/worker/orders/:orderId` - 获取订单详情
- `POST /api/worker/orders/:orderId/accept` - 接单
- `POST /api/worker/orders/:orderId/complete` - 完成订单
- `GET /api/worker/orders/stats` - 获取工作统计

### 个人信息接口

- `GET /profile` - 获取个人信息
- `POST /profile/update` - 更新个人信息
- `POST /change-password` - 修改密码

## 使用说明

### 1. 登录系统

使用工号和密码登录系统。登录成功后会自动跳转到待接订单页面。

### 2. 查看待接订单

- 可以查看所有待接订单
- 可以按报修类目筛选
- 点击"查看详情"查看完整信息
- 点击"接单"接受订单

### 3. 查看订单详情

- 显示完整的订单信息
- 可以查看报修现场图片（点击图片可放大）
- 可以进行接单或完成订单操作

### 4. 管理历史订单

- 查看所有已接订单
- 可以按状态筛选（全部/进行中/已完成）
- 可以快速完成进行中的订单

### 5. 个人信息管理

- 查看工作统计数据
- 编辑联系方式和工种
- 修改登录密码

## 注意事项

1. **图片路径**: 确保后端图片服务正确配置，图片URL格式为 `http://localhost:8080/upload/order/文件名`

2. **Token过期**: Token过期后会自动跳转到登录页面

3. **自动刷新**: 待接订单页面会每30秒自动刷新一次

4. **修改密码**: 修改密码成功后需要重新登录

## 开发团队

维修系统开发团队

## 许可证

Private
