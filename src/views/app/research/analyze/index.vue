<template>
  <div>
    <div class="loader-container" v-show="isLoading">
      <div class="loader"></div>
    </div>
    <b-row>
      <b-colxx xxs="12">
        <h2>통계관리</h2>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-row>
            <b-colxx xxs="6">
              <b-form-group label="설문제목 또는 ID" :label-cols="2">
                <b-form-input v-model="searchForm.search_word" />
              </b-form-group>
            </b-colxx>
            <b-colxx xxs="6">
              <b-form-group label="등록일" :label-cols="2">
                <div class="d-flex">
                  <b-datepicker
                    locale="ko-KR"
                    v-model="searchForm.periodFrom"
                    :placeholder="$t('search.all')"
                    :max="disabledFrom"
                  />
                  <span class="span-center-text mx-2">~</span>
                  <b-datepicker
                    locale="ko-KR"
                    v-model="searchForm.periodTo"
                    :placeholder="$t('search.all')"
                    :min="disabledTo"
                  />
                </div>
              </b-form-group>
            </b-colxx>
          </b-row>
          <b-row>
            <b-colxx xxs="6">
              <b-form-group label="진행기간" :label-cols="2">
                <div class="d-flex">
                  <b-datepicker
                    locale="ko-KR"
                    v-model="searchForm.registerFrom"
                    :placeholder="$t('search.all')"
                    :max="disabledFrom"
                  />
                  <span class="span-center-text mx-2">~</span>
                  <b-datepicker
                    locale="ko-KR"
                    v-model="searchForm.registerTo"
                    :placeholder="$t('search.all')"
                    :min="disabledTo"
                  />
                </div>
              </b-form-group>
            </b-colxx>
            <b-colxx xxs="6">
              <b-form-group label="설문유형" :label-cols="2">
                <div class="d-flex justify-content-between">
                  <v-select
                    v-model="searchForm.type"
                    :options="type_options"
                    placeholder="전체"
                    :reduce="(item) => item.value"
                    class="research-type"
                  />
                  <b-button class="primary" @click="onClickSearch()">검색</b-button>
                </div>
              </b-form-group>
            </b-colxx>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mt-4">
          <div class="d-flex per-page-container">
            <v-select :options="[5, 10, 25, 50, 100]" v-model="perPage"></v-select>
            <span class="span-center-text ml-2 mr-4">개씩 보기</span>
          </div>
          <b-tabs>
            <b-tab :title="'전체('+totalRows+')'">
              <b-table
                ref="custom-table"
                class="vuetable"
                :current-page="currentPage"
                :per-page="perPage"
                :fields="bootstrapTable.fields"
                :items="dataProvider"
                selectable
                select-mode="single"
                :key="tableKey"
                :filter="filter"
              >
                <template #cell(status)="{ item }">
                  <div class="d-flex justify-content-center align-items-center">
                    <div :class="getStatus(item.status)"></div>
                    <span class="ml-2">{{status_options[item.status].label}}</span>
                  </div>
                </template>
                <template #cell(createdAt)="{ item }">
                  {{ formatDateWithMin(item.createdAt) }}
                </template>
                <template #cell(duration)="{ item }">
                  {{ item.isSetPeriodLater ? "설정되지 않음" : (formatDateWithMin(item.startAt) + ' ~ ' + formatDateWithMin(item.endAt)) }}
                </template>
                <template #cell(type)="{ item }">
                  {{ type_options[item.type].label }}
                </template>
                <template #cell(action)="{ item }">
                  <router-link :to="{ path: 'analyze_detail', query: { id: item._id } }" class="text-link">
                    보기
                  </router-link>
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
            </b-tab>
            <b-tab :title="'진행중('+totalWorkingRows+')'">
              <b-table
                ref="custom-table"
                class="vuetable"
                :current-page="currentWorkingPage"
                :per-page="perPage"
                :fields="bootstrapTable.fields"
                :items="dataProviderWorking"
                selectable
                select-mode="single"
                :key="tableKey"
                :filter="filter"
              >
                <template #cell(status)="{ item }">
                  <div class="d-flex justify-content-center align-items-center">
                    <div :class="getStatus(item.status)"></div>
                    <span class="ml-2">{{status_options[item.status].label}}</span>
                  </div>
                </template>
                <template #cell(createdAt)="{ item }">
                  {{ formatDateWithMin(item.createdAt) }}
                </template>
                <template #cell(duration)="{ item }">
                  {{ item.isSetPeriodLater ? "설정되지 않음" : (formatDateWithMin(item.startAt) + ' ~ ' + formatDateWithMin(item.endAt)) }}
                </template>
                <template #cell(type)="{ item }">
                  {{ type_options[item.type].label }}
                </template>
                <template #cell(action)="{ item }">
                  <router-link :to="{ path: 'analyze_detail', query: { id: item._id } }" class="text-link">
                    보기
                  </router-link>
                </template>
              </b-table>
              <b-pagination
                size="sm"
                align="center"
                :total-rows="totalWorkingRows"
                :per-page="perPage"
                v-model="currentWorkingPage"
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
            </b-tab>
            <b-tab :title="'중지('+totalStoppedRows+')'">
              <b-table
                ref="custom-table"
                class="vuetable"
                :current-page="currentStoppedPage"
                :per-page="perPage"
                :fields="bootstrapTable.fields"
                :items="dataProviderStopped"
                selectable
                select-mode="single"
                :key="tableKey"
                :filter="filter"
              >
                <template #cell(status)="{ item }">
                  <div class="d-flex justify-content-center align-items-center">
                    <div :class="getStatus(item.status)"></div>
                    <span class="ml-2">{{status_options[item.status].label}}</span>
                  </div>
                </template>
                <template #cell(createdAt)="{ item }">
                  {{ formatDateWithMin(item.createdAt) }}
                </template>
                <template #cell(duration)="{ item }">
                  {{ item.isSetPeriodLater ? "설정되지 않음" : (formatDateWithMin(item.startAt) + ' ~ ' + formatDateWithMin(item.endAt)) }}
                </template>
                <template #cell(type)="{ item }">
                  {{ type_options[item.type].label }}
                </template>
                <template #cell(action)="{ item }">
                  <router-link :to="{ path: 'analyze_detail', query: { id: item._id } }" class="text-link">
                    보기
                  </router-link>
                </template>
              </b-table>
              <b-pagination
                size="sm"
                align="center"
                :total-rows="totalStoppedRows"
                :per-page="perPage"
                v-model="currentStoppedPage"
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
            </b-tab>
            <b-tab :title="'종료('+totalFinishedRows+')'">
              <b-table
                ref="custom-table"
                class="vuetable"
                :current-page="currentFinishedPage"
                :per-page="perPage"
                :fields="bootstrapTable.fields"
                :items="dataProviderFinished"
                selectable
                select-mode="single"
                :key="tableKey"
                :filter="filter"
              >
                <template #cell(status)="{ item }">
                  <div class="d-flex justify-content-center align-items-center">
                    <div :class="getStatus(item.status)"></div>
                    <span class="ml-2">{{status_options[item.status].label}}</span>
                  </div>
                </template>
                <template #cell(createdAt)="{ item }">
                  {{ formatDateWithMin(item.createdAt) }}
                </template>
                <template #cell(duration)="{ item }">
                  {{ item.isSetPeriodLater ? "설정되지 않음" : (formatDateWithMin(item.startAt) + ' ~ ' + formatDateWithMin(item.endAt)) }}
                </template>
                <template #cell(type)="{ item }">
                  {{ type_options[item.type].label }}
                </template>
                <template #cell(action)="{ item }">
                  <router-link :to="{ path: 'analyze_detail', query: { id: item._id } }" class="text-link">
                    보기
                  </router-link>
                </template>
              </b-table>
              <b-pagination
                size="sm"
                align="center"
                :total-rows="totalFinishedRows"
                :per-page="perPage"
                v-model="currentFinishedPage"
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
            </b-tab>
          </b-tabs>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { apiUrl } from '../../../../constants/config';
