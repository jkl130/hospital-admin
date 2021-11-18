<template>
  <div>
    <el-table
      :data="orderList"
      border
      style="width: 100%">
<!--      <el-table-column-->
<!--        prop="id"-->
<!--        fixed-->
<!--        label="预约id"-->
<!--        align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="userID"-->
<!--        label="患者id"-->
<!--        align="center">-->
<!--      </el-table-column>-->
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
        prop="doctorName"
        label="医生姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="username"
        label="患者姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="transactDate"
        label="办理日期"
        align="center">
      </el-table-column>
      <el-table-column
        prop="transactTime"
        label="办理时间段"
        align="center">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="diseaseInfo"-->
<!--        label="疾病信息"-->
<!--        align="center">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="isSuccess"
        label="是否已支付"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isSuccess">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="isCancel"
        label="是否取消"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isCancel">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="isFinish"
        label="是否完成"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isFinish">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="updateOrderInfo(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click.stop="deleteOrder(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改订单信息" :visible.sync="updateDialogVisible" :close-on-click-modal="false" @close="resetOrderInfo">
      <el-form :model="orderInfo" :rules="rules" ref="orderInfoForm" label-width="130px" label-position="left">
        <el-form-item label="患者姓名" prop="username">
          <el-input v-model="orderInfo.username" clearable placeholder="请输入患者姓名" disabled></el-input>
        </el-form-item>
        <el-form-item label="医院" prop="hospitalName">
          <el-input v-model="orderInfo.hospitalName" clearable placeholder="请输入医院名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="科室" prop="officesName">
          <el-input v-model="orderInfo.officesName" clearable placeholder="请输入科室名称" disabled></el-input>
        </el-form-item>
        <el-form-item label="医生" prop="doctorName">
          <el-input v-model="orderInfo.doctorName" clearable placeholder="请输入医生姓名" disabled></el-input>
        </el-form-item>
        <el-form-item label="办理日期" prop="transactDate">
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
            placeholder="请输入办理时间段">
            <el-option
              v-for="item in timeList"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="患者疾病信息" prop="diseaseInfo">
          <el-input v-model="orderInfo.diseaseInfo" type="textarea" autosize clearable placeholder="请输入患者疾病信息"></el-input>
        </el-form-item>
        <el-form-item label="是否已支付" prop="isSuccess">
          <el-radio-group v-model="orderInfo.isSuccess">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
        <el-form-item label="是否取消" prop="isCancel">
          <el-radio-group v-model="orderInfo.isCancel">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetOrderInfo">取 消</el-button>
        <el-button type="primary" @click="submitOrderInfo">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'order',
  data() {
    return {
      orderList: [],
      orderInfo: {},
      updateDialogVisible: false,
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
      ]
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.$request('get', 'order/list').then(res => {
        this.orderList = res.data.data
      })
    },
    updateOrderInfo(orderInfo) {
      this.orderInfo = JSON.parse(JSON.stringify(orderInfo))
      this.updateDialogVisible = true
    },
    submitOrderInfo() {
      this.$refs.orderInfoForm.validate((valid) => {
        if (valid) {
          this.$request('put', 'order/update', this.orderInfo).then(res => {
            this.getOrderList()
            this.resetOrderInfo()
          })
        }
      })
    },
    resetOrderInfo() {
      this.updateDialogVisible = false
      this.$refs.orderInfoForm.resetFields()
    },
    deleteOrder(orderInfo) {
      this.$confirm('确定删除该订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request('delete', `order/delete/${orderInfo.id}`).then(res => {
          this.getOrderList()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style>

</style>
