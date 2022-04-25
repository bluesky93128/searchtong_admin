<template>
  <div>
    <div class="loader-container" v-show="isLoading">
      <div class="loader"></div>
    </div>
    <b-row>
      <b-colxx xxs="12">
        <h2>{{$t('menu.research.request_manage')}}</h2>
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
              <b-form-group label="신청일" :label-cols="2">
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
            <!-- <b-colxx xxs="6">
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
            </b-colxx> -->
            <b-colxx xxs="6">
              <b-form-group label="작성자 ID" :label-cols="2">
                <b-form-input v-model="searchForm.creatorPhone" />
              </b-form-group>
            </b-colxx>
            <b-colxx xxs="6">
              <b-form-group label="설문상태" :label-cols="2">
                <div class="d-flex justify-content-between">
                  <v-select
                    v-model="searchForm.status"
                    :options="status_options"
                    label="text"
                    placeholder="전체"
                    :reduce="(item) => item.value"
                    class="research-type"
                  />
                  <b-button class="primary" @click="onClickSearch()">검색</b-button>
                </div>
              </b-form-group>
            </b-colxx>
            <!-- <b-colxx xxs="6">
              <b-form-group label="작성자 ID" :label-cols="2">
                <b-form-input v-model="searchForm.creatorPhone" />
              </b-form-group>
            </b-colxx>
            <b-colxx xxs="6">
              <b-button class="primary float-right" @click="onClickSearch()">검색</b-button>
            </b-colxx> -->
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
                <template #cell(approvedStatus)="{ item }">
                  <span class="approved" v-if="item.approvedStatus == 1 || item.approvedStatus == 3">승인완료</span>
                  <span class="rejected text-link" v-else-if="item.approvedStatus == 2" @click="showRejectedDetail(item)">반려</span>
                  <custom-select
                    v-else
                    :options="approved_status_options"
                    :default="approved_status_options[item.approvedStatus]"
                    @input="onChangeApprovedStatus(item, $event)"
                    :key="'status_'+item._id"
                  />
                </template>
                <template #cell(status)="{ item }">
                  <custom-select
                    v-if="item.approvedStatus == 3"
                    :options="getStatusOptions(item.status)"
                    :default="status_options[item.status >= 0 ? item.status : 2]"
                    @input="onChangeStatus(item, $event)"
                    :key="'status_'+item._id"
                  />
                </template>
                <template #cell(level)="{ item }">
                  <b-select
                    v-model="item.level"
                    :options="level_options"
                    @change="onChangeLevel(item)"
                  />
                </template>
                <template #cell(createdAt)="{ item }">
                  {{ formatDateWithMin(item.createdAt) }}
                  {{ formatDateWithMin(item.updatedAt)}}(수정)
                </template>
                <template #cell(duration)="{ item }">
                  {{ item.isSetPeriodLater ? "설정되지 않음" : (formatDateWithMin(item.startAt) + ' ~ ' + formatDateWithMin(item.endAt)) }}
                </template>
                <template #cell(type)="{ item }">
                  {{ type_options[item.type].label }}
                </template>
                <template #cell(action)="{ item }">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="manage-icon-container ml-1" v-if="item.status != 4">
                      <router-link :to="{ path: 'register', query: { id: item._id, isView: true, isSetReward: true } }" class="text-link">
                        <i class="simple-icon-pencil" />
                      </router-link>
                    </div>
                  </div>
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
            <b-tab :title="'승인완료('+totalApprovedRows+')'">
              <b-table
                ref="custom-table"
                class="vuetable"
                :current-page="currentApprovedPage"
                :per-page="perPage"
                :fields="bootstrapTable.fields"
                :items="dataProviderApproved"
                selectable
                select-mode="single"
                :key="tableKey"
                :filter="filter"
              >
                <template #cell(approvedStatus)="{ item }">
                  <span class="approved" v-if="item.approvedStatus == 1 || item.approvedStatus == 3">승인완료</span>
                  <span class="rejected text-link" v-else-if="item.approvedStatus == 2" @click="showRejectedDetail(item)">반려</span>
                  <custom-select
                    v-else
                    :options="approved_status_options"
                    :default="approved_status_options[item.approvedStatus]"
                    @input="onChangeApprovedStatus(item, $event)"
                    :key="'status_'+item._id"
                  />
                </template>
                <template #cell(status)="{ item }">
                  <custom-select
                    v-if="item.approvedStatus == 3"
                    :options="getStatusOptions(item.status)"
                    :default="status_options[item.status >= 0 ? item.status : 2]"
                    @input="onChangeStatus(item, $event)"
                    :key="'status_'+item._id"
                  />
                </template>
                <template #cell(level)="{ item }">
                  <b-select
                    v-model="item.level"
                    :options="level_options"
                    @change="onChangeLevel(item)"
                  />
                </template>
                <template #cell(createdAt)="{ item }">
                  {{ formatDateWithMin(item.createdAt) }}
                  {{ formatDateWithMin(item.updatedAt)}}(수정)
                </template>
                <template #cell(duration)="{ item }">
                  {{ item.isSetPeriodLater ? "설정되지 않음" : (formatDateWithMin(item.startAt) + ' ~ ' + formatDateWithMin(item.endAt)) }}
                </template>
                <template #cell(type)="{ item }">
                  {{ type_options[item.type].label }}
                </template>
                <template #cell(action)="{ item }">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="manage-icon-container ml-1" v-if="item.status != 4">
                      <router-link :to="{ path: 'register', query: { id: item._id, isView: true, isSetReward: true } }" class="text-link">
                        <i class="simple-icon-pencil" />
                      </router-link>
                    </div>
                  </div>
                </template>
              </b-table>
              <b-pagination
                size="sm"
                align="center"
                :total-rows="totalApprovedRows"
                :per-page="perPage"
                v-model="currentApprovedPage"
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
            <b-tab :title="'승인대기('+totalPendingRows+')'">
              <b-table
                ref="custom-table"
                class="vuetable"
                :current-page="currentPendingPage"
                :per-page="perPage"
                :fields="bootstrapTable.fields"
                :items="dataProviderPending"
                selectable
                select-mode="single"
                :key="tableKey"
                :filter="filter"
              >
                <template #cell(approvedStatus)="{ item }">
                  <span class="approved" v-if="item.approvedStatus == 1 || item.approvedStatus == 3">승인완료</span>
                  <span class="rejected text-link" v-else-if="item.approvedStatus == 2" @click="showRejectedDetail(item)">반려</span>
                  <custom-select
                    v-else
                    :options="approved_status_options"
                    :default="approved_status_options[item.approvedStatus]"
                    @input="onChangeApprovedStatus(item, $event)"
                    :key="'status_'+item._id"
                  />
                </template>
                <template #cell(status)="{ item }">
                  <custom-select
                    v-if="item.approvedStatus == 3"
                    :options="getStatusOptions(item.status)"
                    :default="status_options[item.status >= 0 ? item.status : 2]"
                    @input="onChangeStatus(item, $event)"
                    :key="'status_'+item._id"
                  />
                </template>
                <template #cell(level)="{ item }">
                  <b-select
                    v-model="item.level"
                    :options="level_options"
                    @change="onChangeLevel(item)"
                  />
                </template>
                <template #cell(createdAt)="{ item }">
                  {{ formatDateWithMin(item.createdAt) }}
                  {{ formatDateWithMin(item.updatedAt)}}(수정)
                </template>
                <template #cell(duration)="{ item }">
                  {{ item.isSetPeriodLater ? "설정되지 않음" : (formatDateWithMin(item.startAt) + ' ~ ' + formatDateWithMin(item.endAt)) }}
                </template>
                <template #cell(type)="{ item }">
                  {{ type_options[item.type].label }}
                </template>
                <template #cell(action)="{ item }">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="manage-icon-container ml-1" v-if="item.status != 4">
                      <router-link :to="{ path: 'register', query: { id: item._id, isView: true, isSetReward: true } }" class="text-link">
                        <i class="simple-icon-pencil" />
                      </router-link>
                    </div>
                  </div>
                </template>
              </b-table>
              <b-pagination
                size="sm"
                align="center"
                :total-rows="totalPendingRows"
                :per-page="perPage"
                v-model="currentPendingPage"
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
            <b-tab :title="'반려('+totalRejectedRows+')'">
              <b-table
                ref="custom-table"
                class="vuetable"
                :current-page="currentRejectedPage"
                :per-page="perPage"
                :fields="bootstrapTable.fields"
                :items="dataProviderRejected"
                selectable
                select-mode="single"
                :key="tableKey"
                :filter="filter"
              >
                <template #cell(approvedStatus)="{ item }">
                  <span class="approved" v-if="item.approvedStatus == 1 || item.approvedStatus == 3">승인완료</span>
                  <span class="rejected text-link" v-else-if="item.approvedStatus == 2" @click="showRejectedDetail(item)">반려</span>
                  <custom-select
                    v-else
                    :options="approved_status_options"
                    :default="approved_status_options[item.approvedStatus]"
                    @input="onChangeApprovedStatus(item, $event)"
                    :key="'status_'+item._id"
                  />
                </template>
                <template #cell(status)="{ item }">
                  <custom-select
                    v-if="item.approvedStatus == 3"
                    :options="getStatusOptions(item.status)"
                    :default="status_options[item.status >= 0 ? item.status : 2]"
                    @input="onChangeStatus(item, $event)"
                    :key="'status_'+item._id"
                  />
                </template>
                <template #cell(level)="{ item }">
                  <b-select
                    v-model="item.level"
                    :options="level_options"
                    @change="onChangeLevel(item)"
                  />
                </template>
                <template #cell(createdAt)="{ item }">
                  {{ formatDateWithMin(item.createdAt) }}
                  {{ formatDateWithMin(item.updatedAt)}}(수정)
                </template>
                <template #cell(duration)="{ item }">
                  {{ item.isSetPeriodLater ? "설정되지 않음" : (formatDateWithMin(item.startAt) + ' ~ ' + formatDateWithMin(item.endAt)) }}
                </template>
                <template #cell(type)="{ item }">
                  {{ type_options[item.type].label }}
                </template>
                <template #cell(action)="{ item }">
                  <div class="d-flex align-items-center justify-content-center">
                    <div class="manage-icon-container ml-1" v-if="item.status != 4">
                      <router-link :to="{ path: 'register', query: { id: item._id, isView: true, isSetReward: true } }" class="text-link">
                        <i class="simple-icon-pencil" />
                      </router-link>
                    </div>
                  </div>
                </template>
              </b-table>
              <b-pagination
                size="sm"
                align="center"
                :total-rows="totalRejectedRows"
                :per-page="perPage"
                v-model="currentRejectedPage"
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
      <b-modal id="rejectModal" ref="rejectModal" title="반려사유 작성" @hide="tableKey++">
        <b-textarea v-model="rejectDetails" />
        <template slot="modal-footer">
          <b-button variant="primary" @click="onClickReject()">반려하기</b-button>
        </template>
      </b-modal>
    </b-row>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { apiUrl } from '../../../../constants/config';