import moment from "moment";
import axios from "axios";

export default {
  components: {
    "v-select": vSelect,
  },
  mounted() {
    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    // myHeaders.append(
    //   "Authorization",
    //   "Bearer " + localStorage.getItem("token")
    // );
    // var requestOptions = {
    //   method: 'GET',
    //   headers: myHeaders,
    //   redirect: 'follow'
    // };

    // fetch(apiUrl + "/research", requestOptions)
    //   .then(response => response.json())
    //   .then(result => {
    //     console.log(result);
    //     this.items = result.data;
    //     this.totalRows = result.total;
    //   })
    //   .catch(error => console.log('error', error));
  },
  data() {
    return {
      isLoading: false,
      searchForm: {},
      filter: null,
      disabledTo: null,
      disabledFrom: null,
      tableKey: 0,
      currentPage: 0,
      currentWorkingPage: 0,
      currentStoppedPage: 0,
      currentFinishedPage: 0,
      perPage: 5,
      totalRows: 0,
      totalWorkingRows: 0,
      totalStoppedRows: 0,
      totalFinishedRows: 0,
      items: [],
      type_options: [
        {
          label: "전체",
          value: -1,
        },
        {
          label: "여론조사",
          value: 0,
        },
        {
          label: "서베이",
          value: 1,
        },
        {
          label: "광고",
          value: 2,
        },
      ],
      status_options: [
        { value: 0, label: "진행중" },
        { value: 1, label: "예약" },
        { value: 2, label: "대기" },
        { value: 3, label: "중지" },
        { value: 4, label: "종료" },
      ],
      bootstrapTable: {
        selected: [],
        fields: [
          {
            key: "status",
            label: "",
            sortable: false,
            thClass: "fix-width bg-dark text-white text-center w-10",
            tdClass: "list-item-heading fix-width text-center w-10",
          },
          {
            key: "_id",
            label: "ID",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "title",
            label: "제목",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "type",
            label: "설문유형",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "attendCount",
            label: "응답자수",
            sortable: true,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "createdAt",
            label: "등록일",
            sortable: true,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "duration",
            label: "진행기간",
            sortable: true,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "action",
            label: "통계",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
        ],
      },
    };
  },
  methods: {
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD");
    },
    formatDateWithMin(date) {
      return moment(date).format("YYYY.MM.DD hh:mm");
    },
    dataProvider(ctx) {
      this.isLoading = true;
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/research?isDraft=0&status=0,3,4", {
        params: params,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      return promise
        .then((result) => result.data)
        .then((data) => {
          this.currentPage = data.current_page;
          // this.perPage = data.per_page;
          this.totalRows = data.total;
          const items = data.data;
          this.isLoading = false;
          return items;
        })
        .catch((_error) => {
          this.isLoading = false;
          return [];
        });
    },
    dataProviderWorking(ctx) {
      this.isLoading = true;
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/research?isDraft=0&status=0", {
        params: params,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      return promise
        .then((result) => result.data)
        .then((data) => {
          this.currentWorkingPage = data.current_page;
          // this.perPage = data.per_page;
          this.totalWorkingRows = data.total;
          const items = data.data;
          this.isLoading = false;
          return items;
        })
        .catch((_error) => {
          this.isLoading = false;
          return [];
        });
    },
    dataProviderStopped(ctx) {
      this.isLoading = true;
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/research?isDraft=0&status=3", {
        params: params,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      return promise
        .then((result) => result.data)
        .then((data) => {
          this.currentStoppedPage = data.current_page;
          // this.perPage = data.per_page;
          this.totalStoppedRows = data.total;
          const items = data.data;
          this.isLoading = false;
          return items;
        })
        .catch((_error) => {
          this.isLoading = false;
          return [];
        });
    },
    dataProviderFinished(ctx) {
      this.isLoading = true;
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/research?isDraft=0&status=4", {
        params: params,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      return promise
        .then((result) => result.data)
        .then((data) => {
          this.currentFinishedPage = data.current_page;
          // this.perPage = data.per_page;
          this.totalFinishedRows = data.total;
          const items = data.data;
          this.isLoading = false;
          return items;
        })
        .catch((_error) => {
          this.isLoading = false;
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
        // apiParams.sort = `${params.sortBy}|${params.sortDesc ? "desc" : "asc"}`;
        apiParams.sortField = params.sortBy;
        apiParams.sortType = params.sortDesc ? 1 : -1;
      }
      if (params.filter && Object.keys(params.filter).length > 0) {
        // Optional
        if(params.filter.search_word) {
          apiParams.search_word = params.filter.search_word;
        }
        if(params.filter.periodFrom) {
          apiParams.periodFrom = params.filter.periodFrom;
        }
        if(params.filter.periodTo) {
          apiParams.periodTo = params.filter.periodTo;
        }
        if(params.filter.registerFrom) {
          apiParams.registerFrom = params.filter.registerFrom;
        }
        if(params.filter.registerTo) {
          apiParams.registerTo = params.filter.registerTo;
        }
        if(params.filter.type >= 0) {
          apiParams.type = params.filter.type;
        }
      }
      return apiParams;
    },
    getStatus(status) {
      switch(status) {
        case 0: return 'status working';
        case 1: return 'status reserved';
        case 2: return 'status onhold';
        case 3: return 'status stopped';
        case 4: return 'status finished';
      }
    },
    getStatusOptions(status) {
      switch(parseInt(status)) {
        case 0: return [
          { value: 0, text: "진행중" },
          // { value: 0, html: '<div class="d-flex align-items-center"><div class="status mr-2 working"></div><span>진행중</span></div>'},
          { value: 3, text: "중지" },
          { value: 4, text: "종료" },
        ];
        case 1: return [
          { value: 0, text: "진행중" },
          { value: 1, text: "예약" },
          { value: 2, text: "대기" },
          { value: 4, text: "종료" },
        ];
        case 2: return [
          { value: 1, text: "예약" },
          { value: 2, text: "대기" },
          { value: 4, text: "종료" },
        ];
        case 3: return [
          { value: 0, text: "진행중" },
          { value: 3, text: "중지" },
          { value: 4, text: "종료" },
        ];
        case 4: return [
          { value: 4, text: "종료" },
        ];
        default: return [
          { value: 1, text: "예약" },
          { value: 2, text: "대기" },
          { value: 4, text: "종료" },
        ]
      }
    },
    onClickSearch() {
      this.filter = {...this.searchForm};
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
    level_options() {
      var ary = [...Array(99).keys()];
      return ary;
    },
  },
};
</script>

<style scoped>
.research-type {
  width: 150px;
}
.fix-width {
  width: 50px;
}
.manage-icon-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.manage-icon-container .text-link {
  color: #3a3a3a;
  text-decoration: none;
}
.status {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #a3a3a3;
}
.working {
  background-color: #2f5597;
}
.reserved {
  background-color: #70ad47;
}
.onhold {
  background-color: #ffc000;
}
.stopped {
  background-color: #ff0000;
}
.finished {
  background-color: #7f7f7f;
}

.custom-select {
  height: 32px;
  padding: 0px 10px;
}
.per-page-container {
  position: absolute;
  right: 30px;
  top: 20px;
}
</style>