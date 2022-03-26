<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <div class="rounded">
          <b-card>
            <div class="d-flex justify-content-between align-items-center">
              <span class="card-text font-weight-semibold w-30"
                >보유중인 통통코인: {{ balance }} TTC</span
              >
              <div class="d-flex w-70 align-items-center justify-content-end">
                <span class="card-text font-weight-semibold mr-4">통통지갑: {{ user_data.wallet_addr }}</span>
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
    <!-- <b-row class="mt-3">
      <b-colxx xxs="12">
        <h2>통통코인</h2>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row> -->
    <b-row class="mt-4">
      <!-- <b-colxx xxs="8">
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
      </b-colxx> -->
      <b-colxx xs="12">
        <b-card class="">
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
          <!-- <b-form @submit.prevent="onHorizontalSubmit">
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
          </b-form> -->
        </b-card>
      </b-colxx>
      <b-colxx xs="12">
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
                  <div class="d-flex flex-column">
                    {{formatNumber(item.responseCost)}} TTC
                    <router-link :to="{ path: 'detail', query: { id: item._id } }" class="text-link">
                      보기
                    </router-link>
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
                  <div class="d-flex flex-column">
                    {{formatNumber(item.responseCost)}} TTC
                    <router-link :to="{ path: 'detail', query: { id: item._id } }" class="text-link">
                      보기
                    </router-link>
                  </div>
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
                  <div class="d-flex flex-column">
                    {{formatNumber(item.responseCost)}} TTC
                    <router-link :to="{ path: 'detail', query: { id: item._id } }" class="text-link">
                      보기
                    </router-link>
                  </div>
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
                  <div class="d-flex flex-column">
                    {{formatNumber(item.responseCost)}} TTC
                    <router-link :to="{ path: 'detail', query: { id: item._id } }" class="text-link">
                      보기
                    </router-link>
                  </div>
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
      <!-- <b-colxx xs="12">
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
          <template #cell(status)="{item}">
            {{status_options[item.status]}}
          </template>
          <template #cell(createdAt)="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
          <template #cell(duration)="{ item }">
            {{ item.isSetPeriodLater ? "설정되지 않음" : (formatDate(item.startAt) + ' ~ ' + formatDate(item.endAt)) }}
          </template>
          <template #cell(type)="{ item }">
            {{ type_options[item.type].label }}
          </template>
          <template #cell(action)="{ item }">
            <div class="d-flex flex-column">
              {{item.responseCost}} TTC
              <router-link :to="{ path: 'detail', query: { id: item._id } }" class="text-link">
                보기
              </router-link>
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
      </b-colxx> -->
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
      searchForm: {},
      filter: null,
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
      ],
      filter: null,
      status_options: [
        { value: 0, label: "진행중" },
        { value: 1, label: "예약" },
        { value: 2, label: "대기" },
        { value: 3, label: "중지" },
        { value: 4, label: "종료" },
      ],
      secretWords: "",
      user_data: {},
      sentPrice: 0,
      receivedPrice: 0,
      balance: 0,
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
      bootstrapTable: {
        selected: [],
        fields: [
          {
            key: "status",
            label: "",
            sortable: false,
            thClass: "fix-width bg-dark text-white text-center w-10",
            tdClass: "text-center w-10",
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
            key: "type",
            label: "설문유형",
            sortable: false,
            thClass: "bg-dark text-white text-center min-100",
            tdClass: " text-center min-100",
          },
          {
            key: "attendCount",
            label: "참여자수",
            sortable: true,
            thClass: "bg-dark text-white text-center min-100",
            tdClass: " text-center min-100",
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
            label: "응답비용",
            sortable: true,
            thClass: "bg-dark text-white text-center min-100",
            tdClass: " text-center min-100",
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
    formatNumber(num) {
      return num.toFixed(2);
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
    formatDateWithMin(date) {
      return moment(date).format("YYYY.MM.DD hh:mm");
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
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/research?status=0,3,4", {
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
          this.sentPrice = data.totalCost;
          const items = data.data;
          return items;
        })
        .catch((_error) => {
          return [];
        });
    },
    dataProviderWorking(ctx) {
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
          return items;
        })
        .catch((_error) => {
          return [];
        });
    },
    dataProviderStopped(ctx) {
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
          return items;
        })
        .catch((_error) => {
          return [];
        });
    },
    dataProviderFinished(ctx) {
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
          return items;
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
        if(apiParams.sortField == 'action') {
          apiParams.sortField = 'responseCost';
        }
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
    onClickSearch() {
      this.filter = {...this.searchForm};
      console.log(this.filter);
    },
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD hh:mm");
    },
    onRestore() {
      this.hideModal('restoreModal');
      let tmp = this.secretWords.replace(/(?:\r\n|\r|\n)/g, ' ').replace(/ +/g, ' ').split(" ");
      console.log(tmp);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "random12WordList": tmp
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + "/wallet/restoreWallet", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          this.addNotification("success filled", "지갑복구", "지갑복구에 성공했습니다!");
          this.user_data.wallet_addr = result.wallet_addr;
          this.balance = result.walletBalance.TTCOIN;
          localStorage.setItem('user', JSON.stringify(this.user_data));
        })
        .catch(error => {
          this.addNotification("error filled", "지갑복구", "지갑정보를 찾을수 없습니다.");
          console.log('error', error)
        });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
      console.log("hide modal:: " + refname);

      if (refname === "modalnestedinline") {
        this.$refs["modalnested"].show();
      }
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