<template>
  <div>
    <el-form :inline="true" :model="doctorQueryForm" size="mini" class="demo-form-inline">
      <el-form-item label="医院">
        <el-input v-model="doctorQueryForm.hospitalName" clearable placeholder="请输入医院名称"></el-input>
      </el-form-item>
      <el-form-item label="科室">
        <el-input v-model="doctorQueryForm.officesName" clearable placeholder="请输入科室名称"></el-input>
      </el-form-item>
      <el-form-item label="医生">
        <el-input v-model="doctorQueryForm.doctorName" clearable placeholder="请输入医生姓名"></el-input>
      </el-form-item>
      <el-form-item label="职称">
        <el-input v-model="doctorQueryForm.doctorTitle" clearable placeholder="请输入医生职称"></el-input>
      </el-form-item>
      <el-form-item label="行政职位">
        <el-input v-model="doctorQueryForm.doctorAdministrative" clearable placeholder="请输入医生行政职位"></el-input>
      </el-form-item>
      <el-form-item label="学位">
        <el-input v-model="doctorQueryForm.doctorDegree" clearable placeholder="请输入医生学位"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDoctorList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="doctorData.list"
      border
      style="width: 100%">
      <el-table-column
        prop="doctorName"
        fixed
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="doctorSex"
        label="性别"
        align="center">
      </el-table-column>
      <el-table-column
        prop="doctorImg"
        label="照片"
        align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              <img v-if="scope.row.doctorImg" :src="scope.row.doctorImg" class="tableImg1" />
              <img v-else src="static/imgs/noImg.png" class="tableImg1" />
            </div>
            <div>
              <img v-if="scope.row.doctorImg" :src="scope.row.doctorImg" class="tableImg" />
              <img v-else src="static/imgs/noImg.png" class="tableImg" />
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="hospitalName"
        label="医院"
        align="center">
      </el-table-column>
      <el-table-column
        prop="officesName"
        label="科室"
        align="center">
      </el-table-column>
      <el-table-column
        prop="doctorTitle"
        label="职称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="teachTitle"
        label="教学支职称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="doctorAdministrative"
        label="行政职位"
        align="center">
      </el-table-column>
      <el-table-column
        prop="doctorDegree"
        label="学位"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="doctorForte"
        label="医生特长"
        align="center">
      </el-table-column>
      <el-table-column
        prop="doctorAbout"
        label="医生介绍"
        align="center">
      </el-table-column> -->
      <el-table-column
        prop="rec"
        label="推荐"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="updateDoctorInfo(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click.stop="deleteDoctor(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="paginationStyle"
      background
      layout="total ,prev, pager, next"
      @current-change="pageChange"
      :total="doctorData.totalCount"
      :page-size="doctorQueryForm.pageSize"
      hide-on-single-page
    >
    </el-pagination>
    <el-dialog title="修改医生信息" :visible.sync="updateDialogVisible" :close-on-click-modal="false" @close="resetDoctorInfo">
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
            <img v-if="doctorInfo.doctorImg" :src="doctorInfo.doctorImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="医院" prop="hospitalName">
          <el-input v-model="doctorInfo.hospitalName" clearable placeholder="请输入医院名称"></el-input>
        </el-form-item>
        <el-form-item label="科室" prop="officesName">
          <el-input v-model="doctorInfo.officesName" clearable placeholder="请输入科室名称"></el-input>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetDoctorInfo">取 消</el-button>
        <el-button type="primary" @click="submitDoctorInfo">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { imgUploadVerifyAndResize } from '@/utils/imgUtil'
export default {
  name: 'doctor',
  data() {
    return {
      // 医生信息，用于查询医生
      doctorQueryForm: {
        hospitalName: '',
        officesName: '',
        doctorName: '',
        doctorTitle: '',
        doctorAdministrative: '',
        doctorDegree: '',
        pageIndex: 1,
        pageSize: 10
      },
      // 医生列表，即通过医生信息（doctorQueryForm）查询到的医生
      doctorData: [],
      // 需要修改的医生当前信息
      doctorInfo: {},
      // 是否显示修改医生信息的弹窗
      updateDialogVisible: false,
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
        hospitalName: [
          { required: true, message: '医院不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getDoctorList()
  },
  methods: {
    /**
     * 获取医生列表
     */
    getDoctorList() {
      this.$request('post', 'doctor/allDoctor', this.getSearchParams(this.doctorQueryForm)).then(res => {
        this.doctorData = {
          list: res.data.data,
          totalCount: res.data.totalCount,
          pageSize: res.data.pageSize,
          pageIndex: res.data.pageIndex
        }
      })
    },
    pageChange(page) {
      this.doctorQueryForm.pageIndex = page
      this.getDoctorList()
    },
    updateDoctorInfo(doctorInfo) {
      this.doctorInfo = JSON.parse(JSON.stringify(doctorInfo))
      this.updateDialogVisible = true
    },
    submitDoctorInfo() {
      this.$refs.doctorInfoForm.validate((valid) => {
        if (valid) {
          this.$request('put', 'doctor/update', this.doctorInfo).then(res => {
            this.getDoctorList()
            this.resetDoctorInfo()
          })
        }
      })
    },
    resetDoctorInfo() {
      this.updateDialogVisible = false
      this.$refs.doctorInfoForm.resetFields()
    },
    deleteDoctor(doctorInfo) {
      this.$confirm('确定删除该医生？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request('delete', `doctor/delete/${doctorInfo.id}`).then(res => {
          this.getDoctorList()
        })
      }).catch(() => {})
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
    }
  }
}
</script>

<style>

</style>
