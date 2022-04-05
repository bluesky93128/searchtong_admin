<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h2>{{$t('menu.app_manage.inquery')}}</h2>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-form @submit.prevent="onHorizontalSubmit">
            <b-row>
              <b-colxx xs="6">
                <b-form-group
                  label-cols="2"
                  horizontal
                  :label="$t('search.search')"
                >
                  <b-input-group class="mb-2 pl-0">
                    <b-input-group-prepend>
                      <b-dropdown
                        :text="$t('search.' + searchForm.search_term)"
                        variant="outline-secondary"
                      >
                        <b-dropdown-item @click="onClickSearchOption('all')">전체</b-dropdown-item>
                        <b-dropdown-item @click="onClickSearchOption('title')">제목</b-dropdown-item>
                      </b-dropdown>
                    </b-input-group-prepend>
                    <b-form-input v-model="searchForm.search_word" />
                  </b-input-group>
                </b-form-group>
              </b-colxx>
              <b-colxx xs="3">
                <b-form-group label-cols="4" label="처리상태" horizontal>
                  <v-select
                    v-model="searchForm.refund_status"
                    :options="['전체', '미처리', '처리완료']"
                    placeholder="전체"
                  />
                </b-form-group>
              </b-colxx>
            </b-row>
            <b-form-group label-cols="1" horizontal label="기간">
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
          <!-- <b-row>
            <b-colxx xxs="6">
              <b-form-group label="설문제목 또는 ID" :label-cols="2">
                <b-form-input v-model="searchForm.title" />
              </b-form-group>
            </b-colxx>
            <b-colxx xxs="6">
              <b-form-group label="등록일" :label-cols="2">
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
              </b-form-group>
            </b-colxx>
          </b-row>
          <b-row>
            <b-colxx xxs="6">
              <b-form-group label="진행기간" :label-cols="2">
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
          </b-row> -->
        </b-card>
      </b-colxx>

      <b-colxx xs="12" class="mt-4">
        <b-card class="p-4" >
          <div class="d-flex per-page-dropdown">
            <v-select :options="[10, 25, 50, 100]" v-model="perPage"></v-select>
            <span class="span-center-text ml-2 mr-4">개씩 보기</span>
          </div>
          <b-table
            ref="myTable"
            class="text-center mt-4"
            :fields="customer_centerTable.fields"
            :items="dataProvider"
            :per-page="perPage"
            :current-page="currentPage"
            sort-by="createdAt"
            sort-desc.sync="false"
            @row-selected="rowSelected"
            selectable
            :select-mode="customer_centerTable.selectMode"
            selectedVariant="primary"
            :filter="filter"
          >
            <template #cell(no)="{ item, index }">
              {{ perPage * (currentPage - 1) + index + 1 }}
            </template>
            <template #cell(status)="{ item }">
              <b-badge :variant="status_variant[item.status]">{{
                status_text[item.status]
              }}</b-badge>
            </template>
            <template #cell(id)="{item}">
              {{item.user.name}}
            </template>
            <template #cell(createdAt)="{ item }">
              {{ formatDate(item.createdAt) }}
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
        </b-card>
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


export default {
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      en: en,
      ko: ko,
      status_text: ["미처리", "처리완료"],
      status_variant: ["outline-primary", "success"],
      searchForm: {
        search_term: "all",
        search_word: "",
        fromDate: null,
        toDate: null,
        refund_status: ""
      },
      filter: null,
      disabledTo: null,
      disabledFrom: null,
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
      items: [],
      currentPage: 1,
      totalRows: 0,
      perPage: 10,
      customer_centerTable: {
        selected: [],
        selectMode: "single",
        fields: [
          {
            key: "no",
            label: "번호",
            sortable: false,
            thClass: "bg-dark text-white",
          },
          {
            key: "user.decPhoneNum",
            label: "ID",
            sortable: false,
            thClass: "bg-dark text-white",
          },
          {
            key: "title",
            label: "제목",
            sortable: false,
            thClass: "bg-dark text-white",
          },
          {
            key: "content",
            label: "내용",
            sortable: false,
            thClass: "bg-dark text-white",
          },
          {
            key: "status",
            label: "상태",
            tdClass: "w-10",
            thClass: "bg-dark text-white",
          },
          {
            key: "createdAt",
            label: "등록일",
            sortable: true,
            thClass: "bg-dark text-white",
          },
        ],
      },
    };
  },
  methods: {
    // getList() {
    //   let promise = axios.get(apiUrl + "/customer_center?role=admin&page="+this.currentPage+"&per_page="+this.perPage, {
    //     params: this.searchForm,
    //     headers: {
    //       Authorization: "Bearer " + localStorage.getItem("token"),
    //     },
    //   });

    //   return promise
    //     .then((result) => result.data)
    //     .then((data) => {
    //       this.currentPage = data.current_page;
    //       // this.perPage = data.per_page;
    //       this.totalRows = data.total;
    //       const items = data.data;
    //       this.items = items;
    //       return items;
    //     })
    //     .catch((_error) => {
    //       return [];
    //     });
    // },
    onHorizontalSubmit() {
      // console.log(this.searchForm);
      // this.getList();
      this.filter = {...this.searchForm};
    },
    onClickSearchOption(option) {
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
      this.$router.push({path: "inquery_edit", query: {id: items[0]._id}});
    },
    dataProvider(ctx) {
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/customer_center?role=admin", {
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
      if (params.filter && Object.keys(params.filter).length > 0) {
        // Optional
        if(params.filter.search_word) {
          apiParams.search_word = params.filter.search_word;
        } else {
          apiParams.search_word = "";
        }
        if(params.filter.search_term) {
          apiParams.search_term = params.filter.search_term;
        }
        if(params.filter.refund_status) {
          apiParams.refund_status = params.filter.refund_status;
        }
        if(params.filter.fromDate) {
          apiParams.fromDate = params.filter.fromDate;
        }
        if(params.filter.toDate) {
          apiParams.toDate = params.filter.toDate;
        }
      }
      return apiParams;
    },
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD.");
    },
    onCreateNewNotice() {
      this.$router.customer_center("customer_center_new");
    },
    hideModal(refname) {
      this.$refs[refname].hide();
      console.log("hide modal:: " + refname);

      if (refname === "modalnestedinline") {
        this.$refs["modalnested"].show();
      }
    },
    somethingModal(refname) {
      this.$refs[refname].hide();
      console.log("something modal:: " + refname);

      if (refname === "modalnestedinline") {
        this.$refs["modalnested"].show();
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped>
.research-type {
  min-width: 200px;
}
</style>