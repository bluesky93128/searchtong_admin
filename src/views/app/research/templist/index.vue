<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h2>{{$t('menu.research.manage')}}</h2>
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
            :filter="filter"
          >
            <template #cell(status)="{ item }">
              <v-select
                v-model="item.status"
                :options="status_options"
                :reduce="(item) => item.value"
              >
                <template v-slot:selected-option="option">
                  <div class="d-flex align-items-center">
                    <div :class="'status ' + getStatus(option.value)"></div>
                  </div>
                </template>
                <template v-slot:option="option">
                  <div class="d-flex align-items-center">
                    <div :class="'status mr-2 ' + getStatus(option.value)"></div>
                    <span>{{option.label}}</span>
                  </div>
                </template>
              </v-select>
            </template>
            <template #cell(level)="{ item }">
              <v-select
                v-model="item.level"
                :options="level_options"
              />
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
              <div class="d-flex align-items-center justify-content-center">
                <div class="manage-icon-container">
                  <router-link :to="{ path: 'register', query: { id: item._id } }" class="text-link">
                    <i class="simple-icon-pencil" />
                  </router-link>
                </div>
                <div class="manage-icon-container ml-1">
                  <i class="simple-icon-trash" @click="deleteItem(item)" />
                </div>
                <div class="manage-icon-container ml-1">
                  <i class="simple-icon-docs" @click="duplicateItem(item)" />
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
      searchForm: {},
      filter: null,
      disabledTo: null,
      disabledFrom: null,
      tableKey: 0,
      currentPage: 0,
      perPage: 5,
      totalRows: 0,
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
          // {
          //   key: "status",
          //   label: "",
          //   sortable: false,
          //   thClass: "fix-width bg-dark text-white text-center",
          //   tdClass: "list-item-heading fix-width text-center",
          // },
          // {
          //   key: "level",
          //   label: "레벨",
          //   sortable: true,
          //   thClass: "fix-width bg-dark text-white text-center",
          //   tdClass: "fix-width text-center",
          // },
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
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "attendCount",
            label: "참여자수",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "createdAt",
            label: "등록일",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "duration",
            label: "진행기간",
            sortable: false,
            thClass: "bg-dark text-white text-center",
            tdClass: " text-center",
          },
          {
            key: "action",
            label: "관리",
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
      const params = this.apiParamsConverter(ctx);
      let promise = axios.get(apiUrl + "/research?isDraft=1", {
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
    deleteItem(item) {
      if(confirm('삭제하시겠습니까?')) {
        if(item.status == 0) {
          this.addNotification("error filled", "설문 삭제", "진행중인 설문은 삭제할수 없읍니다!");
          return;
        }
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
          })
          .catch(error => console.log('error', error));
      }
    },
    duplicateItem(item) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );

      let cloneData = {...item};
      delete cloneData._id;
      cloneData.isDraft = true;
      cloneData.isSetPeriodLater = true;


      var raw = JSON.stringify(cloneData);

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
          this.addNotification("success filled", "설문 복사", "설문이 복사 되었습니다");
          this.$forceUpdate();
        })
        .catch((error) => console.log("error", error));
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
</style>