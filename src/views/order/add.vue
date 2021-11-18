<template>
  <div>
    <el-form :model="orderInfo" :rules="rules" ref="orderInfoForm" size="medium" label-width="130px" label-position="left">
      <el-form-item label="患者id" prop="userID">
        <el-input v-model="orderInfo.userID" clearable placeholder="请输入患者id"></el-input>
      </el-form-item>
      <div style="display: flex;">
        <el-form-item label="医院" style="width:33.33333%" prop="hosId">
          <!-- <el-input v-model="orderInfo.hospitalName" clearable placeholder="请输入医院名称"></el-input> -->
          <el-select
            v-model="orderInfo.hosId"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            style="width:98%"
            :remote-method="searchHospital"
            @visible-change="visibleChange"
            @change="hospitalChange"
            @clear="hospitalReset"
            :loading="hospitalLoading">
            <el-option
              v-for="item in hospitalOptions"
              :key="item.id"
              :label="item.hospitalName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室" style="width:33.33333%" prop="officeId">
          <!-- <el-input v-model="orderInfo.officesName" clearable placeholder="请输入科室名称"></el-input> -->
          <el-select
            v-model="orderInfo.officeId"
            placeholder="请选择科室"
            style="width:98%"
            @change="officeChange">
            <el-option
              v-for="item in officeList"
              :key="item.id"
              :label="item.officesName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医生" style="width:33.33333%" prop="doctorId">
          <!-- <el-input v-model="orderInfo.doctorName" clearable placeholder="请输入医生姓名"></el-input> -->
          <el-select
            v-model="orderInfo.doctorId"
            style="width:98%"
            placeholder="请选择医生">
            <el-option
              v-for="item in doctorList"
              :key="item.id"
              :label="item.doctorName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div style="display: flex;">
        <el-form-item label="办理日期" style="width:33.33333%" prop="transactDate">
          <!-- <el-input v-model="orderInfo.transactDate" clearable placeholder="请输入办理日期"></el-input> -->
          <el-date-picker
            v-model="orderInfo.transactDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择办理日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="办理时间段" prop="transactTime">
          <!-- <el-input v-model="orderInfo.transactTime" clearable placeholder="请输入办理时间段"></el-input> -->
          <el-select
            v-model="orderInfo.transactTime"
            style="width:220px"
            placeholder="请输入办理时间段">
            <el-option
              v-for="item in timeList"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
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
        doctorId: '',
        hosId: '',
        isCancel: 0,
        isFinish: 0,
        isSuccess: 0,
        officeId: '',
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
        doctorId: [
          { required: true, message: '医生姓名不能为空', trigger: 'blur' }
        ],
        officeId: [
          { required: true, message: '科室名称不能为空', trigger: 'blur' }
        ],
        hosId: [
          { required: true, message: '医院不能为空', trigger: 'blur' }
        ],
        transactDate: [
          { required: true, message: '办理日期不能为空', trigger: 'blur' }
        ],
        transactTime: [
          { required: true, message: '办理时间段不能为空', trigger: 'blur' }
        ]
      },
      loading: false,
      timeList: [
        {
          value: '8:00-11:00'
        },
        {
          value: '13:00-15:00'
        },
        {
          value: '15:00-18:00'
        }
      ],
      hospitalOptions: [],
      hospitalLoading: false,
      officeList: [],
      doctorList: []
    }
  },
  methods: {
    hospitalReset() {
      this.officeList = []
      this.doctorList = []
      this.orderInfo.officeId = ''
      this.orderInfo.doctorId = ''
    },
    officeChange(id) {
      if (id) {
        this.officeId = id
        this.$request('get', 'doctor/search', { hosId: this.orderInfo.hosId, officeId: id }).then(res => {
          this.doctorList = res.data.data
        })
      }
    },
    hospitalChange(id) {
      if (id) {
        this.$request('get', 'office/search', { hosId: id }).then(res => {
          this.officeList = res.data.data
        })
      }
    },
    searchHospital(query) {
      this.hospitalOptions = []
      this.officeList = []
      if (query !== '') {
        this.$request('get', 'hos/search', { hospitalName: query }).then(res => {
          if (res && res.data && res.data.success && res.data.data) {
            this.hospitalOptions = res.data.data
            this.hospitalLoading = false;
          } else {
            this.hospitalOptions = []
            this.hospitalLoading = true;
          }
        })
      } else {
        this.hospitalLoading = false
      }
    },
    visibleChange(val) {
      if (!val) {
        this.hospitalOptions = []
      }
    },
    addOrder() {
      console.log(this.orderInfo)
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
