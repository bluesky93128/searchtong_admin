<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-row class="mb-4 align-items-center">
            <b-badge class="mb-1" variant="primary">{{
              typeOption[data.type]
            }}</b-badge>
            <span class="gray-text ml-2">설문지 ID: {{data._id}}</span>
          </b-row>
          <b-row class="mb-2">
            <h3 class="ml-4">{{data.title}}</h3>
          </b-row>
          <b-row>
            <b-col xxs="4">
              <span>시작: {{formatDateWithMin(data.startAt)}}</span>
            </b-col>
            <b-col xxs="4">
              <span>종료: {{formatDateWithMin(data.endAt)}}</span>
            </b-col>
            <b-col xxs="4">
              <span>응답자수: {{data.attendCount + '/' + (data.itemReward ? data.itemReward.paymentCount : '설정되지 않음')}}</span>
            </b-col>
            <b-col xxs="4">
              <!-- <span>{{data.itemReward ? '응답비용:' + data.responseCost + '/' +  (data.itemReward.paymentCount * data.itemReward.paymentAmount) : '설정되지 않음'}}</span> -->
              <span>응답비용: {{data.responseCost}}</span>
            </b-col>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xs="12">
        <b-button variant="outline-primary" class="mt-4 mb-2">EXCEL 저장</b-button>
        <div class="d-flex per-page-dropdown">
            <v-select :options="[10, 25, 50, 100]" v-model="perPage"></v-select>
            <span class="span-center-text ml-2 mr-4">개씩 보기</span>
          </div>
        <b-table
          ref="custom-table"
          class="vuetable"
          :current-page="currentPage"
          :fields="bootstrapTable.fields"
          :items="dataProvider"
          :per-page="perPage"
          @row-selected="rowSelected"
          selectable
          :select-mode="bootstrapTable.selectMode"
          selectedVariant="primary"
        >
          <template #cell(no)="{item, index}">
            {{index + 1}}
          </template>
          <template #cell(createdAt)="{item}">
            {{formatDateWithMin(item.createdAt)}}
          </template>
          <template #cell(sent)="{item}">
            {{item.coin}}
          </template>
          <template #cell(receivedStatus)="{item}">
            {{item.receivedStatus == 0 ? "성공" : "대기"}}
          </template>
        </b-table>
        <b-pagination
          size="sm"
          align="center"
          :total-rows="totalRows"
          :per-page="perPage"
          v-model="currentPage"
        >
          <template v-slot:next-text>
            <i class="simple-icon-arrow-right" />
          </template>
          <template v-slot:prev-text>
            <i class="simple-icon-arrow-left" />
          </template>
          <template v-slot:first-text>
            <i class="simple-icon-control-start" />
          </template>
          <template v-slot:last-text>
            <i class="simple-icon-control-end" />
          </template>
        </b-pagination>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { apiUrl } from "../../../../constants/config";
import axios from "axios";
import moment from "moment";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      typeOption: ["여론조사", "서베이", "광고"],
      isReport: false,
      disabledFrom: null,
      disabledTo: null,
      searchForm: {
        search_term: this.$t("search.all"),
        search_word: "",
        fromDate: new Date(),
        toDate: new Date(),
      },
      data: {
        type: 0,
        startAt: new Date(),
        endAt: new Date(),
        itemText: {},
        itemQuestion: [],
        itemFinish: {},
        itemResearcher: {},
        itemReward: {},
      },
      secretWords: "",
      user_data: {},
      sentPrice: 0,
      receivedPrice: 0,
      balance: 0,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      items: [],
      bootstrapTable: {
        selected: [],
        selectMode: "single",
        fields: [
          {
            key: "no",
            label: "번호",
            thClass: "bg-dark text-white",
          },
          {
            key: "createdAt",
            label: "발생일시",
            sortable: false,
            thClass: "bg-dark text-white",
          },
          {
            key: "userId",
            label: "회원ID",
            sortable: false,
            thClass: "bg-dark text-white",
          },
          {
            key: "user.decPhoneNum",
            label: "회원명",
            sortable: false,
            thClass: "bg-dark text-white",
          },
          {
            key: "sent",
            label: "보내기",
            sortable: false,
            tdClass: "w-10",
            thClass: "bg-dark text-white",
          },
          {
            key: "receivedStatus",
            label: "전송성공여부",
            sortable: false,
            tdClass: "w-10",
            thClass: "bg-dark text-white",
          },
          {
            key: "description",
            label: "상세내역",
            sortable: false,
            thClass: "bg-dark text-white",
          },
        ],
      },
    };
  },
  mounted() {
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

      fetch(apiUrl + "/research/analytics/" + this.id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log('analyticsData = ', result);
          this.analyticsData = result;
        })
        .catch((error) => console.log("error", error));
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD");
    },

    formatDateWithMin(date) {
      return moment(date).format("YYYY.MM.DD hh:mm");
    },

    dataProvider(ctx) {
      let user = JSON.parse(localStorage.getItem('user'));
      const params = this.apiParamsConverter(ctx);
      params.wallet_addr = user.wallet_addr;

      var config = {
        method: 'get',
        url: apiUrl + '/research/getTransactionDetails',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        params : {
        'page': params.page,
        'pagesize': params.per_page,
        'researchId': this.id
      }
      };

      let promise = axios(config);


      // let promise = axios.post(apiUrl + "/tongtongcoin/tx_list", params, {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token")
      //   }
      // });

      return promise
        .then((result) => result.data)
        .then((data) => {
          // console.log('list = ', data);
          this.currentPage = data.data.current_page;
          // this.perPage = data.per_page;
          this.totalRows = data.data.total;
          const items = data.data;
          this.sentPrice = data.totalAmountSent;
          return items;
        })
        .catch((_error) => {
          return [];
        });
    },

    apiParamsConverter(params) {
      let apiParams = {};
      if (params.perPage !== 0) {
        apiParams.per_page = params.perPage;
      }
      if (params.currentPage >= 1) {
        apiParams.page = params.currentPage;
      }
      if (params.sortBy && params.sortBy.length > 0) {
        apiParams.sort = `${params.sortBy}|${params.sortDesc ? "desc" : "asc"}`;
      }
      if (params.filter && params.filter.length > 0) {
        // Optional
      }
      return apiParams;
    },

    rowSelected(items) {
      this.bootstrapTable.selected = items;
    },

    addNotification(
      type = "success",
      title = "This is Notify Title",
      message = "This is Notify Message,<br>with html."
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false });
    },
  },
  computed: {
    editor () {
      return this.$refs.myTextEditor.quill
    }
  }
};
</script>
<style scoped>
.gray-text {
  color: #d7d7d7;
}
.button-container {
  display: flex;
  position: absolute;
  right: 20px;
  top: 5px;
  z-index: 100;
}
.table th,
.table td {
  /* border-color: #000000 !important; */
  border: 1px solid black !important;
  vertical-align: middle;
}
.bottom {border-bottom: 1px solid black;}
.sub-header {
  background-color: #8497b0 !important;
}
.main-header {
  background-color: #203864 !important;
}
.item-header {
  background-color: #bfbfbf !important;
}
.subitem-header {
  background-color: #e7e6e6 !important;
}
.question-container {
  width: 100%;
  border: 1px solid #a3a3a3;
}
.question-container .question-title {
  width: 100%;
  background-color: #d7d7d7;
  padding: 4px 8px;
}
.question-container .question-body {
  padding: 24px;
}
.count-bar {
  height: 10px;
  background-color: #203864;
}
.chart-container {
  height: 200px;
}
</style>