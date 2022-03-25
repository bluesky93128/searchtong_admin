import Vue from "vue";
import VueRouter from "vue-router";
import AuthRequired from "./utils/AuthRequired";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "home" */ "./views/home"),
    redirect: "/app/research",
    beforeEnter: AuthRequired
  },
  {
    path: "/app",
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
    redirect: "/app/research",
    beforeEnter: AuthRequired,
    children: [
      {
        path: "research",
        component: () =>
          import(/* webpackChunkName: "piaf" */ "./views/app/research"),
        redirect: "/app/research/manage",
        children: [
          { path: 'register', component: () => import(/* webpackChunkName: "piaf" */ './views/app/research/register') },
          { path: 'manage', component: () => import(/* webpackChunkName: "piaf" */ './views/app/research/manage') },
          { path: 'analyze', component: () => import(/* webpackChunkName: "piaf" */ './views/app/research/analyze') },
          { path: 'analyze_detail', component: () => import(/* webpackChunkName: "research" */ './views/app/research/analyze/analyze_detail') },
          { path: 'templist', component: () => import(/* webpackChunkName: "piaf" */ './views/app/research/templist') },
        ]
      },
      {
        path: "coin_manage",
        component: () =>
          import(/* webpackChunkName: "second-menu" */ "./views/app/coin_manage"),
        redirect: "/app/coin_manage/calculation",
        children: [
          { path: 'calculation', component: () => import(/* webpackChunkName: "piaf" */ './views/app/coin_manage/calculation') },
          { path: 'detail', component: () => import(/* webpackChunkName: "piaf" */ './views/app/coin_manage/calculation/detail') },
          { path: 'transaction', component: () => import(/* webpackChunkName: "piaf" */ './views/app/coin_manage/transaction') },
        ]
      },
      {
        path: "app_manage",
        component: () =>
          import(/* webpackChunkName: "second-menu" */ "./views/app/app_manage"),
        redirect: "/app/app_manage/notice",
        children: [
          { path: 'notice', component: () => import(/* webpackChunkName: "piaf" */ './views/app/app_manage/notice') },
          { path: 'notices_new', component: () => import(/* webpackChunkName: "app_manage" */ "./views/app/app_manage/notice/notices_new") },
          { path: 'notices_edit', component: () => import(/* webpackChunkName: "app_manage" */ "./views/app/app_manage/notice/notices_edit") },
          { path: 'faq', component: () => import(/* webpackChunkName: "piaf" */ './views/app/app_manage/faq') },
          { path: 'faq_new', component: () => import(/* webpackChunkName: "app_management" */ "./views/app/app_manage/faq/faq_new") },
          { path: 'faq_edit', component: () => import(/* webpackChunkName: "app_management" */ "./views/app/app_manage/faq/faq_edit") },
          { path: 'inquery', component: () => import(/* webpackChunkName: "piaf" */ './views/app/app_manage/inquery') },
          { path: 'inquery_edit', component: () => import(/* webpackChunkName: "app_management" */ "./views/app/app_manage/inquery/inquery_edit") },
        ]
      },

      {
        path: "user_manage",
        component: () =>
          import(/* webpackChunkName: "user_manage" */ "./views/app/user_manage"),
        redirect: "/app/user_manage/list",
        children: [
          { path: 'list', component: () => import(/* webpackChunkName: "user_manage" */ './views/app/user_manage/list') },
          { path: 'detail', component: () => import(/* webpackChunkName: "user_manage" */ './views/app/user_manage/detail') },
        ]
      },
      {
        path: "terms_of_service",
        component: () =>
          import(/* webpackChunkName: "single" */ "./views/app/terms_of_service"),
        redirect: "/app/terms_of_service/privacy_policy",
        children: [
          {
            path: 'privacy_policy',
            component: () => import(/* webpackChunkName: "terms_of_service" */ './views/app/terms_of_service/privacy_policy'),
          },
          {
            path: 'terms_of_service',
            component: () => import(/* webpackChunkName: "terms_of_service" */ './views/app/terms_of_service/terms_of_service')
          },
          {
            path: 'online_policy',
            component: () => import(/* webpackChunkName: "terms_of_service" */ './views/app/terms_of_service/online_policy')
          },
          {
            path: 'youth_policy',
            component: () => import(/* webpackChunkName: "terms_of_service" */ './views/app/terms_of_service/youth_policy')
          },
          {
            path: 'oneid_policy',
            component: () => import(/* webpackChunkName: "terms_of_service" */ './views/app/terms_of_service/oneid_policy')
          }
        ]
      }
    ]
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  },
  {
    path: "/user",
    component: () => import(/* webpackChunkName: "user" */ "./views/user"),
    redirect: "/user/login",
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Login")
      },
      {
        path: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Register")
      },
      {
        path: "forgot-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ForgotPassword")
      },
      {
        path: "reset-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ResetPassword")
      },

    ]
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  },
  {
    path: "/privacy-policy",
    component: () => import(/* webpackChunkName: "privacy-policy" */ "./views/PrivacyPolicy")
  }
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history"
});

export default router;
