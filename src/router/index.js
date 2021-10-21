import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "../views/layout/Layout";
import store from "../store";
import axios from 'axios'
// import { Notification } from 'element-ui';
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  { path: "/404", component: () => import("@/views/404"), hidden: true },
  {
    path: "/",
    component: Layout,
    redirect: "/doctor/list",
    hidden: true
  },
  {
    path: "/doctor",
    component: Layout,
    name: "医生管理",
    meta: { title: "医生管理", icon: "example" },
    redirect: "/doctor/list",
    children: [
      {
        path: "list",
        name: "医生列表",
        component: () => import("@/views/doctor/list.vue"),
        meta: { title: "医生列表", icon: "tree" }
      },
      {
        path: "add",
        name: "添加医生",
        component: () => import("@/views/doctor/add.vue"),
        meta: { title: "添加医生", icon: "tree" }
      }
    ]
  },
  {
    path: "/hospital",
    component: Layout,
    name: "医院管理",
    meta: { title: "医院管理", icon: "example" },
    redirect: "/hospital/list",
    children: [
      {
        path: "list",
        name: "医院列表",
        component: () => import("@/views/hospital/list.vue"),
        meta: { title: "医院列表", icon: "tree" }
      },
      {
        path: "add",
        name: "添加医院",
        component: () => import("@/views/hospital/add.vue"),
        meta: { title: "添加医院", icon: "tree" }
      }
    ]
  },
  {
    path: "/office",
    component: Layout,
    name: "科室管理",
    meta: { title: "科室管理", icon: "example" },
    redirect: "/office/list",
    children: [
      {
        path: "list",
        name: "科室列表",
        component: () => import("@/views/office/list.vue"),
        meta: { title: "科室列表", icon: "tree" }
      },
      {
        path: "add",
        name: "添加科室",
        component: () => import("@/views/office/add.vue"),
        meta: { title: "添加科室", icon: "tree" }
      }
    ]
  },
  {
    path: "/order",
    component: Layout,
    name: "订单管理",
    meta: { title: "订单管理", icon: "example" },
    redirect: "/order/list",
    children: [
      {
        path: "list",
        name: "订单列表",
        component: () => import("@/views/order/list.vue"),
        meta: { title: "订单列表", icon: "tree" }
      },
      {
        path: "add",
        name: "添加订单",
        component: () => import("@/views/order/add.vue"),
        meta: { title: "添加订单", icon: "tree" }
      }
    ]
  },
  {
    path: "/help",
    component: Layout,
    name: "反馈与问答",
    meta: { title: "反馈与问答", icon: "example" },
    redirect: "/help/feed_back",
    children: [
      {
        path: "feed_back",
        name: "反馈",
        component: () => import("@/views/help/feed_back.vue"),
        meta: { title: "反馈", icon: "tree" }
      },
      {
        path: "faq_list",
        name: "问答",
        component: () => import("@/views/help/faq_list.vue"),
        meta: { title: "问答", icon: "tree" }
      },
      {
        path: "faq_add",
        name: "添加问答",
        component: () => import("@/views/help/faq_add.vue"),
        meta: { title: "添加问答", icon: "tree" }
      }
    ]
  },
  {
    path: "/notice",
    component: Layout,
    name: "公告管理",
    meta: { title: "公告管理", icon: "example" },
    redirect: "/notice/list",
    children: [
      {
        path: "list",
        name: "公告列表",
        component: () => import("@/views/notice/list.vue"),
        meta: { title: "公告列表", icon: "tree" }
      },
      {
        path: "add",
        name: "添加公告",
        component: () => import("@/views/notice/add.vue"),
        meta: { title: "添加公告", icon: "tree" }
      }
    ]
  }
];

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export default router
