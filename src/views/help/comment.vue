<template>
  <div>
    <el-table
      :data="commentList"
      border
      style="width: 100%">
      <el-table-column
        prop="doctorId"
        fixed
        label="医生id"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userId"
        label="患者id"
        align="center">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        align="center">
      </el-table-column>
      <el-table-column
        prop="content"
        label="评论内容"
        align="center">
      </el-table-column>
      <el-table-column
        prop="answer"
        label="回复内容"
        align="center">
      </el-table-column>
      <el-table-column
        prop="ctime"
        label="评论时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="atime"
        label="回复时间"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click.stop="updateCommentInfo(scope.row)">回复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="回复" :visible.sync="updateDialogVisible" :close-on-click-modal="false" @close="resetCommentInfo">
      <el-form :model="commentInfo" :rules="rules" ref="commentInfoForm" label-width="130px" label-position="left">
        <el-form-item label="回复" prop="answer">
          <el-input v-model="commentInfo.answer" type="textarea" autosize clearable placeholder="请输入回复内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetCommentInfo">取 消</el-button>
        <el-button type="primary" @click="submitCommentInfo">回 复</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'comment',
  data() {
    return {
      commentList: [],
      commentInfo: {},
      updateDialogVisible: false,
      rules: {}
    }
  },
  mounted() {
    this.getCommentList()
  },
  methods: {
    getCommentList() {
      this.$request('get', 'comment/list').then(res => {
        this.commentList = res.data.data
      })
    },
    updateCommentInfo(commentInfo) {
      this.commentInfo = JSON.parse(JSON.stringify(commentInfo))
      this.updateDialogVisible = true
    },
    submitCommentInfo() {
      this.$refs.commentInfoForm.validate((valid) => {
        if (valid) {
          this.$request('put', 'comment/update', this.commentInfo).then(res => {
            this.getCommentList()
            this.resetCommentInfo()
          })
        }
      });
    },
    resetCommentInfo() {
      this.updateDialogVisible = false
      this.$refs.commentInfoForm.resetFields()
    }
  }
}
</script>

<style>

</style>