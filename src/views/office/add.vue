<template>
  <div>
    <el-form :model="officeInfo" :rules="rules" ref="officeInfoForm" label-width="100px" label-position="left">
      <el-form-item label="医院名称" prop="hosId">
        <!-- <el-input v-model="officeInfo.hospitalName" clearable placeholder="请输入医院名称"></el-input> -->
        <el-select
          v-model="officeInfo.hosId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="searchHospital"
          @visible-change="visibleChange"
          :loading="hospitalLoading">
          <el-option v-for="item in hospitalOptions" :key="item.id" :label="item.hospitalName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室名称" prop="officesName">
        <el-input v-model="officeInfo.officesName" clearable placeholder="请输入科室名称"></el-input>
      </el-form-item>
      <el-form-item label="科室设备介绍" prop="officesEquipment">
        <el-input v-model="officeInfo.officesEquipment" type="textarea" autosize clearable placeholder="请输入科室设备介绍"></el-input>
      </el-form-item>
      <el-form-item label="科室简介" prop="doctorAdministrative">
        <el-input v-model="officeInfo.doctorAdministrative" type="textarea" autosize clearable placeholder="请输入科室简介"></el-input>
      </el-form-item>
      <el-form-item label="科室荣誉" prop="doctorDegree">
        <el-input v-model="officeInfo.doctorDegree" type="textarea" autosize clearable placeholder="请输入科室荣誉"></el-input>
      </el-form-item>
      <el-form-item label="科室诊断范围" prop="teachTitle">
        <el-input v-model="officeInfo.teachTitle" type="textarea" autosize clearable placeholder="请输入科室诊断范围"></el-input>
      </el-form-item>
      <el-form-item label="推荐" prop="rec">
        <el-input v-model.number="officeInfo.rec" type="number" clearable placeholder="推荐"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOffice" :loading="loading">添加</el-button>
        <el-button @click="$refs.officeInfoForm.resetFields()">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'add',
  data() {
    return {
      // 科室信息
      officeInfo: {
        doctorName: '',
        doctorSex: '男',
        doctorImg: '',
        hosId: '',
        officesName: '',
        doctorName: '',
        doctorTitle: '',
        doctorAdministrative: '',
        doctorDegree: '',
        doctorForte: '',
        doctorAbout: '',
        rec: ''
      },
      rules: {
        officesName: [
          { required: true, message: '科室名称不能为空', trigger: 'blur' }
        ],
        hosId: [
          { required: true, message: '医院不能为空', trigger: 'blur' }
        ]
      },
      loading: false,
      hospitalOptions: [],
      hospitalLoading: false
    }
  },
  methods: {
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
    addOffice() {
      console.log(this.officeInfo)
      this.$refs.officeInfoForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$request('post', 'office/add', this.officeInfo).then(res => {
            this.$refs.officeInfoForm.resetFields()
            this.loading = false
          }).catch(err => {
            this.loading = false
          })
        }
      });
    }
  }
}
</script>

<style>

</style>
