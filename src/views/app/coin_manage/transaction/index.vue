<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <div class="rounded">
          <b-card>
            <div class="d-flex justify-content-between align-items-center">
              <span class="card-text font-weight-semibold"
                >보유중인 통통코인: {{ balance }} TTC</span
              >
              <div class="d-flex">
                <span class="card-text font-weight-semibold ml-4"
                  >통통지갑: {{ user_data.wallet_addr }}</span
                >
                <b-button
                  variant="primary"
                  class="w-30"
                  style="height: 35px"
                  v-b-modal.restoreModal
                  >{{ $t("tongtongcoin.restore") }}</b-button
                >
              </div>
            </div>
          </b-card>
        </div>
      </b-colxx>
      <b-modal id="restoreModal" ref="restoreModal" title="통통지갑 연동">
        <label class="text-center w-100">보안키 확인</label>
        <label class="text-center w-100">통통지갑이 제공했던 보안키를 순번에 맞게 입력하세요.</label>
        <b-row class="region-content">
          <b-col colxx="12" class="list-container py-2">
            <b-form-textarea v-model="secretWords" />
          </b-col>
        </b-row>
        <template slot="modal-footer">
          <b-button variant="primary" @click="onRestore()">복구하기</b-button>
        </template>
      </b-modal>
    </b-row>
    <b-row class="mt-3">
      <b-colxx xxs="12">
        <h2>통통코인</h2>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="8">
        <b-table-simple>
          <b-thead>
            <b-tr>
              <b-th variant="secondary">총잔고</b-th>
              <b-th variant="secondary">보내기</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr>
              <b-td>{{balance}}</b-td>
              <b-td>{{sentPrice}}</b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-colxx>
      <b-colxx xs="12">
        <b-card class="">
          <b-form @submit.prevent="onHorizontalSubmit">
            <b-form-group
              label-cols="1"
              content-cols="4"
              horizontal
              :label="$t('search.search')"
            >
              <b-input-group class="mb-2 pl-0">
                <b-input-group-prepend>
                  <b-dropdown
                    :text="searchForm.search_term"
                    variant="outline-secondary"
                  >
                    <b-dropdown-item @click="onClickOptions('전체')">전체</b-dropdown-item>
                    <b-dropdown-item @click="onClickOptions('이름')">이름</b-dropdown-item>
                    <b-dropdown-item @click="onClickOptions('아이디')">아이디</b-dropdown-item>
                  </b-dropdown>
                </b-input-group-prepend>
                <b-form-input v-model="searchForm.search_word" />
              </b-input-group>
            </b-form-group>
            <b-form-group label-cols="1" horizontal label="신청일자">
              <b-row>
                <b-colxx xxs="6">
                  <div class="d-flex">
                    <b-datepicker
                      locale="ko-KR"
                      v-model="searchForm.fromDate"
                      :placeholder="$t('search.all')"
                      :max="disabledFrom"
                    />
                    <span class="span-center-text mx-2">~</span>
                    <b-datepicker
                      locale="ko-KR"
                      v-model="searchForm.toDate"
                      :placeholder="$t('search.all')"
                      :min="disabledTo"
                    />
                  </div>
                </b-colxx>
                <b-colxx xxs="5" class="d-flex">
                  <b-input-group class="mb-2">
                    <b-input-group-prepend>
                      <b-button
                        size="sm"
                        class="search-days"
                        variant="outline-secondary"
                        @click="onToday"
                        >{{ $t("search.today") }}</b-button
                      >
                      <b-button
                        size="sm"
                        class="search-days"
                        variant="outline-secondary"
                        @click="onWeek"
                        >{{ $t("search.week") }}</b-button
                      >
                      <b-button
                        size="sm"
                        class="search-days"
                        variant="outline-secondary"
                        @click="onMonth"
                        >{{ $t("search.month") }}</b-button
                      >
                      <b-button
                        size="sm"
                        class="search-days"
                        variant="outline-secondary"
                        @click="onHalfYear"
                        >{{ $t("search.halfyear") }}</b-button
                      >
                    </b-input-group-prepend>
                    <b-input-group-append>
                      <b-button
                        size="sm"
                        class="search-days"
                        variant="outline-secondary"
                        style="border-left: none"
                        @click="onTotal"
                        >{{ $t("search.all") }}</b-button
                      >
                    </b-input-group-append>
                  </b-input-group>
                  <b-button
                    type="submit"
                    variant="primary"
                    class="w-30"
                    style="height: 35px"
                    >{{ $t("search.submit") }}</b-button
                  >
                </b-colxx>
              </b-row>
            </b-form-group>
          </b-form>
        </b-card>
      </b-colxx>
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
            {{formatDate(item.createdAt)}}
          </template>
          <template #cell(sent)="{item}">
            {{item.coin}}
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
import Datepicker from "vuejs-datepicker";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { en, ko } from "vuejs-datepicker/dist/locale";
import qs from 'qs';

