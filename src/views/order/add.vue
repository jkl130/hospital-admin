<template>
  <div>
    <el-form :model="orderInfo" :rules="rules" ref="orderInfoForm" label-width="130px" label-position="left">
      <el-form-item label="患者id" prop="userID">
        <el-input v-model="orderInfo.userID" clearable placeholder="请输入患者id"></el-input>
      </el-form-item>
      <el-form-item label="医院" prop="hospitalName">
        <el-input v-model="orderInfo.hospitalName" clearable placeholder="请输入医院名称"></el-input>
      </el-form-item>
      <el-form-item label="科室" prop="officesName">
        <el-input v-model="orderInfo.officesName" clearable placeholder="请输入科室名称"></el-input>
      </el-form-item>
      <el-form-item label="医生" prop="doctorName">
        <el-input v-model="orderInfo.doctorName" clearable placeholder="请输入医生姓名"></el-input>
      </el-form-item>
      <el-form-item label="办理日期" prop="transactDate">
        <el-input v-model="orderInfo.transactDate" clearable placeholder="请输入办理日期"></el-input>
      </el-form-item>
      <el-form-item label="办理时间段" prop="transactTime">
        <el-input v-model="orderInfo.transactTime" clearable placeholder="请输入办理时间段"></el-input>
      </el-form-item>
      <el-form-item label="患者疾病信息" prop="diseaseInfo">
        <el-input v-model="orderInfo.diseaseInfo" type="textarea" autosize clearable placeholder="请输入患者疾病信息"></el-input>
      </el-form-item>
      <el-form-item label="预约识别码" prop="orderVer">
        <el-input v-model="orderInfo.orderVer" clearable placeholder="请输入预约识别码"></el-input>
      </el-form-item>
      <el-form-item label="是否完成" prop="isFinish">
        <el-radio-group v-model="orderInfo.isFinish">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否已支付" prop="isSuccess">
        <el-radio-group v-model="orderInfo.isSuccess">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否取消" prop="isCancel">
        <el-radio-group v-model="orderInfo.isCancel">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrder" :loading="loading">添加</el-button>
        <el-button @click="$refs.orderInfoForm.resetFields()">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'add',
  data() {
    return {
      // 订单信息
      orderInfo: {
        diseaseInfo: '',
        doctorName: '',
        hospitalName: '',
        isCancel: 0,
        isFinish: 0,
        isSuccess: 0,
        officesName: '',
        orderVer: '',
        transactDate: '',
        doctorDegree: '',
        transactTime: '',
        userID: ''
      },
      rules: {
        userID: [
          { required: true, message: '患者ID不能为空', trigger: 'blur' }
        ],
        doctorName: [
          { required: true, message: '医生姓名不能为空', trigger: 'blur' }
        ],
        officesName: [
          { required: true, message: '科室名称不能为空', trigger: 'blur' }
        ],
        hospitalName: [
          { required: true, message: '医院不能为空', trigger: 'blur' }
        ],
        transactDate: [
          { required: true, message: '办理日期不能为空', trigger: 'blur' }
        ],
        transactTime: [
          { required: true, message: '办理时间段不能为空', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    addOrder() {
      this.$refs.orderInfoForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$request('post', 'order/add', this.orderInfo).then(res => {
            this.$refs.orderInfoForm.resetFields()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
