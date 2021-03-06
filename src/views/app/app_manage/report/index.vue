<template>
  <div>
    <div class="loader-container" v-show="isLoading">
      <div class="loader"></div>
    </div>
    <b-row>
      <b-colxx xxs="12">
        <h2>{{$t('menu.app_manage.report')}}</h2>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-row>
            <b-colxx xxs="4">
              <b-form-group label="제목" :label-cols="2">
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
            <b-colxx xxs="2">
              <div class="d-flex justify-content-end">
                <b-button class="primary" @click="onClickSearch()">검색</b-button>
              </div>
            </b-colxx>
          </b-row>
        </b-card>
      </b-colxx>

      <b-colxx xs="12" class="mt-4">
        <b-card class="p-4" no-body>
          <div class="d-flex mb-2">
            <b-button variant="outline-primary" @click="onRemoveNotices()">삭제</b-button>
            <b-button
              variant="primary"
              class="ml-4"
              @click="onCreateNewNotice()"
              >등록</b-button
            >
          </div>
          <div class="d-flex per-page-dropdown">
            <v-select :options="[10, 25, 50, 100]" v-model="perPage"></v-select>
            <span class="span-center-text ml-2 mr-4">개씩 보기</span>
          </div>
          <b-table
            ref="noticeTable"
            class="text-center"
            :fields="noticesTable.fields"
            :items="dataProvider"
            :per-page="perPage"
            :current-page="currentPage"
            sort-by="createdAt"
            sort-desc.sync="false"
            @row-selected="rowSelected"
            selectable
            :select-mode="noticesTable.selectMode"
            selectedVariant="primary"
            :filter="filter"
            :key="tableKey"
          >
            <template #cell(checked)="{ item }">
              <b-form-checkbox
                :checked="noticesTable.selected.includes(item)"
                class="itemCheck mb-0"
              ></b-form-checkbox>
            </template>
            <template #cell(publicStatus)="{ item }">
              <div class="d-flex justify-content-center">
                <b-badge
                  :variant="status_variant[item.publicStatus]"
                  >{{ status_text[item.publicStatus] }}</b-badge
                >
              </div>
            </template>
            <!-- <template #cell(no)="{ item, index }">
              {{ index + 1 }}
            </template> -->
            <template #cell(content)="{ item }">
              <div style="height: 20px; overflow: hidden;" v-html="item.content"></div>
            </template>
            <template #cell(title)="{ item }">
              <router-link :to="{ path: 'report_edit', query: { id: item._id } }" class="text-link">{{ item.title }}</router-link>
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
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { apiUrl } from "../../../../constants/config";
import axios from "axios";
import { en, ko } from "vuejs-datepicker/dist/locale";
import moment from "moment";

export default {
  components: {
    "v-select": vSelect,
  },
  data() {
    return {
      en: en,
      ko: ko,
      status_text: ["전체공개", "회원공개", "비공개"],
      status_variant: ["primary", "outline-primary", "secondary"],
      isLoading: false,
      searchForm: {},
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
      currentPage: 1,
      totalRows: 0,
      perPage: 10,
      filter: {},
      tableKey: 0,
      noticesTable: {
        selected: [],
        selectMode: "multi",
        fields: [
          {
            key: "checked",
            label: "선택",
            tdClass: "w-10",
            thClass: "bg-dark text-white",
          },
          {
            key: "level",
            label: "레벨",
            sortable: false,
            thClass: "bg-dark text-white",
          },
          {
            key: "title",
            label: "제목",
            sortable: false,
            tdClass: "table-column-width text-center",
            thClass: "bg-dark text-white",
          },
          {
            key: "createdAt",
            label: "등록일",
            thClass: "bg-dark text-white",
          },
          {
            key: "publicStatus",
            label: "공개상태",
            tdClass: "w-10",
            thClass: "bg-dark text-white",
          },
        ],
      },
    };
  },
  methods: {
    rowSelected(items) {
      this.noticesTable.selected = items;
    },
    onClickSearch() {
      this.filter = {...this.searchForm};
    },
    dataProvider(ctx) {
      this.isLoading = true;
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/report", {
        params: params,
      });

      return promise
        .then((result) => result.data)
        .then((data) => {
          this.currentPage = data.current_page;
          this.perPage = data.per_page;
          this.totalRows = data.total;
          const items = data.data;
          this.isLoading = false;
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
        if(params.filter.title) {
          apiParams.search_word = params.filter.title;
          apiParams.search_option = 'all';
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
    onRemoveNotices() {
      this.isLoading = true;
      
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      var self = this;
      this.noticesTable.selected.forEach(item => {
        fetch(apiUrl + "/report/" + item._id, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if(result.status) {
            self.addNotification("success filled", "여론조사 리포트 삭제", "여론조사 리포트가 성공적으로 삭제되었습니다!");
            self.tableKey++;
          } else {
            self.addNotification("error filled", "여론조사 리포트 삭제", "여론조사 리포트를 삭제하는 중에 오류가 발생했습니다.");
          }
          this.isLoading = false;
        })
        .catch(error => console.log('error', error));
      })
    },
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD.");
    },
    onCreateNewNotice() {
      this.$router.push("report_new");
    },
    addNotification(
      type = "success",
      title = "This is Notify Title",
      message = "This is Notify Message,<br>with html."
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false });
    },
  }
};
</script>

<style scoped>
.research-type {
  min-width: 200px;
}
</style>