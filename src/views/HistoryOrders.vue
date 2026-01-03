<template>
  <div class="history-orders">
    <el-card class="filter-card">
      <el-row :gutter="20" type="flex" align="middle">
        <el-col :span="6">
          <el-select
            v-model="selectedStatus"
            placeholder="选择订单状态"
            @change="fetchOrders"
          >
            <el-option label="全部订单" value="all"></el-option>
            <el-option label="进行中" value="pending"></el-option>
            <el-option label="已完成" value="completed"></el-option>
          </el-select>
        </el-col>
        <el-col :span="18" style="display: flex; justify-content: flex-end; align-items: center;gap :5px;">
          <el-statistic
            group-separator=","
            :precision="0"
            :value="orders.length"
            title="订单总数"
          >
            <template slot="suffix">单</template>
          </el-statistic>
        </el-col>
        <el-col :span="6" style="text-align: right;">
          <el-button type="primary" icon="el-icon-refresh" @click="fetchOrders">
            刷新
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="orders-card" v-loading="loading">
      <div v-if="orders.length === 0" class="empty-data">
        <i class="el-icon-document"></i>
        <p>暂无历史订单</p>
      </div>

      <el-table
        v-else
        :data="orders"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="order_id" label="订单号" width="200" />
        
        <el-table-column label="订单状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row)">
              {{ getStatusText(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="repair_category" label="报修类目" width="120" />
        
        <el-table-column label="报修地址" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.living_area }} {{ scope.row.building }} {{ scope.row.room_number }}
          </template>
        </el-table-column>

        <el-table-column prop="reporter_name" label="报修人" width="100" />
        
        <el-table-column prop="reporter_phone" label="联系电话" width="130" />
        
        <el-table-column label="报修时间" width="160">
          <template slot-scope="scope">
            {{ formatTime(scope.row.repair_time) }}
          </template>
        </el-table-column>

        <el-table-column label="接单时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.accepted_time ? formatTime(scope.row.accepted_time) : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="完成时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.completed_time ? formatTime(scope.row.completed_time) : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-view"
              @click="viewDetail(scope.row.order_id)"
            >
              查看详情
            </el-button>
            <el-button
              v-if="scope.row.is_accepted === 1 && scope.row.is_completed === 0"
              type="text"
              icon="el-icon-check"
              @click="completeOrder(scope.row.order_id)"
            >
              完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HistoryOrders',
  data() {
    return {
      orders: [],
      selectedStatus: 'all',
      loading: false
    }
  },
  created() {
    this.fetchOrders()
  },
  methods: {
    fetchOrders() {
      this.loading = true
      const workerInfo = JSON.parse(localStorage.getItem('worker_info'))
      
      this.$axios.get('/api/worker/orders/history', {
        params: {
          workerId: workerInfo.id,
          status: this.selectedStatus
        }
      })
        .then(res => {
          if (res.data.code === 1) {
            this.orders = res.data.data || []
          } else {
            this.$message.error(res.data.message || '获取历史订单失败')
          }
        })
        .catch(error => {
          console.error(error)
          this.$message.error('获取历史订单失败')
        })
        .finally(() => {
          this.loading = false
        })
    },

    viewDetail(orderId) {
      this.$router.push(`/order-detail/${orderId}`)
    },

    completeOrder(orderId) {
      this.$confirm('确认完成订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const workerInfo = JSON.parse(localStorage.getItem('worker_info'))
        this.$axios.post(`/api/worker/orders/${orderId}/complete`, null, {
          params: { workerId: workerInfo.id }
        })
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success('订单已完成')
              this.fetchOrders()
            } else {
              this.$message.error(res.data.message || '完成订单失败')
            }
          })
          .catch(error => {
            console.error(error)
            this.$message.error('完成订单失败')
          })
      }).catch(() => {})
    },

    getStatusText(order) {
      if (order.is_completed === 1) return '已完成'
      if (order.is_accepted === 1) return '进行中'
      return '待接单'
    },

    getStatusType(order) {
      if (order.is_completed === 1) return 'success'
      if (order.is_accepted === 1) return 'warning'
      return 'info'
    },

    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.history-orders {
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
</style>