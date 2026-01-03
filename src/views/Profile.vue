<template>
  <div class="profile">
    <el-row :gutter="30">
      <el-col :span="24">
        <el-card class="info-card" style="margin: 20px;">
          <div slot="header" class="card-header" >
            <span style="font-size: 24px; font-weight: bold;">个人信息</span>
            <el-button
              v-if="!editing"
              type="primary"
              size="medium"
              icon="el-icon-edit"
              @click="startEdit"
            >
              编辑
            </el-button>
          </div>

          <el-form
            v-if="!editing"
            label-width="120px"
            class="info-form"
          >
            <el-form-item label="工号">
              <span>{{ workerInfo.workerCode }}</span>
            </el-form-item>
            <el-form-item label="姓名">
              <span >{{ workerInfo.name }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span>{{ workerInfo.phone }}</span>
            </el-form-item>
            <el-form-item label="工种">
              <span>{{ workerInfo.workType }}</span>
            </el-form-item>
            <el-form-item label="入职日期">
              <span>{{ workerInfo.hireDate }}</span>
            </el-form-item>
          </el-form>

          <el-form
            v-else
            :model="editForm"
            :rules="editRules"
            ref="editForm"
            label-width="120px"
            class="info-form"
          >
            <el-form-item label="工号">
              <span>{{ workerInfo.workerCode }}</span>
            </el-form-item>
            <el-form-item label="姓名">
              <span>{{ workerInfo.name }}</span>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="editForm.phone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="工种" prop="workType">
              <el-select v-model="editForm.workType" placeholder="请选择工种" style="width: 100%;">
                <el-option label="电工" value="电工"></el-option>
                <el-option label="水工" value="水工"></el-option>
                <el-option label="木工" value="木工"></el-option>
                <el-option label="金工" value="金工"></el-option>
                <el-option label="网络" value="网络"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveEdit" :loading="saving">
                保存
              </el-button>
              <el-button @click="cancelEdit">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- <el-card class="password-card" style="margin-top: 20px;">
          <div slot="header" class="card-header">
            <span>修改密码</span>
          </div>

          <el-form
            :model="passwordForm"
            :rules="passwordRules"
            ref="passwordForm"
            label-width="100px"
            class="password-form"
          >
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="请输入旧密码"
                show-password
              />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="请输入新密码"
                show-password
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="changePassword"
                :loading="changingPassword"
              >
                修改密码
              </el-button>
              <el-button @click="resetPasswordForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    // const validateConfirmPassword = (rule, value, callback) => {
    //   if (value !== this.passwordForm.newPassword) {
    //     callback(new Error('两次输入的密码不一致'))
    //   } else {
    //     callback()
    //   }
    // }

    return {
      workerInfo: {},
      stats: {},
      editing: false,
      editForm: {
        phone: '',
        workType: ''
      },
      editRules: {
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        workType: [
          { required: true, message: '请选择工种', trigger: 'change' }
        ]
      },
      // passwordForm: {
      //   oldPassword: '',
      //   newPassword: '',
      //   confirmPassword: ''
      // },
      // passwordRules: {
      //   oldPassword: [
      //     { required: true, message: '请输入旧密码', trigger: 'blur' }
      //   ],
      //   newPassword: [
      //     { required: true, message: '请输入新密码', trigger: 'blur' },
      //     { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
      //   ],
      //   confirmPassword: [
      //     { required: true, message: '请再次输入新密码', trigger: 'blur' },
      //     { validator: validateConfirmPassword, trigger: 'blur' }
      //   ]
      // },
      statsLoading: false,
      saving: false,
      // changingPassword: false
    }
  },
  created() {
    this.loadWorkerInfo()
    this.loadStats()
  },
  methods: {
    loadWorkerInfo() {
      const info = localStorage.getItem('worker_info')
      if (info) {
        this.workerInfo = JSON.parse(info)
      }
    },

    loadStats() {
      this.statsLoading = true
      this.$axios.get('/api/worker/orders/stats', {
        params: { workerId: this.workerInfo.id }
      })
        .then(res => {
          if (res.data.code === 1) {
            this.stats = res.data.data
          }
        })
        .catch(error => {
          console.error(error)
        })
        .finally(() => {
          this.statsLoading = false
        })
    },

    startEdit() {
      this.editing = true
      this.editForm.phone = this.workerInfo.phone
      this.editForm.workType = this.workerInfo.workType
    },

    cancelEdit() {
      this.editing = false
      this.$refs.editForm.resetFields()
    },

    saveEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.saving = true
          this.$axios.post('/profile/update', {
            workerId: this.workerInfo.id,
            phone: this.editForm.phone,
            workType: this.editForm.workType
          })
            .then(res => {
              if (res.data.code === 1) {
                this.$message.success('修改成功')
                this.workerInfo.phone = this.editForm.phone
                this.workerInfo.workType = this.editForm.workType
                localStorage.setItem('worker_info', JSON.stringify(this.workerInfo))
                this.editing = false
              } else {
                this.$message.error(res.data.message || '修改失败')
              }
            })
            .catch(error => {
              console.error(error)
              this.$message.error('修改失败')
            })
            .finally(() => {
              this.saving = false
            })
        }
      })
    },

    // changePassword() {
    //   this.$refs.passwordForm.validate(valid => {
    //     if (valid) {
    //       this.changingPassword = true
    //       this.$axios.post('/change-password', {
    //         workerId: this.workerInfo.id,
    //         oldPassword: this.passwordForm.oldPassword,
    //         newPassword: this.passwordForm.newPassword,
    //         confirmPassword: this.passwordForm.confirmPassword
    //       })
    //         .then(res => {
    //           if (res.data.code === 1) {
    //             this.$message.success('密码修改成功，请重新登录')
    //             setTimeout(() => {
    //               localStorage.removeItem('worker_token')
    //               localStorage.removeItem('worker_info')
    //               this.$router.push('/login')
    //             }, 1500)
    //           } else {
    //             this.$message.error(res.data.message || '密码修改失败')
    //           }
    //         })
    //         .catch(error => {
    //           console.error(error)
    //           this.$message.error('密码修改失败')
    //         })
    //         .finally(() => {
    //           this.changingPassword = false
    //         })
    //     }
    //   })
    // },

    // resetPasswordForm() {
    //   this.$refs.passwordForm.resetFields()
    // }
  }
}
</script>

<style scoped>
.profile {
  padding: 0;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px); 
}



.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #ecf5ff;
  border-bottom: 2px solid #409EFF;
}

.info-form{
  max-width: 600px;
  padding: 30px;
}

.info-form span {
  color: #606266;
  font-size: 16px; 
}
.info-form .el-form-item__label {
  font-size: 16px; /* 新增：标签文字加大 */
  font-weight: 600; /* 新增：标签文字加粗 */
  color: #303133; /* 新增：标签颜色加深 */
}

.info-card {
  border-radius: 12px; /* 新增：卡片圆角加大 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 新增：卡片阴影 */
}

/* 新增：响应式调整 */
@media (max-width: 768px) {
  .el-col {
    width: 100%;
  }
  
  .info-form {
    padding: 15px;
  }
}
</style>