export default {
  components: {
    datepicker: Datepicker,
    "v-select": vSelect,
  },
  data() {
    return {
      en: en,
      ko: ko,
      disabledFrom: null,
      disabledTo: null,
      searchForm: {
        search_term: this.$t("search.all"),
        search_word: "",
        fromDate: new Date(),
        toDate: new Date(),
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
            sortable: true,
            thClass: "bg-dark text-white",
          },
          {
            key: "user.decPhoneNum",
            label: "회원ID",
            sortable: false,
            thClass: "bg-dark text-white",
          },
          {
            key: "user.nickname",
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
    // this.getList();
    this.getCoinBallance();
    this.user_data = JSON.parse(localStorage.getItem('user'))
  },
  methods: {
    onClickOptions(option) {
      this.searchForm.search_term = option;
    },
    onToday() {
      this.searchForm.fromDate = new Date();
      this.searchForm.toDate = "";
    },
    onWeek() {
      var d = new Date();
      d.setDate(d.getDate() - 7);
      this.searchForm.fromDate = d;
      this.searchForm.toDate = "";
    },
    onMonth() {
      var d = new Date();
      d.setMonth(d.getMonth() - 1);
      this.searchForm.fromDate = d;
      this.searchForm.toDate = "";
    },
    onHalfYear() {
      var d = new Date();
      d.setMonth(d.getMonth() - 6);
      this.searchForm.fromDate = d;
      this.searchForm.toDate = "";
    },
    onTotal() {
      this.searchForm.fromDate = "";
      this.searchForm.toDate = "";
    },
    rowSelected(items) {
      this.bootstrapTable.selected = items;
    },
    formatDateFromTimestamp(ts) {
      let date = new Date(ts);
      // console.log(date);
      return moment(date).format("YYYY.MM.DD. hh:mm");
    },
    calcSentPrice(item) {
      let user = JSON.parse(localStorage.getItem('user'));
      if(item.from_addr == user.wallet_addr) {
        return item.amount;
      } else {
        return "";
      }
    },
    calcReceivedPrice(item) {
      let user = JSON.parse(localStorage.getItem('user'));
      if(item.to_addr == user.wallet_addr) {
        return item.amount;
      } else {
        return "";
      }
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
        'wallet_addr': user.wallet_addr,
        'page': params.page,
        'pagesize': params.per_page 
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
          this.currentPage = data.current_page;
          // this.perPage = data.per_page;
          this.totalRows = data.total;
          const items = data.data;
          this.sentPrice = data.totalAmountSent;
          return items;
        })
        .catch((_error) => {
          return [];
        });
    },
    getList() {
      // const params = this.apiParamsConverter(ctx);
      let promise = axios.get(
        apiUrl + "/tongtongcoin/tx_list",
        {
          // params: params,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      return promise
        .then((result) => result.data)
        .then((data) => {
          this.totalRows = data.total;
          this.items = data.data;
          var sent = 0;
          var received = 0;
          this.items.forEach(item => {
            sent += item.refund_amount || 0;
            received += item.total_price || 0;
          })
          this.sentPrice = sent;
          this.receivedPrice = received;
        })
        .catch((_error) => {
          return [];
        });
    },
    getCoinBallance() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      let user = JSON.parse(localStorage.getItem('user'));
      console.log('userdata = ', user);

      var urlencoded = new URLSearchParams();
      urlencoded.append("phonenum", "01012347788");
      urlencoded.append("wallet_name", user.wallet_addr);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      fetch(apiUrl + "/tongtongcoin/wallet_account_balance/", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          this.balance = result.data.balance;
        })
        .catch(error => console.log('error', error));
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
        // apiParams.sort = `${params.sortBy}|${params.sortDesc ? "desc" : "asc"}`;
        apiParams.sortField = params.sortBy;
        apiParams.sortType = params.sortDesc ? 1 : -1;
      }
      if (params.filter && params.filter.length > 0) {
        // Optional
      }
      return apiParams;
    },
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD.");
    },
    onRestore() {
      this.hideModal('restoreModal');
      let tmp = this.secretWords.replace(/(?:\r\n|\r|\n)/g, ' ').replace(/ +/g, ' ').split(" ");
      console.log(tmp);
    },
    hideModal(refname) {
      this.$refs[refname].hide();
      console.log("hide modal:: " + refname);

      if (refname === "modalnestedinline") {
        this.$refs["modalnested"].show();
      }
    },
  },
  watch: {
    searchForm: {
      deep: true,
      handler(val, oldval) {
        this.disabledTo = val.fromDate;
        this.disabledFrom = val.toDate;
      },
    },
  },
};
</script>

<style scoped>
.table th,
.table td {
  border: 1px solid black !important;
  vertical-align: middle;
}
.table td {
  min-width: 80px;
}
</style>