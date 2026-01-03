<template>
  <div class="order-detail">
    <el-card v-loading="loading">
      <div slot="header" class="detail-header">
        <el-button icon="el-icon-arrow-left" @click="goBack">返回</el-button>
        <span class="title">订单详情</span>
      </div>

      <div v-if="order" class="detail-content">
        <div class="info-container">
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="info-section">
                <h3>订单信息</h3>
                <el-descriptions :column="2" border class="center-descriptions">
                  <el-descriptions-item label="订单号">
                    {{ order.order_id }}
                  </el-descriptions-item>
                  <el-descriptions-item label="订单状态">
                    <el-tag :type="getStatusType(order)">
                      {{ getStatusText(order) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="报修类目">
                    {{ order.repair_category }}
                  </el-descriptions-item>
                  <el-descriptions-item label="具体事项">
                    {{ order.specific_item || '无' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="报修时间" :span="2">
                    {{ formatTime(order.repair_time) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="接单时间" :span="2" v-if="order.accepted_time">
                    {{ formatTime(order.accepted_time) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="完成时间" :span="2" v-if="order.completed_time">
                    {{ formatTime(order.completed_time) }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <div class="info-section">
                <h3>报修地址</h3>
                <el-descriptions :column="1" border class="center-descriptions">
                  <el-descriptions-item label="生活区">
                    {{ order.living_area }}
                  </el-descriptions-item>
                  <el-descriptions-item label="宿舍楼">
                    {{ order.building }}
                  </el-descriptions-item>
                  <el-descriptions-item label="房间号">
                    {{ order.room_number }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <div class="info-section">
                <h3>报修人信息</h3>
                <el-descriptions :column="2" border class="center-descriptions">
                  <el-descriptions-item label="姓名">
                    {{ order.reporter_name }}
                  </el-descriptions-item>
                  <el-descriptions-item label="联系电话">
                    {{ order.reporter_phone }}
                  </el-descriptions-item>
                  <el-descriptions-item label="账号" :span="2">
                    {{ order.reporter_account }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <div class="info-section" v-if="order.problem_description">
                <h3>问题描述</h3>
                <el-card shadow="never" class="description-card center-content">
                  {{ order.problem_description }}
                </el-card>
              </div>

              <div class="info-section" v-if="order.repair_images">
                <h3>现场图片</h3>
                <div class="image-gallery center-content">
                  <el-image
                    v-for="(image, index) in getImages(order.repair_images)"
                    :key="index"
                    :src="getImageUrl(image)"
                    :preview-src-list="getImageUrls(order.repair_images)"
                    fit="cover"
                    class="preview-image"
                  >
                    <div slot="error" class="image-error">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
              </div>

              <div class="info-section action-section">
                <h3>订单操作</h3>
                <div class="action-buttons">
                  <el-button
                    v-if="order.is_accepted === 0"
                    type="primary"
                    size="large"
                    icon="el-icon-check"
                    @click="acceptOrder"
                    style="width: 100%; margin-bottom: 10px;"
                  >
                    接单
                  </el-button>
                  <el-button
                    v-if="order.is_accepted === 1 && order.is_completed === 0"
                    type="success"
                    size="large"
                    icon="el-icon-circle-check"
                    @click="completeOrder"
                    style="width: 100%;"
                  >
                    完成订单
                  </el-button>
                  <el-alert
                    v-if="order.is_completed === 1"
                    title="订单已完成"
                    type="success"
                    :closable="false"
                    show-icon
                    class="center-content"
                  />
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OrderDetail',
  data() {
    return {
      order: null,
      loading: false
    }
  },
  created() {
    this.fetchOrderDetail()
  },
  methods: {
    fetchOrderDetail() {
      this.loading = true
      const orderId = this.$route.params.orderId
      
      this.$axios.get(`/api/worker/orders/${orderId}`)
        .then(res => {
          if (res.data.code === 1) {
            this.order = res.data.data
          } else {
            this.$message.error(res.data.message || '获取订单详情失败')
          }
        })
        .catch(error => {
          console.error(error)
          this.$message.error('获取订单详情失败')
        })
        .finally(() => {
          this.loading = false
        })
    },

    acceptOrder() {
      this.$confirm('确认接单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const workerInfo = JSON.parse(localStorage.getItem('worker_info'))
        this.$axios.post(`/api/worker/orders/${this.order.order_id}/accept`, null, {
          params: { workerId: workerInfo.id }
        })
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success('接单成功')
              this.fetchOrderDetail()
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

    completeOrder() {
      this.$confirm('确认完成订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const workerInfo = JSON.parse(localStorage.getItem('worker_info'))
        this.$axios.post(`/api/worker/orders/${this.order.order_id}/complete`, null, {
          params: { workerId: workerInfo.id }
        })
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success('订单已完成')
              this.fetchOrderDetail()
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

    getImages(imageStr) {
      if (!imageStr) return []
      return imageStr.split(',').filter(img => img.trim())
    },

    getImageUrl(imagePath) {
      return `http://localhost:8080${imagePath}`
    },

    getImageUrls(imageStr) {
      return this.getImages(imageStr).map(img => this.getImageUrl(img))
    },

    getStatusText(order) {
      if (order.is_completed === 1) return '已完成'
      if (order.is_accepted === 1) return '已接单'
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
    },

    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.order-detail {
  max-width: 1400px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.detail-header .title {
  font-size: 18px;
  font-weight: 500;
}

.detail-content {
  padding: 20px 0;
}

.info-container {
  max-width: 1200px;
  margin: 0 auto;
}

.info-section {
  margin-bottom: 30px;
}

.info-section h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
}

.center-descriptions {
  max-width: 800px; 
  margin: 0 auto; 
}

.center-content {
  max-width: 800px; 
  margin: 0 auto; 
}

.description-card {
  background-color: #f5f7fa;
  padding: 15px;
  line-height: 1.8;
  color: #606266;
  border-radius: 8px;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  max-width: 800px;
}

.preview-image {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;
}

.preview-image:hover {
  transform: scale(1.05);
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.action-section {
  padding-top: 20px;
  border-top: 1px solid #ebeef5; 
}

.action-buttons {
  max-width: 400px;
  margin: 20px auto 0;
}

.action-buttons .el-button {
  height: 45px; 
  font-size: 16px;
}
</style>