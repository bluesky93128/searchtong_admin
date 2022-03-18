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
          <b-card-body class="wizard wizard-default" v-if="data">
            <form-wizard
              nav-class="justify-content-start"
              :save="onSubmitMain"
              :data="data"
              :currentActive="current_page"
              :key="key"
            >
              <tab name="1. 기본설정" :selected="true">
                <div class="wizard-basic-step">
                  <main-page :data="data" />
                </div>
              </tab>
              <tab name="2. 본문설정">
                <div class="wizard-basic-step">
                  <text-page :data="data" :gotoHome="gotoHome" />
                </div>
              </tab>
              <tab name="3. 문항설정">
                <div class="wizard-basic-step">
                  <questions-page :data="data" :gotoHome="gotoHome" />
                </div>
              </tab>
              <tab name="4. 종료글 설정">
                <div class="wizard-basic-step">
                  <finish-text-page :data="data" :gotoHome="gotoHome" />
                </div>
              </tab>
              <tab name="5. 조사대상 설정">
                <div class="wizard-basic-step">
                  <researcher-page :data="data" :gotoHome="gotoHome" />
                </div>
              </tab>
              <tab name="6. 리워드 및 등록">
                <div class="wizard-basic-step">
                  <reward-page :data="data" :gotoHome="gotoHome" />
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
import { apiUrl } from "../../../../constants/config";

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
      data: null,
      current_page: 0,
      key: 0
    };
  },
  mounted() {
    console.log(this.$route.query.id);
    this.id = this.$route.query.id;
    if(this.id) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(apiUrl + "/research/" + this.id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.data = result;
          this.data.itemText = this.data.itemText || {};
          this.data.itemQuestion = this.data.itemQuestion || {};
          this.data.itemFinish = this.data.itemFinish || {};
          this.data.itemResearcher = this.data.itemResearcher || {};
          this.data.itemReward = this.data.itemReward || {};
        })
        .catch((error) => console.log("error", error));
    } else {
      this.data = {
        type: 0,
        startAt: new Date(),
        endAt: new Date(),
        itemText: {},
        itemQuestion: [
          {
            // _id: Schema.Types.ObjectId
            order: 0, // 문항순서
            title: "", // 문항내용
            answerGuide: "", //
            type1: 0, // 문항유형1 (0: 객관식, 1: 주관식)
            type2: 0, // 문항유형2 (0: 단일응답, 1: 다중응답)
            min: 1, // 다중응답 - 최소선택개수
            max: 1, // 다중응답 - 최대선택개수
            viewType: 0, // 보기문항 (0: 텍스트, 1: 이미지)
            itemView: [
              // 보기문항내용
              {
                // _id: Schema.Types.ObjectId
                order: 0, // 순서
                content: "", // 본문
                nextItemQuestionOrder: 1, // 다음문항순서 (itemQuestion.order)
                imageLinks: [""], // 이메지링크목록
                isMain: true, // 기본물음인가? (true: 기본물음, false: 기타물음)
              },
            ],
            isRequireAnswer: true, // 필수답변?
            isRequireMix: false, // 보기섞기?
            isKeedExtraView: true, // 기타보기유지?
          },
        ],
        itemFinish: {},
        itemResearcher: {
          condition: 1,
          gender: 0,
          age: 0,
          region: 0,
          job: 0,
          education: 0,
          salary: 0,
          targetReplyCount: 0
        },
        itemReward: {
          paymentMethod: 0,
          paymentCount: 1,
          paymentAmount: 1
        },
        isDraft: true,
        isSetPeriodLater: true
      };
    }
  },
  methods: {
    onSubmitMain() {
      console.log(this.data);
      if (this.data._id) {
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer " + localStorage.getItem("token")
        );
        myHeaders.append("Content-Type", "application/json");

        let today = new Date();
        if(this.data.startAt > today) {
          if(this.data.isSetPeriodLater) {
            this.data.status = 2;
          } else {
            this.data.status = 1;
          }
        }

        var raw = JSON.stringify(this.data);

        var requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(apiUrl + "/research/" + this.data._id, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log(result)
            this.addNotification("success filled", "설문 저장", "저장 되었습니다");
          })
          .catch((error) => console.log("error", error));
      } else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append(
          "Authorization",
          "Bearer " + localStorage.getItem("token")
        );

        var raw = JSON.stringify(this.data);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(apiUrl + "/research", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            this.data = result;
            this.data.itemText = this.data.itemText || {};
            this.data.itemQuestion = this.data.itemQuestion || {};
            this.data.itemFinish = this.data.itemFinish || {};
            this.data.itemResearcher = this.data.itemResearcher || {};
            this.data.itemReward = this.data.itemReward || {};
            this.addNotification("success filled", "설문 저장", "저장 되었습니다");
          })
          .catch((error) => console.log("error", error));
      }
    },
    gotoHome() {
      this.current_page = 0;
      this.key++;
    },
    addNotification(
      type = "success",
      title = "This is Notify Title",
      message = "This is Notify Message,<br>with html."
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false });
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