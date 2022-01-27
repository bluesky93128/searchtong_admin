<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h2>{{$t('menu.app_manage.notice')}}</h2>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-row>
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
                  <b-button class="primary">검색</b-button>
                </div>
              </b-form-group>
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
            <template #cell(status)="{ item }">
              <div class="d-flex justify-content-center">
                <b-badge
                  :variant="status_variant[item.isPublic == true ? 1 : 0]"
                  >{{ status_text[item.isPublic == true ? 1 : 0] }}</b-badge
                >
                <b-badge v-if="item.isMain" variant="primary" class="ml-2"
                  >메인</b-badge
                >
              </div>
            </template>
            <template #cell(no)="{ item, index }">
              {{ index + 1 }}
            </template>
            <template #cell(content)="{ item }">
              <div style="height: 20px; overflow: hidden;" v-html="item.content"></div>
            </template>
            <template #cell(name)="{ item }">
              <router-link
                :to="{ path: 'notices_edit', query: { id: item._id } }"
                class="text-link"
                >{{ item.name }}</router-link
              >
            </template>
            <template #cell(createdAt)="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>
          </b-table>
          <b-pagination
            size="sm"
            align="center"
            :total-rows="totalRows"
            per-page="5"
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
      status_text: ["비공개", "공개"],
      status_variant: ["outline-primary", "primary"],
      searchForm: {},
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
            key: "no",
            label: "번호",
            sortable: false,
            thClass: "bg-dark text-white",
          },
          {
            key: "name",
            label: "제목",
            sortable: false,
            tdClass: "table-column-width text-center",
            thClass: "bg-dark text-white",
          },
          {
            key: "content",
            label: "내용",
            sortable: false,
            tdClass: "table-column-width text-center",
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
    dataProvider(ctx) {
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/notice", {
        params: params,
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
      if (params.filter) {
        // Optional
        apiParams.search_option = params.filter.search_term;
        apiParams.search_word = params.filter.search_word;
        apiParams.from = params.filter.fromDate;
        apiParams.to = params.filter.toDate;
      }
      return apiParams;
    },
    onRemoveNotices() {
      
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      var self = this;
      this.noticesTable.selected.forEach(item => {
        fetch(apiUrl + "/notice/" + item._id, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if(result.status) {
            self.addNotification("success filled", "공지사항 삭제", "공지사항이 성공적으로 삭제되었습니다!");
            self.tableKey++;
          } else {
            self.addNotification("error filled", "공지사항 삭제", "공지사항을 삭제하는 중에 오류가 발생했습니다.");
          }
        })
        .catch(error => console.log('error', error));
      })
    },
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD.");
    },
    onCreateNewNotice() {
      this.$router.push("notices_new");
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