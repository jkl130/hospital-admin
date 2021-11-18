<template>
  <div>
    <el-form :inline="true" :model="officeQueryForm" size="mini" class="demo-form-inline">
      <el-form-item label="医院名称">
        <el-input v-model="officeQueryForm.hospitalName" clearable placeholder="请输入医院名称"></el-input>
      </el-form-item>
      <el-form-item label="科室名称">
        <el-input v-model="officeQueryForm.officesName" clearable placeholder="请输入科室名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="officeData.list"
      border
      style="width: 100%">
      <el-table-column
        prop="hospitalName"
        label="医院名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="officesName"
        label="科室名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="doctorNum"
        label="科室医生人数"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="officesEquipment"
        label="科室设备介绍"
        align="center">
      </el-table-column>
      <el-table-column
        prop="officesAbout"
        label="科室简介"
        align="center">
      </el-table-column>
      <el-table-column
        prop="officesHonor"
        label="科室荣誉"
        align="center">
      </el-table-column>
      <el-table-column
        prop="officesDiagnosisScope"
        label="科室诊断范围"
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
          <el-button type="text" size="mini" @click.stop="updateOfficeInfo(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click.stop="deleteOffice(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="paginationStyle"
      background
      layout="total ,prev, pager, next"
      @current-change="pageChange"
      :total="officeData.totalCount"
      :page-size="officeData.pageSize"
      :currentPage="officeData.pageIndex"
      hide-on-single-page
    >
    </el-pagination>
    <el-dialog
      title="修改科室信息"
      :visible.sync="updateDialogVisible"
      :close-on-click-modal="false"
      @close="resetOfficeInfo"
    >
      <el-form :model="officeInfo" :rules="rules" ref="officeInfoForm" label-width="100px" label-position="left">
        <el-form-item label="医院名称" prop="hospitalName">
          <el-input v-model="officeInfo.hospitalName" clearable placeholder="请输入医院名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="科室名称" prop="officesName">
          <!-- <el-input v-model="officeInfo.officesName" clearable placeholder="请输入科室名称"></el-input> -->
          <el-select v-model="officeInfo.officesName" placeholder="请选择科室" value-key="id" @change="officeChange">
            <el-option
              v-for="item in officeList"
              :key="item.id"
              :label="item.officesName"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室医生人数" prop="doctorNum">
          <el-input v-model="officeInfo.doctorNum" clearable placeholder="请输入科室医生人数" disabled></el-input>
        </el-form-item>
        <el-form-item label="科室设备介绍" prop="officesEquipment">
          <el-input v-model="officeInfo.officesEquipment" clearable placeholder="请输入科室设备介绍"></el-input>
        </el-form-item>
        <el-form-item label="科室简介" prop="doctorAdministrative">
          <el-input v-model="officeInfo.doctorAdministrative" clearable placeholder="请输入科室简介"></el-input>
        </el-form-item>
        <el-form-item label="科室荣誉" prop="doctorDegree">
          <el-input v-model="officeInfo.doctorDegree" clearable placeholder="请输入科室荣誉"></el-input>
        </el-form-item>
        <el-form-item label="科室诊断范围" prop="teachTitle">
          <el-input v-model="officeInfo.teachTitle" clearable placeholder="请输入科室诊断范围"></el-input>
        </el-form-item>
        <el-form-item label="推荐" prop="rec">
          <el-input v-model.number="officeInfo.rec" type="number" clearable placeholder="推荐"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetOfficeInfo">取 消</el-button>
        <el-button type="primary" @click="submitOfficeInfo">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'office',
  data() {
    return {
      officeQueryForm: {
        officesName: '',
        hospitalName: '',
        pageIndex: 1,
        pageSize: 10
      },
      officeData: {},
      // 需要修改的科室当前信息
      officeInfo: {},
      // 是否显示修改科室信息的弹窗
      updateDialogVisible: false,
      // 自定义表单校验规则(https://element.eleme.cn/#/zh-CN/component/form)
      rules: {
        id: [
          { required: true, message: '科室名称不能为空', trigger: 'blur' }
        ],
        hospitalName: [
          { required: true, message: '医院名称不能为空', trigger: 'blur' }
        ]
      },
      officeList: []
    }
  },
  mounted() {
    this.getOfficeList()
  },
  methods: {
    search() {
      this.officeQueryForm = {
        ...this.officeQueryForm,
        pageSize: 10,
        pageIndex: 1
      }
      this.getOfficeList()
    },
    /**
     * 获取科室列表
     */
    getOfficeList() {
      this.$request('post', 'office/orderOffice', this.getSearchParams(this.officeQueryForm)).then(res => {
        this.officeData = {
          list: res.data.data,
          totalCount: res.data.totalCount,
          pageSize: res.data.pageSize,
          pageIndex: res.data.pageIndex
        }
      })
    },
    pageChange(page) {
      this.officeQueryForm.pageIndex = page
      this.getOfficeList()
    },
    updateOfficeInfo(officeInfo) {
      this.officeInfo = JSON.parse(JSON.stringify(officeInfo))
      this.getHospitalOfficeList(officeInfo.hosId)
      this.updateDialogVisible = true
    },
    submitOfficeInfo() {
      this.$refs.officeInfoForm.validate((valid) => {
        if (valid) {
          this.$request('put', 'doctor/update', this.officeInfo).then(res => {
            this.getOfficeList()
            this.resetOfficeInfo()
          })
        }
      })
    },
    resetOfficeInfo() {
      this.updateDialogVisible = false
      this.$refs.officeInfoForm.resetFields()
    },
    getHospitalOfficeList(hosId) {
      if (hosId) {
        this.$request('get', 'office/search', { hosId }).then(res => {
          this.officeList = res.data.data
        })
      }
    },
    officeChange(data) {
      this.officeInfo.id = data.id
      this.officeInfo.officesName = data.officesName
    },
    deleteOffice(officeInfo) {
      this.$confirm('确定删除该科室？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request('delete', `office/delete/${officeInfo.id}`).then(res => {
          this.getOfficeList()
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style>

</style>
