<template>
  <div>
    <el-form :model="doctorInfo" :rules="rules" ref="doctorInfoForm" label-width="100px" label-position="left">
      <el-form-item label="姓名" prop="doctorName">
        <el-input v-model="doctorInfo.doctorName" clearable placeholder="请输入医生姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="doctorSex">
        <el-radio-group v-model="doctorInfo.doctorSex">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="照片" prop="doctorImg">
        <el-upload
          class="avatar-uploader"
          name="upload"
          accept="image/*"
          :action="fileUrl"
          :headers="uploadHeaders"
          :show-file-list="false"
          :before-upload="beforeImgUpload"
          :on-success="handleUploadSuccess"
          :on-error="uploadError"
        >
          <img v-if="doctorInfo.doctorImg" :src="doctorInfo.doctorImg" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="医院" prop="hosId">
        <!-- <el-input v-model="doctorInfo.hospitalName" clearable placeholder="请输入医院名称"></el-input> -->
        <el-select
          v-model="doctorInfo.hosId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="searchHospital"
          @visible-change="visibleChange"
          @change="hospitalChange"
          @clear="hospitalReset"
          :loading="hospitalLoading">
          <el-option v-for="item in hospitalOptions" :key="item.id" :label="item.hospitalName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室" prop="officeId">
        <!-- <el-input v-model="doctorInfo.officesName" clearable placeholder="请输入科室名称"></el-input> -->
        <el-select v-model="doctorInfo.officeId" placeholder="请选择科室">
          <el-option
            v-for="item in officeList"
            :key="item.id"
            :label="item.officesName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职称" prop="doctorTitle">
        <el-input v-model="doctorInfo.doctorTitle" clearable placeholder="请输入医生职称"></el-input>
      </el-form-item>
      <el-form-item label="行政职位" prop="doctorAdministrative">
        <el-input v-model="doctorInfo.doctorAdministrative" clearable placeholder="请输入医生行政职位"></el-input>
      </el-form-item>
      <el-form-item label="学位" prop="doctorDegree">
        <el-input v-model="doctorInfo.doctorDegree" clearable placeholder="请输入医生学位"></el-input>
      </el-form-item>
      <el-form-item label="教学支职称" prop="teachTitle">
        <el-input v-model="doctorInfo.teachTitle" clearable placeholder="请输入教学支职称"></el-input>
      </el-form-item>
      <el-form-item label="医生特长" prop="doctorForte">
        <el-input v-model="doctorInfo.doctorForte" type="textarea" autosize clearable placeholder="请输入医生特长"></el-input>
      </el-form-item>
      <el-form-item label="医生介绍" prop="doctorAbout">
        <el-input v-model="doctorInfo.doctorAbout" type="textarea" autosize clearable placeholder="请输入医生介绍"></el-input>
      </el-form-item>
      <el-form-item label="推荐" prop="rec">
        <el-input v-model.number="doctorInfo.rec" type="number" clearable placeholder="推荐"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addDoctor" :loading="loading">添加</el-button>
        <el-button @click="$refs.doctorInfoForm.resetFields()">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { imgUploadVerifyAndResize } from '@/utils/imgUtil'

export default {
  name: 'add',
  data() {
    return {
      // 医生信息
      doctorInfo: {
        doctorName: '',
        doctorSex: '男',
        doctorImg: '',
        // hospitalName: '',
        hosId: '',
        officeId: '',
        teachTitle: '',
        doctorTitle: '',
        doctorAdministrative: '',
        doctorDegree: '',
        doctorForte: '',
        doctorAbout: '',
        rec: ''
      },
      fileUrl: process.env.BASE_API + 'upload',
      uploadHeaders: {
        Authorization: `Bearer ${localStorage.token}`
      },
      rules: {
        doctorName: [
          { required: true, message: '医生姓名不能为空', trigger: 'blur' }
        ],
        doctorSex: [
          { required: true, message: '医生性别不能为空', trigger: 'blur' }
        ],
        doctorImg: [
          { required: true, message: '请上传医生照片', trigger: 'blur' }
        ],
        hosId: [
          { required: true, message: '医院不能为空', trigger: 'blur' }
        ],
        officeId: [
          { required: true, message: '科室不能为空', trigger: 'blur' }
        ]
      },
      loading: false,
      hospitalOptions: [],
      hospitalLoading: false,
      officeList: []
    }
  },
  methods: {
    visibleChange(val) {
      if (!val) {
        this.hospitalOptions = []
      }
    },
    /**
     * 图片上传之前触发
     * @param {file} file 文件内容
     */
    beforeImgUpload(file) {
      return imgUploadVerifyAndResize(file)
    },
    /**
     * @description 图片上传成功
     * @param {Object} res 图片信息
     */
    handleUploadSuccess(res) {
      if (res.success) {
        this.doctorInfo.doctorImg = res.data
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
    hospitalChange(id) {
      if (id) {
        this.$request('get', 'office/search', { hosId: id }).then(res => {
          this.officeList = res.data.data
        })
      }
    },
    hospitalReset() {
      this.officeList = []
      this.doctorInfo.officeId = ''
    },
    addDoctor() {
      console.log(this.doctorInfo)
      this.$refs.doctorInfoForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$request('post', 'doctor/add', this.doctorInfo).then(res => {
            this.$refs.doctorInfoForm.resetFields()
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
