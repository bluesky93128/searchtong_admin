
const data = [{
  id: "research",
  icon: "iconsminds-magnifi-glass",
  label: "menu.research.title",
  to: "/app/research",
  subs: [{
    icon: "simple-icon-paper-plane",
    label: "menu.research.register",
    to: "/app/research/register"
  },
  {
    icon: "simple-icon-paper-plane",
    label: "menu.research.manage",
    to: "/app/research/manage"
  },
  {
    icon: "simple-icon-paper-plane",
    label: "menu.research.analyze",
    to: "/app/research/analyze"
  },
  {
    icon: "simple-icon-paper-plane",
    label: "menu.research.templist",
    to: "/app/research/templist"
  },
  ]
},
{
  id: "coin_manage",
  icon: "iconsminds-coins",
  label: "menu.coin.title",
  to: "/app/second-menu",
  subs: [{
    icon: "simple-icon-paper-plane",
    label: "menu.coin.calculation",
    to: "/app/coin_manage/calculation"
  },
  {
    icon: "simple-icon-paper-plane",
    label: "menu.coin.transaction",
    to: "/app/coin_manage/transaction"
  },
  ]
},
{
  id: "app_manage",
  icon: "iconsminds-smartphone-4",
  label: "menu.app_manage.title",
  to: "/user/login",
  subs: [{
    icon: "simple-icon-paper-plane",
    label: "menu.app_manage.notice",
    to: "/app/app_manage/notice",
  }, {
    icon: "simple-icon-paper-plane",
    label: "menu.app_manage.faq",
    to: "/app/app_manage/faq"
  }, {
    icon: "simple-icon-paper-plane",
    label: "menu.app_manage.inquery",
    to: "/app/app_manage/inquery"
  }
  ]
},
{
  id: "user_manage",
  icon: "simple-icon-people",
  label: "menu.user_manage",
  to: "/app/user_manage"
},
{
  id: "terms_of_service",
  icon: "iconsminds-library",
  label: "menu.terms_of_service",
  to: "/app/terms_of_service",
  subs: [{
    icon: "simple-icon-doc",
    label: "menu.privacy_policy",
    to: "/app/terms_of_service/privacy_policy"
  }, {
    icon: "simple-icon-doc",
    label: "menu.terms_of_service",
    to: "/app/terms_of_service/terms_of_service"
  }, {
    icon: "simple-icon-doc",
    label: "menu.online_policy",
    to: "/app/terms_of_service/online_policy"
  }, {
    icon: "simple-icon-doc",
    label: "menu.youth_policy",
    to: "/app/terms_of_service/youth_policy"
  }, {
    icon: "simple-icon-doc",
    label: "menu.oneid_policy",
    to: "/app/terms_of_service/oneid_policy"
  }]
}
];
export default data;
