<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <!-- <piaf-breadcrumb :heading="$t('menu.research.title')" /> -->
        <h2>{{ $t("menu.research.title") }}</h2>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-card-body class="wizard wizard-default">
            <form-wizard nav-class="justify-content-start"
              :save="onSubmitMain"
              topNavDisabled="true"
              :data="data"
            >
              <tab
                name="1. 기본설정"
                :selected="true"
              >
                <div class="wizard-basic-step">
                  <main-page :data="data" />
                </div>
              </tab>
              <tab name="2. 본문설정">
                <div class="wizard-basic-step">
                  <text-page :data="data" />
                </div>
              </tab>
              <tab name="3. 문항설정">
                <div class="wizard-basic-step">
                  <p>{{ $t("wizard.content-2") }}</p>
                </div>
              </tab>
              <tab name="4. 종료글 설정">
                <div class="wizard-basic-step">
                  <p>{{ $t("wizard.content-2") }}</p>
                </div>
              </tab>
              <tab name="5. 조사대상 설정">
                <div class="wizard-basic-step">
                  <p>{{ $t("wizard.content-2") }}</p>
                </div>
              </tab>
              <tab name="6. 리워드 및 등록">
                <div class="wizard-basic-step">
                  <p>{{ $t("wizard.content-2") }}</p>
                </div>
              </tab>
              <tab type="done">
                <div class="wizard-basic-step text-center">
                  <h2 class="mb-2">{{ $t("wizard.content-thanks") }}</h2>
                  <p>{{ $t("wizard.content-3") }}</p>
                </div>
              </tab>
            </form-wizard>
          </b-card-body>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import FormWizard from "../../../../components/Form/Wizard/FormWizard";
import Tab from "../../../../components/Form/Wizard/Tab";
import MainPage from "./main.vue";
import TextPage from "./text.vue";

export default {
  components: {
    "form-wizard": FormWizard,
    tab: Tab,
    "main-page": MainPage,
    "text-page": TextPage
  },
  data() {
    return {
      data: {
        type: "research",
        startAt: new Date(),
        endAt: new Date(),
        itemText: {}
      },
    };
  },
  methods: {
    onSubmitMain() {
      console.log(this.data);
    },
  },
  watch: {
    // data: {
    //   deep: true,
    //   handler(val, oldval) {
    //     if(val.main.title.length) {
    //       this.data.main.isDisabled = false;
    //     } else {
    //       this.data.main.isDisabled = true;
    //     }
    //     this.data = val;
    //   },
    // },
  },
};
</script>