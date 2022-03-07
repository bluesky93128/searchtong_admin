<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h2>{{$t('menu.user_manage')}}</h2>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-row>
            <b-colxx xxs="12">
              <b-form-group label="진행기간" :label-cols="1">
                <div class="d-flex justify-content-between">
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
                  <b-button class="primary">검색</b-button>
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
          <b-row class="mb-2">
            <b-colxx xs="4">
              <div class="d-flex">
                <v-select :options="[5, 10, 25, 50, 100]" v-model="perPage"></v-select>
                <span class="span-center-text ml-2 mr-4">개씩 보기</span>
              </div>
            </b-colxx>
            <b-colxx xs="8" class="text-right">
              <span></span>
            </b-colxx>
          </b-row>
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
          >
            <template #cell(gender)="{ item }">
              {{item.panelInfo && item.panelInfo.gender ? '여자' : '남자'}}
            </template>
            <template #cell(createdAt)="{ item }">
              {{ formatDateWithMin(item.createdAt) }}
            </template>
            <template #cell(age)="{ item }">
              {{calcAge(item)}}
            </template>
            <template #cell(postalCode)="{ item }">
              {{ item.panelInfo && item.panelInfo.postData.sigunguCode }}
            </template>
            <template #cell(action)="{ item }">
              <router-link :to="{ path: 'user_detail', query: { id: item._id } }" class="text-link">
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
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { apiUrl } from '../../../constants/config';
import moment from "moment";
import axios from "axios";

export default {
  components: {
    "v-select": vSelect,
  },
  mounted() {
    this.userId = this.$route.query.id;
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
      userId: '',
      searchForm: {},
      disabledTo: null,
      disabledFrom: null,
      tableKey: 0,
      currentPage: 0,
      perPage: 5,
      totalRows: 0,
      isLoading: false,
      items: [],
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
            key: "researchId",
            label: "설문 ID",
            sortable: false,
            thClass: "fix-width bg-dark text-white text-center",
            tdClass: "list-item-heading fix-width text-center",
          },
          {
            key: "description",
            label: "설문제목",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "coin",
            label: "획득코인",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "createdAt",
            label: "설문참여일",
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
    calcAge(item) {
      let now = new Date();
      if(item.panelInfo) {
        return now.getFullYear() - item.panelInfo.birthYear;
      } else {
        return 0;
      }
    },
    dataProvider(ctx) {
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/user/getUserTransactionDetails/" + this.userId, {
        params: params,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      
      this.isLoading = true;

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
    getStatus(status) {
      switch(status) {
        case 0: return 'status working';
        case 1: return 'status reserved';
        case 2: return 'status onhold';
        case 3: return 'status stopped';
        case 4: return 'status finished';
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
  width: 150px !important;
}
.fix-width {
  width: 100px;
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
</style>