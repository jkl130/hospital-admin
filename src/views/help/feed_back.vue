<template>
  <div>
    <el-table
      :data="feedbackList"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        fixed
        label="id"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userId"
        label="用户id"
        align="center">
      </el-table-column>
      <el-table-column
        prop="content"
        label="内容"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'feed_back',
  data() {
    return {
      feedbackList: []
    }
  },
  mounted() {
    this.getFeedbackList()
  },
  methods: {
    getFeedbackList() {
      this.$request('get', 'help/listFd').then(res => {
        this.feedbackList = res.data.data
      })
    }
  }
}
</script>

<style>

</style>