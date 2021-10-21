<template>
  <div>
    <el-table
      :data="faqList"
      border
      style="width: 100%">
      <el-table-column
        prop="questionType"
        fixed
        label="问题类型"
        align="center">
      </el-table-column>
      <el-table-column
        prop="question"
        label="问题"
        align="center">
      </el-table-column>
      <!-- <el-table-column
        prop="answer"
        label="回答"
        align="center">
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="updateFaqInfo(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click.stop="deleteFaq(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改问答信息" :visible.sync="updateDialogVisible" :close-on-click-modal="false" @close="resetFaqInfo">
      <el-form :model="faqInfo" :rules="rules" ref="faqInfoForm" label-width="130px" label-position="left">
        <el-form-item label="问题类型" prop="questionType">
          <el-input v-model="faqInfo.questionType" clearable placeholder="请输入问题类型"></el-input>
        </el-form-item>
        <el-form-item label="问题" prop="question">
          <el-input v-model="faqInfo.question" type="textarea" autosize clearable placeholder="请输入问题"></el-input>
        </el-form-item>
        <el-form-item label="回答" prop="answer">
          <el-input v-model="faqInfo.answer" type="textarea" autosize clearable placeholder="请输入回答"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFaqInfo">取 消</el-button>
        <el-button type="primary" @click="submitFaqInfo">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'faq_list',
  data() {
    return {
      faqList: [],
      faqInfo: {},
      updateDialogVisible: false,
      rules: {
        questionType: [
          { required: true, message: '问题类型不能为空', trigger: 'blur' }
        ],
        question: [
          { required: true, message: '问题不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getFaqList()
  },
  methods: {
    getFaqList() {
      this.$request('get', 'help/list').then(res => {
        this.faqList = res.data.data
      })
    },
    updateFaqInfo(faqInfo) {
      this.faqInfo = JSON.parse(JSON.stringify(faqInfo))
      this.updateDialogVisible = true
    },
    submitFaqInfo() {
      this.$refs.faqInfoForm.validate((valid) => {
        if (valid) {
          this.$request('put', 'help/update', this.faqInfo).then(res => {
            this.getFaqList()
            this.resetFaqInfo()
          })
        }
      });
    },
    resetFaqInfo() {
      this.updateDialogVisible = false
      this.$refs.faqInfoForm.resetFields()
    },
    deleteFaq(faqInfo) {
      this.$confirm('确定删除该问答？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request('delete', `help/delete/${faqInfo.id}`).then(res => {
          this.getFaqList();
        })
      }).catch(() => {});
    }
  }
}
</script>

<style>

</style>