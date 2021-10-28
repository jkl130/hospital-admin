<template>
  <div>
    <el-form :model="faqInfo" :rules="rules" ref="faqInfoForm" label-width="80px" label-position="right">
      <el-form-item label="问题类型" prop="questionType">
        <el-input v-model="faqInfo.questionType" clearable placeholder="请输入问题类型"></el-input>
      </el-form-item>
      <el-form-item label="问题" prop="question">
        <el-input v-model="faqInfo.question" type="textarea" autosize clearable placeholder="请输入问题"></el-input>
      </el-form-item>
      <el-form-item label="回答" prop="answer">
        <el-input v-model="faqInfo.answer" type="textarea" autosize clearable placeholder="请输入回答"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addFaq" :loading="loading">添加</el-button>
        <el-button @click="$refs.faqInfoForm.resetFields()">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'faq_add',
  data() {
    return {
      // 问答信息
      faqInfo: {
        questionType: '',
        question: '',
        answer: ''
      },
      rules: {
        questionType: [
          { required: true, message: '问题类型不能为空', trigger: 'blur' }
        ],
        question: [
          { required: true, message: '问题不能为空', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    addFaq() {
      this.$refs.faqInfoForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$request('post', 'help/add', this.faqInfo).then(res => {
            this.$refs.faqInfoForm.resetFields()
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
