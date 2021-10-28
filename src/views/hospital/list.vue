<template>
  <div>
    <el-form :inline="true" :model="hospitalQueryForm" size="mini" class="demo-form-inline">
      <el-form-item label="省">
        <el-select v-model="hospitalQueryForm.province" placeholder="请选择" filterable clearable @change="provinceChange" @clear="provinceClear">
          <el-option
            v-for="(item, index) in provinceList"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市">
        <el-select v-model="hospitalQueryForm.city" placeholder="请选择" filterable clearable :disabled="cityDisabled" @change="cityChange" @clear="cityClear">
          <el-option
            v-for="(item, index) in cityList"
            :key="index"
            :label="item.areaName"
            :value="item.areaName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="县">
        <el-select v-model="hospitalQueryForm.district" placeholder="请选择"  :disabled="districtDisabled" filterable clearable>
          <el-option
            v-for="(item, index) in districtList"
            :key="index"
            :label="item.areaName"
            :value="item.areaName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医院类型">
        <el-input v-model="hospitalQueryForm.hospitalNature" clearable placeholder="请输入医院类型"></el-input>
      </el-form-item>
      <el-form-item label="医院等级">
        <el-input v-model="hospitalQueryForm.hospitalGrade" clearable placeholder="请输入医院等级"></el-input>
      </el-form-item>
      <el-form-item label="医院名称">
        <el-input v-model="hospitalQueryForm.hospitalName" clearable placeholder="请输入医院名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getHospitalList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="hospitalData.list"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="hospitalName"
        label="医院名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="hospitalArea"
        label="医院地区"
        align="center">
      </el-table-column>
      <el-table-column
        prop="hospitalImg"
        label="医院图片"
        align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" placement="right">
            <div slot="content">
              <img v-if="scope.row.hospitalImg" :src="scope.row.hospitalImg" class="tableImg1" />
              <img v-else src="static/imgs/noImg.png" class="tableImg1" />
            </div>
            <div>
              <img v-if="scope.row.hospitalImg" :src="scope.row.hospitalImg" class="tableImg" />
              <img v-else src="static/imgs/noImg.png" class="tableImg" />
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="hospitalDeanName"
        label="院长姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="hospitalYear"
        label="建院年份"
        align="center">
      </el-table-column>
      <el-table-column
        prop="hospitalNature"
        label="医院类型"
        align="center">
      </el-table-column>
      <el-table-column
        prop="hospitalGrade"
        label="医院等级"
        align="center">
      </el-table-column>
      <el-table-column
        prop="hospitalOfficesNum"
        label="科室数量"
        align="center">
      </el-table-column>
      <el-table-column
        prop="medicalInsuranceNum"
        label="医保人数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="hospitalBedNum"
        label="病床数量"
        align="center">
      </el-table-column>
      <el-table-column
        prop="outpatientNum"
        label="年门诊量"
        align="center">
      </el-table-column>
      <el-table-column
        prop="isMedicalInsurance"
        label="是否医保"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="hospitalEquipment"
        label="医院设备介绍"
        width="500"
        align="center">
      </el-table-column>
      <el-table-column
        prop="hospitalAbout"
        label="医院简介"
        width="500"
        align="center">
      </el-table-column>
      <el-table-column
        prop="hospitalHonor"
        label="医院荣誉"
        width="500"
        align="center">
      </el-table-column> -->
<!--      <el-table-column-->
<!--        prop="hospitalUrl"-->
<!--        label="医院网址"-->
<!--        align="center">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="hospitalPhone"
        label="医院电话"
        align="center">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="hospitalAddress"-->
