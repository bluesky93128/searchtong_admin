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
          { path: 'faq', component: () => import(/* webpackChunkName: "piaf" */ './views/app/app_manage/faq') },
          { path: 'inquery', component: () => import(/* webpackChunkName: "piaf" */ './views/app/app_manage/inquery') },
        ]
      },

      {
        path: "user_manage",
        component: () =>
          import(/* webpackChunkName: "single" */ "./views/app/user_manage")
      },
      {
        path: "privacy_policy",
        component: () =>
          import(/* webpackChunkName: "single" */ "./views/app/privacy_policy")
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
  }
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history"
});

export default router;
