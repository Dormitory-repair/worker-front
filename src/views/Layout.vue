<template>
  <div class="layout-container">
    <el-container>
      <el-aside width="260px" class="sidebar">
        <div class="logo">
          <i class="el-icon-s-tools"></i>
          <span>维修工人端</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/pending-orders">
            <i class="el-icon-s-order"></i>
            <span>待接订单</span>
          </el-menu-item>
          <el-menu-item index="/history-orders">
            <i class="el-icon-tickets"></i>
            <span>历史订单</span>
          </el-menu-item>
          <el-menu-item index="/profile">
            <i class="el-icon-user"></i>
            <span>个人信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header" height="70px">
          <div class="header-left">
            <span class="page-title">{{ pageTitle }}</span>
          </div>
          <div class="header-right">
            <span class="welcome">欢迎，<strong>{{ workerName }}</strong></span>
            <el-button type="text" @click="handleLogout" class="logout-btn">
              <i class="el-icon-switch-button"></i> 退出
            </el-button>
          </div>
        </el-header>

        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      workerName: ''
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    },
    pageTitle() {
      return this.$route.meta.title || '维修工人端'
    }
  },
  created() {
    const workerInfo = localStorage.getItem('worker_info')
    if (workerInfo) {
      this.workerName = JSON.parse(workerInfo).name || '工人'
    }
  },
  methods: {
    handleLogout() {
      this.$confirm('确认退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('worker_token')
        localStorage.removeItem('worker_info')
        this.$message.success('已退出登录')
        this.$router.push('/login')
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.sidebar {
  background-color: #304156;
  height: 100vh;
  overflow-y: auto;
}

.logo {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  background-color: #263445;
}

.logo i {
  margin-right: 10px;
  font-size: 26px;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  height: 60px !important;
  line-height: 56px !important;
  font-size: 20px;
  /* display: flex !important;
  align-items: center !important; */
  padding: 0 60px !important;
}

.header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.welcome {
  color: #666;
  font-size: 18px;
  font-weight: 500;
}

.logout-btn {
  color: #409EFF;
  font-size: 14px;
}

.main-content {
  background-color: #f5f5f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