<!--        label="医院地址"-->
<!--        align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="hospitalPostCode"-->
<!--        label="医院邮编"-->
<!--        align="center">-->
<!--      </el-table-column>-->
      <!-- <el-table-column
        prop="hospitalBusRoute"
        label="公交路线"
        align="center">
      </el-table-column> -->
      <el-table-column
        prop="isOpen"
        label="是否开启挂号"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isOpen">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rec"
        label="推荐"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="updateHospitalInfo(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click.stop="deleteHospital(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="paginationStyle"
      background
      layout="total ,prev, pager, next"
      @current-change="pageChange"
      :total="hospitalData.totalCount"
      :page-size="hospitalQueryForm.pageSize"
      hide-on-single-page
    >
    </el-pagination>
    <el-dialog title="修改医院信息" :visible.sync="updateDialogVisible" :close-on-click-modal="false" @close="resetHospitalInfo">
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
          <el-input v-model="hospitalInfo.hospitalOfficesNum" clearable placeholder="请输入科室数量" disabled></el-input>
        </el-form-item>
        <el-form-item label="医保人数" prop="medicalInsuranceNum">
          <el-input v-model="hospitalInfo.medicalInsuranceNum" clearable placeholder="请输入医保人数"></el-input>
        </el-form-item>
        <el-form-item label="病床数量" prop="hospitalBedNum">
          <el-input v-model="hospitalInfo.hospitalBedNum" clearable placeholder="请输入病床数量"></el-input>
        </el-form-item>
        <el-form-item label="年门诊量" prop="outpatientNum">
          <el-input v-model="hospitalInfo.outpatientNum" clearable placeholder="请输入年门诊量" disabled></el-input>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetHospitalInfo">取 消</el-button>
        <el-button type="primary" @click="submitHospitalInfo">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { imgUploadVerifyAndResize } from '@/utils/imgUtil'
export default {
  name: 'hospital',
  data() {
    return {
      provinceList: [
        '北京',
        '天津',
        '河北省',
        '山西省',
        '内蒙古自治区',
        '辽宁省',
        '吉林省',
        '黑龙江省',
        '上海',
        '江苏省',
        '浙江省',
        '安徽省',
        '福建省',
        '江西省',
        '山东省',
        '河南省',
        '湖北省',
        '湖南省',
        '广东省',
        '广西壮族自治区',
        '海南省',
        '重庆',
        '四川省',
        '贵州省',
        '云南省',
        '西藏自治区',
        '陕西省',
        '甘肃省',
        '青海省',
        '宁夏回族自治区',
        '新疆维吾尔自治区',
        '台湾省',
        '香港特别行政区',
        '澳门特别行政区'
      ],
      hospitalQueryForm: {
        province: '',
        city: '',
        district: '',
        hospitalNature: '',
        hospitalGrade: '',
        hospitalName: '',
        pageIndex: 1,
        pageSize: 10
      },
      cityList: [],
      districtList: [],
      cityDisabled: true,
      districtDisabled: true,
      hospitalData: {},
      hospitalInfo: {},
      // 是否显示修改医生信息的弹窗
      updateDialogVisible: false,
      rules: {},
      fileUrl: process.env.BASE_API + 'upload',
      uploadHeaders: {
        Authorization: `Bearer ${localStorage.token}`
      }
    }
  },
  mounted() {
    this.getHospitalList()
  },
  methods: {
    getHospitalList() {
      this.$request('post', 'hos/orderHos', this.getSearchParams(this.hospitalQueryForm)).then(res => {
        this.hospitalData = {
          list: res.data.data,
          totalCount: res.data.totalCount,
          pageSize: res.data.pageSize,
          pageIndex: res.data.pageIndex
        }
      })
    },
    provinceChange(province) {
      this.hospitalQueryForm.city = ''
      this.hospitalQueryForm.district = ''
      this.cityList = []
      province = province.replace(/\s/g, '')
      if (province) {
        this.$request('get', 'findAreaByLevel2', { areaName: province }).then(res => {
          this.cityList = res.data.data
          this.cityDisabled = false
        })
      }
    },
    cityChange(city) {
      this.hospitalQueryForm.district = ''
      this.districtList = []
      city = city.replace(/\s/g, '')
      if (this.hospitalQueryForm.province && city) {
        this.$request('get', 'findAreaByLevel3', { areaName: this.hospitalQueryForm.province, cityName: city }).then(res => {
          this.districtList = res.data.data
          this.districtDisabled = false
        })
      }
    },
    provinceClear() {
      this.hospitalQueryForm.city = ''
      this.hospitalQueryForm.district = ''
    },
    cityClear() {
      this.hospitalQueryForm.district = ''
    },
    pageChange(page) {
      this.hospitalQueryForm.pageIndex = page
      this.getHospitalList()
    },
    updateHospitalInfo(hospitalInfo) {
      this.hospitalInfo = JSON.parse(JSON.stringify(hospitalInfo))
      this.updateDialogVisible = true
    },
    submitHospitalInfo() {
      this.$refs.hospitalInfoForm.validate((valid) => {
        if (valid) {
          this.$request('put', 'hos/update', this.hospitalInfo).then(res => {
            this.getHospitalList()
            this.resetHospitalInfo()
          })
        }
      })
    },
    resetHospitalInfo() {
      this.updateDialogVisible = false
      this.$refs.hospitalInfoForm.resetFields()
    },
    deleteHospital(hospitalInfo) {
      this.$confirm('确定删除该医院？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request('delete', `hos/delete/${hospitalInfo.id}`).then(res => {
          this.getHospitalList()
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
        this.hospitalInfo.hospitalImg = res.data
      }
    }
  }
}
</script>

<style>

</style>
