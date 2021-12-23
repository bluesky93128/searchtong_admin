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
                  <questions-page :data="data" />
                </div>
              </tab>
              <tab name="4. 종료글 설정">
                <div class="wizard-basic-step">
                  <finish-text-page :data="data" />
                </div>
              </tab>
              <tab name="5. 조사대상 설정">
                <div class="wizard-basic-step">
                  <researcher-page :data="data" />
                </div>
              </tab>
              <tab name="6. 리워드 및 등록">
                <div class="wizard-basic-step">
                  <reward-page :data="data" />
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
import QuestionsPage from "./questions.vue";
import FinishTextPage from "./finish_text.vue";
import ResearcherPage from "./researcher.vue";
import RewardPage from "./reward.vue";

export default {
  components: {
    "form-wizard": FormWizard,
    tab: Tab,
    "main-page": MainPage,
    "text-page": TextPage,
    "questions-page": QuestionsPage,
    "finish-text-page": FinishTextPage,
    "researcher-page": ResearcherPage,
    "reward-page": RewardPage,
  },
  data() {
    return {
      data: {
        type: "research",
        startAt: new Date(),
        endAt: new Date(),
        itemText: {},
        itemQuestion: [
          {
            // _id: Schema.Types.ObjectId
            order: 0,							// 문항순서				
            title: "String",							// 문항내용
            answerGuide: "String",				// 
            type1: 0,							// 문항유형1 (0: 객관식, 1: 주관식)
            type2: 0,							// 문항유형2 (0: 단일응답, 1: 다중응답)
            min: 1,								// 다중응답 - 최소선택개수
            max: 1,								// 다중응답 - 최대선택개수
            viewType: 0,						// 보기문항 (0: 텍스트, 1: 이미지)
            itemView: [														// 보기문항내용
              {
                // _id: Schema.Types.ObjectId
                order: 0,										// 순서
                content: "String",									// 본문
                nextItemQuestionOrder: 1,		// 다음문항순서 (itemQuestion.order)
                imageLinks: ["String"],							// 이메지링크목록
                isMain: true,									// 기본물음인가? (true: 기본물음, false: 기타물음)
              }
            ],
            isRequireAnswer: true,							// 필수답변?
            isRequireMix: false,								// 보기섞기?
            isKeedExtraView: true,							// 기타보기유지?

          },
          {
            // _id: Schema.Types.ObjectId
            order: 1,							// 문항순서				
            title: "String1",							// 문항내용
            answerGuide: "String",				// 
            type1: 0,							// 문항유형1 (0: 객관식, 1: 주관식)
            type2: 0,							// 문항유형2 (0: 단일응답, 1: 다중응답)
            min: 1,								// 다중응답 - 최소선택개수
            max: 1,								// 다중응답 - 최대선택개수
            viewType: 0,						// 보기문항 (0: 텍스트, 1: 이미지)
            itemView: [														// 보기문항내용
              {
                // _id: Schema.Types.ObjectId
                order: 0,										// 순서
                content: "String",									// 본문
                nextItemQuestionOrder: 1,		// 다음문항순서 (itemQuestion.order)
                imageLinks: ["String"],							// 이메지링크목록
                isMain: true,									// 기본물음인가? (true: 기본물음, false: 기타물음)
              }
            ],
            isRequireAnswer: true,							// 필수답변?
            isRequireMix: false,								// 보기섞기?
            isKeedExtraView: true,							// 기타보기유지?

          }
        ],
        itemFinish: {},
        itemResearcher: {},
        itemReward: {}
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