import moment from "moment";
import axios from "axios";
import customSelect from '../../../../components/MyComponents/CustomSelect.vue';

export default {
  components: {
    "v-select": vSelect,
    "custom-select": customSelect
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
      searchForm: {},
      isLoading: false,
      filter: null,
      disabledTo: null,
      disabledFrom: null,
      tableKey: 0,
      currentPage: 1,
      currentApprovedPage: 1,
      currentPendingPage: 1,
      currentRejectedPage: 1,
      // currentStoppedPage: 0,
      // currentFinishedPage: 0,
      perPage: 5,
      totalRows: 0,
      totalApprovedRows: 0,
      totalPendingRows: 0,
      totalRejectedRows: 0,
      // totalStoppedRows: 0,
      // totalFinishedRows: 0,
      items: [],
      level_options: [1, 2, 3, 99],
      type_options: [
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
        {
          label: "전체",
          value: -1,
        },
      ],
      approved_status_options: [
        { value: 0, text: "승인대기"},
        { value: 1, text: "승인완료"},
        { value: 2, text: "반려"},
      ],
      status_options: [
        { value: 0, text: "진행중" },
        { value: 1, text: "예약" },
        { value: 2, text: "대기" },
        { value: 3, text: "중지" },
        { value: 4, text: "종료" },
      ],
      bootstrapTable: {
        selected: [],
        fields: [
          {
            key: "approvedStatus",
            label: "심사상태",
            sortable: false,
            thClass: "fix-width bg-dark text-white text-center w-10",
            tdClass: "list-item-heading fix-width text-center w-10",
          },
          {
            key: "status",
            label: "설문상태",
            sortable: false,
            thClass: "fix-width bg-dark text-white text-center w-10",
            tdClass: "list-item-heading fix-width text-center w-10",
          },
          {
            key: "creatorPhone",
            label: "작성자ID",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "_id",
            label: "설문ID",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "title",
            label: "설문제목",
            sortable: false,
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
            label: "리워드설정",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
        ],
      },
      rejectDetails: "",
      tempItem: null
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
      let promise = axios.get(apiUrl + "/research?isDraft=0&isNotAdmin=true&approvedStatus=0,1,2,3", {
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
    dataProviderApproved(ctx) {
      this.isLoading = true;
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/research?isDraft=0&isNotAdmin=true&approvedStatus=1,3", {
        params: params,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      return promise
        .then((result) => result.data)
        .then((data) => {
          this.currentApprovedPage = data.current_page;
          // this.perPage = data.per_page;
          this.totalApprovedRows = data.total;
          const items = data.data;
          this.isLoading = false;
          return items;
        })
        .catch((_error) => {
          this.isLoading = false;
          return [];
        });
    },
    dataProviderPending(ctx) {
      this.isLoading = true;
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/research?isDraft=0&isNotAdmin&approvedStatus=0", {
        params: params,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      return promise
        .then((result) => result.data)
        .then((data) => {
          this.currentPendingPage = data.current_page;
          // this.perPage = data.per_page;
          this.totalPendingRows = data.total;
          const items = data.data;
          this.isLoading = false;
          return items;
        })
        .catch((_error) => {
          this.isLoading = false;
          return [];
        });
    },
    dataProviderRejected(ctx) {
      this.isLoading = true;
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/research?isDraft=0&isNotAdmin=true&approvedStatus=2", {
        params: params,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      return promise
        .then((result) => result.data)
        .then((data) => {
          this.currentRejectedPage = data.current_page;
          // this.perPage = data.per_page;
          this.totalRejectedRows = data.total;
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
        if(params.filter.creatorPhone >= 0) {
          apiParams.creatorPhone = params.filter.creatorPhone;
        }
      }
      this.$forceUpdate();
      return apiParams;
    },
    deleteItem(item) {
      if(confirm("삭제하시겠습니까?")) {
        if(item.status == 0) {
          this.addNotification("error filled", "설문 삭제", "진행중인 설문은 삭제할수 없읍니다!");
          return;
        }
        this.isLoading = true;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow'
        };

        var self = this;
        fetch(apiUrl + "/research/" + item._id, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result);
            if(result.status) {
              self.addNotification("success filled", "설문 삭제", "설문이 성공적으로 삭제되었습니다!");
              self.tableKey++;
            } else {
              self.addNotification("error filled", "설문 삭제", "설문을 삭제하는 중에 오류가 발생했습니다!");
            }
            this.isLoading = false;
          })
          .catch(error => {
            this.isLoading = false;
            console.log('error', error)
          });
      }
    },
    duplicateItem(item) {
      this.isLoading = true;
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(apiUrl + "/research/duplicateResearch/" + item._id, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          this.addNotification("success filled", "설문 복사", "설문이 복사 되었습니다");
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
          console.log('error', error)
        });
      // var myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");
      // myHeaders.append(
      //   "Authorization",
      //   "Bearer " + localStorage.getItem("token")
      // );

      
      // let cloneData = {...item};
      // delete cloneData._id;
      // cloneData.isDraft = true;
      // cloneData.status = 2;
      // cloneData.isSetPeriodLater = true;


      // var raw = JSON.stringify(cloneData);

      // var requestOptions = {
      //   method: "POST",
      //   headers: myHeaders,
      //   body: raw,
      //   redirect: "follow",
      // };

      // fetch(apiUrl + "/research", requestOptions)
      //   .then((response) => response.json())
      //   .then((result) => {
      //     console.log(result);
      //     this.data = result;
      //     this.data.itemText = this.data.itemText || {};
      //     this.data.itemQuestion = this.data.itemQuestion || {};
      //     this.data.itemFinish = this.data.itemFinish || {};
      //     this.data.itemResearcher = this.data.itemResearcher || {};
      //     this.data.itemReward = this.data.itemReward || {};
      //     this.addNotification("success filled", "설문 복사", "설문이 복사 되었습니다");
      //   })
      //   .catch((error) => console.log("error", error));
    },
    getStatus(option) {
      switch(option) {
        case 0: return 'working';
        case 1: return 'reserved';
        case 2: return 'onhold';
        case 3: return 'stopped';
        case 4: return 'finished';
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
    onChangeApprovedStatus(item, $event) {
      let approvedStatus = $event.value;
      if(approvedStatus == 2) {
        this.showModal('rejectModal');
        this.tempItem = item;
      } else {
        let data = {
          approvedStatus: approvedStatus
        }
        this.updateResearch(data, item._id);
      }
    },
    showRejectedDetail(item) {
      console.log('$bvModal = ', item)
      this.$bvModal.msgBoxOk(item.rejectDetails, {
        title: "반려사유",
      })
        .then(value => {
          console.log(value);
        })
        .catch(err => {

        })
    },
    onClickReject() {
      this.hideModal('rejectModal')
      let data = {
        approvedStatus: 2,
        rejectDetails: this.rejectDetails
      };
      this.updateResearch(data, this.tempItem._id);
      this.tempItem = null;
      this.rejectDetails = "";
    },
    onChangeStatus(item, $event) {
      let prevStatus = item.status;
      console.log('item = ', item);
      item.status = $event.value;

      let data = {
        status: $event.value
      };
      if(prevStatus == 0) {
        if(item.status == 4) {
          data.endAt = new Date();
          this.updateResearch(data, item._id);
        } else if(item.status == 3) {
          this.updateResearch(data, item._id);
        }
      } else if(prevStatus == 1) {
        if(item.status == 0) {
          data.startAt = new Date();
          this.updateResearch(data, item._id);
        } else if(item.status == 2) {
          data.startAt = null;
          data.endAt = null;
          data.isSetPeriodLater = true;
          this.updateResearch(data, item._id);
        } else if(item.status == 4) {
          data.startAt = null;
          data.endAt = null;
          data.isSetPeriodLater = true;
          this.updateResearch(data, item._id);
        }
      } else if(prevStatus == 2) {
        if(item.status == 1) {
          this.$router.push({path: 'register', query: {id: item._id}})
        }
      } else if(prevStatus == 3) {
        if(item.status == 4) {
          this.endAt = new Date();
          this.updateResearch(data, item._id);
        } else if(item.status == 0) {
          this.updateResearch(data, item._id);
        }
      } else {
        this.updateResearch(data, item._id);
      }
      
    },
    onChangeLevel(item) {
      console.log(item.level);
      let data = {
        level: item.level
      };
      this.updateResearch(data, item._id);
    },
    updateResearch(data, id) {
      this.isLoading = true;
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(data);

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(apiUrl + "/research/" + id, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result)
          this.tableKey++;
          this.addNotification("success filled", "설문 상태변경", "상태가 변경 되었습니다");
          this.isLoading = false;
        })
        .catch((error) => {
          console.log("error", error)
          this.isLoading = false;
        });
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
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    showModal(refname) {
      this.$refs[refname].show();
    }
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