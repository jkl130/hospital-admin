<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      :unique-opened="true"
      active-text-color="#409EFF"
    >
      <div v-if="routes.length>0">
        <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
      </div>
    </el-menu>
  </el-scrollbar>
</template>

<script type="es6">
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  data(){
    return{
      routes:[]
    }
  },
  created(){
    if(localStorage.token){
      this.getSiteList(this.$router.options.routes);
    }
  },
  methods:{
    getSiteList(routeList){
      this.routes = routeList
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
