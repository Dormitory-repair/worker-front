<template>
  <div class="pending-orders">
    <el-card class="filter-card">
      <el-row :gutter="20" type="flex" align="middle">
        <el-col :span="6">
          <el-select
            v-model="selectedCategory"
            placeholder="选择报修类目"
            clearable
            @change="fetchOrders"
          >
            <el-option label="全部类目" value=""></el-option>
            <el-option label="电工类" value="电工类"></el-option>
            <el-option label="水工类" value="水工类"></el-option>
            <el-option label="木工类" value="木工类"></el-option>
            <el-option label="金工类" value="金工类"></el-option>
            <el-option label="网络类" value="网络类"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-col>
        <el-col :span="18" style="display: flex; justify-content: flex-end;">

          <el-button type="primary" icon="el-icon-refresh" @click="fetchOrders">
            刷新
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="orders-card" v-loading="loading">
      <div v-if="orders.length === 0" class="empty-data">
        <i class="el-icon-document"></i>
        <p>暂无待接订单</p>
      </div>

      <el-row :gutter="20" v-else>
        <el-col :span="8" v-for="order in orders" :key="order.order_id">
          <el-card class="order-item" shadow="hover">
            <div class="order-header">
              <el-tag type="warning" size="small">待接单</el-tag>
              <span class="order-time">{{ formatTime(order.repair_time) }}</span>
            </div>

            <div class="order-content">
              <div class="order-row">
                <span class="label">报修类目：</span>
                <span class="value">{{ order.repair_category }}</span>
              </div>
              <div class="order-row">
                <span class="label">具体事项：</span>
                <span class="value">{{ order.specific_item || '无' }}</span>
              </div>
              <div class="order-row">
                <span class="label">地址：</span>
                <span class="value">{{ order.living_area }} {{ order.building }} {{ order.room_number }}</span>
              </div>
              <div class="order-row">
                <span class="label">报修人：</span>
                <span class="value">{{ order.reporter_name }}</span>
              </div>
              <div class="order-row">
                <span class="label">联系电话：</span>
                <span class="value">{{ order.reporter_phone }}</span>
              </div>
              <div class="order-row" v-if="order.problem_description">
                <span class="label">问题描述：</span>
                <span class="value description">{{ order.problem_description }}</span>
              </div>
            </div>

            <div class="order-actions">
              <el-button
                type="text"
                icon="el-icon-view"
                @click="viewDetail(order.order_id)"
              >
                查看详情
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="acceptOrder(order.order_id)"
              >
                接单
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PendingOrders',
  data() {
    return {
      orders: [],
      selectedCategory: '',
      loading: false
    }
  },
  created() {
    this.fetchOrders()
    this.startAutoRefresh()
  },
  beforeDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  },
  methods: {
    fetchOrders() {
      this.loading = true
      const workerInfo = JSON.parse(localStorage.getItem('worker_info'))
      const workType = this.selectedCategory || workerInfo.workType
      
      this.$axios.get('/api/worker/orders/pending', {
        params: { workType: this.selectedCategory }
      })
        .then(res => {
          if (res.data.code === 1) {
            this.orders = res.data.data || []
          } else {
            this.$message.error(res.data.message || '获取订单失败')
          }
        })
        .catch(error => {
          console.error(error)
          this.$message.error('获取订单失败')
        })
        .finally(() => {
          this.loading = false
        })
    },

    acceptOrder(orderId) {
      this.$confirm('确认接单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const workerInfo = JSON.parse(localStorage.getItem('worker_info'))
        this.$axios.post(`/api/worker/orders/${orderId}/accept`, null, {
          params: { workerId: workerInfo.id }
        })
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success('接单成功')
              this.fetchOrders()
            } else {
              this.$message.error(res.data.message || '接单失败')
            }
          })
          .catch(error => {
            console.error(error)
            this.$message.error('接单失败')
          })
      }).catch(() => {})
    },

    viewDetail(orderId) {
      this.$router.push(`/order-detail/${orderId}`)
    },

    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },

    startAutoRefresh() {
      this.refreshTimer = setInterval(() => {
        this.fetchOrders()
      }, 30000)
    }
  }
}
</script>

<style scoped>
.pending-orders {
  padding: 0;
}

.filter-card {
  margin-bottom: 20px;
}

.orders-card {
  min-height: 400px;
}

.empty-data {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.empty-data i {
  font-size: 64px;
  margin-bottom: 20px;
  display: block;
}

.order-item {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.order-item:hover {
  transform: translateY(-5px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.order-time {
  color: #999;
  font-size: 12px;
}

.order-content {
  margin-bottom: 15px;
}

.order-row {
  margin-bottom: 8px;
  font-size: 14px;
  display: flex;
}

.order-row .label {
  color: #666;
  min-width: 80px;
}

.order-row .value {
  color: #333;
  flex: 1;
}

.order-row .description {
  color: #666;
  line-height: 1.6;
}

.order-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
</style>