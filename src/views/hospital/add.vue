<template>
  <div>
    <el-form :model="hospitalInfo" :rules="rules" ref="hospitalInfoForm" label-width="120px" label-position="left">
      <el-form-item label="医院名称" prop="hospitalName">
        <el-input v-model="hospitalInfo.hospitalName" clearable placeholder="请输入医院名称"></el-input>
      </el-form-item>
      <el-form-item label="医院地区" prop="hospitalArea">
        <el-input v-model="hospitalInfo.hospitalArea" clearable placeholder="请输入医院地区"></el-input>
      </el-form-item>
      <el-form-item label="医院图片" prop="hospitalImg">
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
          <img v-if="hospitalInfo.hospitalImg" :src="hospitalInfo.hospitalImg" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="院长姓名" prop="hospitalDeanName">
        <el-input v-model="hospitalInfo.hospitalDeanName" clearable placeholder="请输入院长姓名"></el-input>
      </el-form-item>
      <el-form-item label="建院年份" prop="hospitalYear">
        <el-input v-model="hospitalInfo.hospitalYear" clearable placeholder="请输入建院年份"></el-input>
      </el-form-item>
      <el-form-item label="医院类型" prop="hospitalNature">
        <el-input v-model="hospitalInfo.hospitalNature" clearable placeholder="请输入医院类型"></el-input>
      </el-form-item>
      <el-form-item label="医院等级" prop="hospitalGrade">
        <el-input v-model="hospitalInfo.hospitalGrade" clearable placeholder="请输入医院等级"></el-input>
      </el-form-item>
      <el-form-item label="科室数量" prop="hospitalOfficesNum">
        <el-input v-model="hospitalInfo.hospitalOfficesNum" clearable placeholder="请输入科室数量"></el-input>
      </el-form-item>
      <el-form-item label="医保人数(保留)" prop="medicalInsuranceNum">
        <el-input v-model="hospitalInfo.medicalInsuranceNum" clearable placeholder="请输入医保人数（保留）"></el-input>
      </el-form-item>
      <el-form-item label="病床数量" prop="hospitalBedNum">
        <el-input v-model="hospitalInfo.hospitalBedNum" clearable placeholder="请输入病床数量"></el-input>
      </el-form-item>
      <el-form-item label="年门诊量" prop="outpatientNum">
        <el-input v-model="hospitalInfo.outpatientNum" clearable placeholder="请输入年门诊量"></el-input>
      </el-form-item>
      <el-form-item label="是否医保" prop="isMedicalInsurance">
        <el-input v-model="hospitalInfo.isMedicalInsurance" clearable placeholder="是否医保"></el-input>
      </el-form-item>
      <el-form-item label="医院设备介绍" prop="hospitalEquipment">
        <el-input v-model="hospitalInfo.hospitalEquipment" type="textarea" autosize clearable placeholder="请输入医院设备介绍"></el-input>
      </el-form-item>
      <el-form-item label="医院简介" prop="hospitalAbout">
        <el-input v-model="hospitalInfo.hospitalAbout" type="textarea" autosize clearable placeholder="请输入医院简介"></el-input>
      </el-form-item>
      <el-form-item label="医院荣誉" prop="hospitalHonor">
        <el-input v-model="hospitalInfo.hospitalHonor" type="textarea" autosize clearable placeholder="请输入医院荣誉"></el-input>
      </el-form-item>
      <el-form-item label="医院网址" prop="hospitalUrl">
        <el-input v-model="hospitalInfo.hospitalUrl" clearable placeholder="请输入医院网址"></el-input>
      </el-form-item>
      <el-form-item label="医院电话" prop="hospitalPhone">
        <el-input v-model="hospitalInfo.hospitalPhone" autosize clearable placeholder="请输入医院电话"></el-input>
      </el-form-item>
      <el-form-item label="医院地址" prop="hospitalAddress">
        <el-input v-model="hospitalInfo.hospitalAddress" type="textarea" autosize clearable placeholder="请输入医院地址"></el-input>
      </el-form-item>
      <el-form-item label="医院邮编" prop="hospitalPostCode">
        <el-input v-model="hospitalInfo.hospitalPostCode" clearable placeholder="请输入医院邮编"></el-input>
      </el-form-item>
      <el-form-item label="公交路线" prop="hospitalBusRoute">
        <el-input v-model="hospitalInfo.hospitalBusRoute" type="textarea" autosize clearable placeholder="请输入公交路线"></el-input>
      </el-form-item>
      <el-form-item label="是否开启挂号" prop="isOpen">
        <el-radio-group v-model="hospitalInfo.isOpen">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推荐" prop="rec">
        <el-input v-model.number="hospitalInfo.rec" type="number" clearable placeholder="请输入正整数"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addHospital" :loading="loading">添加</el-button>
        <el-button @click="$refs.hospitalInfoForm.resetFields()">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {imgUploadVerifyAndResize} from '@/utils/imgUtil'
export default {
  name: 'add',
  data() {
    return {
      // 医院信息
      hospitalInfo: {
        hospitalName: '',
        hospitalArea: '',
        hospitalImg: '',
        hospitalDeanName: '',
        hospitalYear: '',
        hospitalNature: '',
        hospitalGrade: '',
        hospitalOfficesNum: '',
        medicalInsuranceNum: '',
        outpatientNum: '',
        isMedicalInsurance: '',
        hospitalEquipment: '',
        hospitalAbout: '',
        hospitalHonor: '',
        hospitalUrl: '',
        hospitalPhone: '',
        hospitalAddress: '',
        hospitalPostCode: '',
        hospitalBusRoute: '',
        hospitalAddress: '',
        isOpen: 1,
        rec: ''
      },
      fileUrl: process.env.BASE_API + 'upload',
      uploadHeaders: {
        Authorization: `Bearer ${localStorage.token}`
      },
      rules: {},
      loading: false
    }
  },
  methods: {
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
        console.log(res.data)
        this.hospitalInfo.hospitalImg = res.data;
      }
    },
    addHospital() {
      this.$refs.hospitalInfoForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$request('post', 'hos/add', this.hospitalInfo).then(res => {
            this.$refs.hospitalInfoForm.resetFields()
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