import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "../views/layout/Layout";
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
const asyncRouterMap = [
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
    meta: { title: "医生管理", icon: "example", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] },
    redirect: "/doctor/list",
    children: [
      {
        path: "list",
        name: "医生列表",
        component: () => import("@/views/doctor/list.vue"),
        meta: { title: "医生列表", icon: "tree", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] }
      },
      {
        path: "add",
        name: "添加医生",
        component: () => import("@/views/doctor/add.vue"),
        meta: { title: "添加医生", icon: "tree", roles: ['ADMIN', 'DIRECTOR', 'CHIEF'] }
      }
    ]
  },
  {
    path: "/hospital",
    component: Layout,
    name: "医院管理",
    meta: { title: "医院管理", icon: "example", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] },
    redirect: "/hospital/list",
    children: [
      {
        path: "list",
        name: "医院列表",
        component: () => import("@/views/hospital/list.vue"),
        meta: { title: "医院列表", icon: "tree", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] }
      },
      {
        path: "add",
        name: "添加医院",
        component: () => import("@/views/hospital/add.vue"),
        meta: { title: "添加医院", icon: "tree", roles: ['ADMIN'] }
      }
    ]
  },
  {
    path: "/office",
    component: Layout,
    name: "科室管理",
    meta: { title: "科室管理", icon: "example", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] },
    redirect: "/office/list",
    children: [
      {
        path: "list",
        name: "科室列表",
        component: () => import("@/views/office/list.vue"),
        meta: { title: "科室列表", icon: "tree", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] }
      },
      {
        path: "add",
        name: "添加科室",
        component: () => import("@/views/office/add.vue"),
        meta: { title: "添加科室", icon: "tree", roles: ['ADMIN', 'DIRECTOR'] }
      }
    ]
  },
  {
    path: "/order",
    component: Layout,
    name: "订单管理",
    meta: { title: "订单管理", icon: "example", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] },
    redirect: "/order/list",
    children: [
      {
        path: "list",
        name: "订单列表",
        component: () => import("@/views/order/list.vue"),
        meta: { title: "订单列表", icon: "tree", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] }
      },
      {
        path: "add",
        name: "添加订单",
        component: () => import("@/views/order/add.vue"),
        meta: { title: "添加订单", icon: "tree", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] }
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
        meta: { title: "反馈", icon: "tree", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] }
      },
      {
        path: "comment",
        name: "评论",
        component: () => import("@/views/help/comment.vue"),
        meta: { title: "评论", icon: "tree", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] }
      },
      {
        path: "faq_list",
        name: "问答",
        component: () => import("@/views/help/faq_list.vue"),
        meta: { title: "问答", icon: "tree", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] }
      },
      {
        path: "faq_add",
        name: "添加问答",
        component: () => import("@/views/help/faq_add.vue"),
        meta: { title: "添加问答", icon: "tree", roles: ['ADMIN'] }
      }
    ]
  },
  {
    path: "/notice",
    component: Layout,
    name: "公告管理",
    meta: { title: "公告管理", icon: "example", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] },
    redirect: "/notice/list",
    children: [
      {
        path: "list",
        name: "公告列表",
        component: () => import("@/views/notice/list.vue"),
        meta: { title: "公告列表", icon: "tree", roles: ['ADMIN', 'DIRECTOR', 'CHIEF', 'DOCTOR'] }
      },
      {
        path: "add",
        name: "添加公告",
        component: () => import("@/views/notice/add.vue"),
        meta: { title: "添加公告", icon: "tree", roles: ['ADMIN', 'DIRECTOR'] }
      }
    ]
  }
];

const role = localStorage.role ? localStorage.role : ''
function generateRoutes(routes) {
  const accessRoutes = []
  routes.forEach(route => {
    const temp = {...route}
    if (!temp.meta || !temp.meta.roles) {
      accessRoutes.push(temp)
    }
    if (temp.meta && temp.meta.roles && temp.meta.roles.length && temp.meta.roles.includes(role)) {
      if (temp.children && temp.children.length) {
        temp.children = generateRoutes(temp.children)
        accessRoutes.push(temp)
      }
      if (!temp.children) {
        accessRoutes.push(temp)
      }
    }
  });
  return accessRoutes
}
export const constantRouterMap = generateRoutes(asyncRouterMap)

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export default router
