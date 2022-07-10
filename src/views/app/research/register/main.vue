<template v-if="data">
  <div class="mb-4">
    <p class="description">※설문유형을 선택해주세요.</p>
    <b-form>
      <b-row class="icon-cards-row mt-4">
        <b-colxx xxs="3">
          <div class="rounded">
            <b-card
              :class="`text-center ${data.type == 0 ? 'active' : ''}`"
              @click="setType(0)"
            >
              <p class="lead text-center">{{ $t("research.research") }}</p>
              <p class="card-text font-weight-semibold mb-0 mt-4">
                구성: 본문 + 문항 + 종료글
              </p>
              <p class="card-text font-weight-semibold mb-0">
                추가혜택 제공: 불가능
              </p>
            </b-card>
          </div>
        </b-colxx>
        <b-colxx xxs="3">
          <div class="rounded">
            <b-card
              :class="`text-center ${data.type == 1 ? 'active' : ''}`"
              @click="setType(1)"
            >
              <p class="lead text-center">{{ $t("research.survey") }}</p>
              <p class="card-text font-weight-semibold mb-0 mt-4">
                구성: 본문 + 문항 + 종료글
              </p>
              <p class="card-text font-weight-semibold mb-0">
                추가혜택 제공: 가능
              </p>
            </b-card>
          </div>
        </b-colxx>
        <b-colxx xxs="3">
          <div class="rounded">
            <b-card
              :class="`text-center ${data.type == 2 ? 'active' : ''}`"
              @click="setType(2)"
            >
              <p class="lead text-center">
                {{ $t("research.advertisement") }}
              </p>
              <p class="card-text font-weight-semibold mb-0 mt-4">구성: 본문</p>
              <p class="card-text font-weight-semibold mb-0">
                추가혜택 제공: 불가능
              </p>
            </b-card>
          </div>
        </b-colxx>
      </b-row>

      <b-row class="mt-3">
        <b-colxx xxs="12">
          <div class="rounded">
            <b-card>
              <div class="d-flex justify-content-between align-items-center">
                <span class="card-text font-weight-semibold"
                  >보유중인 통통코인: {{ balance }} TTC</span
                >
                <span class="card-text font-weight-semibold"
                  >통통지갑: {{ user_data.wallet_addr }}</span
                >
              </div>
            </b-card>
          </div>
        </b-colxx>
      </b-row>

      <h2 class="mt-3">{{ $t("research.information") }}</h2>
      <b-row class="mt-2">
        <b-colxx xxs="12">
          <div class="rounded">
            <b-card>
              <b-form-group
                label-cols="2"
                horizontal
                :label="$t('research.title')"
              >
                <b-form-input v-model="data.title" required :disabled="isView"></b-form-input>
              </b-form-group>
              <b-form-group
                label-cols="2"
                horizontal
                :label="$t('research.duration')"
              >
                <div class="d-flex">
                  <b-datepicker
                    locale="ko-KR"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    }"
                    :min="today"
                    style="flex: 8; margin-right: 10px"
                    v-model="startDate"
                    :disabled="isView || data.isSetPeriodLater || (!data.isDraft && (data.status == 0 || data.status == 3))"
                    @change="onStartDateChanged()"
                  />
                  <b-input
                    type="number"
                    min="0"
                    max="23"
                    v-model="startHour"
                    style="flex: 2; margin-right: 10px"
                    :disabled="isView || data.isSetPeriodLater || (!data.isDraft && (data.status == 0 || data.status == 3))"
                    @change="onStartDateChanged()"
                  />
                  <b-input
                    type="number"
                    min="0"
                    max="59"
                    v-model="startMinute"
                    style="flex: 2; margin-right: 10px"
                    :disabled="isView || data.isSetPeriodLater || (!data.isDraft && (data.status == 0 || data.status == 3))"
                    @change="onStartDateChanged()"
                  />
                  <span class="span-center-text mx-2">~</span>
                  <b-datepicker
                    locale="ko-KR"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    }"
                    :min="startDate"
                    v-model="endDate"
                    style="flex: 8; margin-left: 10px"
                    :disabled="isView || data.isSetPeriodLater"
                    @change="onEndDateChanged()"
                  />
                  <b-input
                    type="number"
                    min="0"
                    max="23"
                    v-model="endHour"
                    style="flex: 2; margin-left: 10px"
                    :disabled="isView || data.isSetPeriodLater"
                    @change="onEndDateChanged()"
                  />
                  <b-input
                    type="number"
                    min="0"
                    max="59"
                    v-model="endMinute"
                    style="flex: 2; margin-left: 10px"
                    :disabled="isView || data.isSetPeriodLater"
                    @change="onEndDateChanged()"
                  />
                </div>
                <b-check class="col-3 mt-2" v-model="data.isSetPeriodLater" :disabled="isView || (!data.isDraft && (data.status == 0 || data.status == 3))">
                  {{ $t("research.isSetPeriodLater") }}
                </b-check>
              </b-form-group>
              <b-form-group label-cols="2" content-cols="4" label="썸네일">
                <!-- <b-img :src="image" /> -->
                <div class="d-flex">
                  <img
                    v-if="data.thumbnailUrl"
                    :src="downloadUrl + '/' + data.thumbnailUrl"
                    class-name="card-img"
                    style="
                      width: 200px;
                      height: 150px;
                      border: 1px solid #d7d7d7;
                      justify-content: center;
                      display: flex;
                    "
                    alt="이미지"
                    :key = thumbnailKey
                  />
                  <div v-else
                    style="
                      width: 200px;
                      height: 150px;
                      border: 1px solid #d7d7d7;
                      justify-content: center;
                      display: flex;
                    "
                  ></div>
                  <b-button
                    variant="primary"
                    class="ml-2"
                    style="height: 32px;"
                    @click="onClickSelectFile()"
                    :disabled="isView"
                    >이미지 업로드</b-button
                  >
                </div>
              </b-form-group>
              <b-form-group label-cols="2" content-cols="4" label="공개설정">
                <b-form-radio-group v-model="data.isPublic" >
                  <b-form-radio name="isPublic" :value="true">공개</b-form-radio>
                  <b-form-radio name="isPublic" :value="false">비공개</b-form-radio>
                </b-form-radio-group>
              </b-form-group>
            </b-card>
          </div>
        </b-colxx>
      </b-row>
    </b-form>
  </div>
</template>
<script>
import { apiUrl, downloadUrl } from "../../../../constants/config";

export default {
  props: ["data", "isView"],
  data() {
    return {
      startDate: null,
      startHour: 0,
      startMinute: 0,
      endDate: null,
      endHour: 0,
      endMinute: 0,
      downloadUrl: downloadUrl,
      thumbnailKey: "",
      today: new Date(),
      user_data: {},
      balance: 0,
      isPublic: true
    };
  },
  mounted() {
    this.getCoinBallance();
    this.user_data = JSON.parse(localStorage.getItem('user'));
    this.startDate = new Date(
      new Date(this.data.startAt).getFullYear(),
      new Date(this.data.startAt).getMonth(),
      new Date(this.data.startAt).getDate()
    );
    this.startHour = new Date(this.data.startAt).getHours();
    this.startMinute = new Date(this.data.startAt).getMinutes();
    this.endDate = new Date(
      new Date(this.data.endAt).getFullYear(),
      new Date(this.data.endAt).getMonth(),
      new Date(this.data.endAt).getDate()
    );
    this.endHour = new Date(this.data.endAt).getHours();
    this.endMinute = new Date(this.data.endAt).getMinutes();
    console.log('start = ', this.startDate);
    console.log('end = ', this.endDate);
    console.log('data = ', this.data);
  },
  methods: {
    setType(type) {
      if(this.isView) {
        this.addNotification("error filled", "설문유형 변경", "보기상태에서는 설문유형변경이 불가합니다.");
        return;
      }
      // if(this.data.status == 0 || this.data.status == 3) {
      //   this.addNotification("error filled", "설문유형 변경", "진행중/중지 상태의 설문은 설문유형변경이 불가합니다.");
      //   return;
      // }
      if(this.data.type == 0) {
        if(type == 1) {
          if(confirm('설문유형을 서베이로 변경합니다. 계속하시겠습니까?')) {
            this.data.type = type;
          }
        } else if(type == 2) {
          if(confirm('설문유형을 광고로 변경합니다. 본문을 제외한 모든 설정이 삭제됩니다. 계속하시겠습니까?')) {
            this.data.type = type;
            this.data.itemQuestion = {};
            this.data.itemFinish = {};
            this.data.itemResearcher = {};
          }
        }
      } else if(this.data.type == 1) {
        if(type == 0) {
          if(confirm('설문유형을 여론조사로 변경합니다. 설정하신 구매혜택은 삭제됩니다. 계속하시겠습니까?')) {
            this.data.type = type;
            this.itemFinish = {};
          }
        } else if(type == 2) {
          if(confirm('설문유형을 광고로 변경합니다. 본문을 제외한 모든 설정이 삭제됩니다. 계속하시겠습니까?')) {
            this.data.type = type;
            this.data.itemQuestion = {};
            this.data.itemFinish = {};
            this.data.itemResearcher = {};
          }
        }
      } else if(this.data.type == 2) {
        if(type == 0) {
          if(confirm('설문유형을 여론조사로 변경합니다. 설정하신 구매혜택은 삭제됩니다. 계속하시겠습니까?')) {
            this.data.type = type;
            this.itemFinish = {};
          }
        } else if(type == 1) {
          if(confirm('설문유형을 서베이로 변경합니다. 계속하시겠습니까?')) {
            this.data.type = type;
          }
        }
      }
    },
    onStartDateChanged() {
      this.data.startAt = new Date(this.startDate);
      this.data.startAt.setHours(this.startHour);
      this.data.startAt.setMinutes(this.startMinute);
      console.log(this.data);
    },
    onEndDateChanged() {
      this.data.endAt = new Date(this.endDate);
      this.data.endAt.setHours(this.endHour);
      this.data.endAt.setMinutes(this.endMinute);
    },
    onClickSelectFile() {
      let input = document.createElement('input');
      input.accept=".jpg, .jpeg, .png";
      input.type = 'file';
      var self = this;
      input.onchange = _ => {
        // you can use this method to get file and perform respective operations
        var formdata = new FormData();
        formdata.append("file", input.files[0]);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch(apiUrl + "/upload", requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result);
            self.data.thumbnailUrl = result.filename;
            self.thumbnailKey = result.filename;
          })
          .catch(error => console.log('error', error));
        
      };
      input.click();
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
          console.log('ballance info = ', result)
          this.balance = result.data.balance;
        })
        .catch(error => console.log('error', error));
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
    startDate(val) {
      this.data.startAt = new Date(val);
      this.data.startAt.setHours(this.startHour);
      this.data.startAt.setMinutes(this.startMinute);
    },
    endDate(val) {
      this.data.endAt = new Date(val);
      this.data.endAt.setHours(this.endHour);
      this.data.endAt.setMinutes(this.endMinute);
    }
  }
  // computed: {
  //   duration() {
  //     let ret = {
  //       startDate: new Date(
  //         this.data.startAt.getFullYear(),
  //         this.data.startAt.getMonth(),
  //         this.data.startAt.getDate()
  //       ),
  //       startHour: this.data.startAt.getHours(),
  //       startMinute: this.data.startAt.getMinutes(),
  //       endDate: new Date(
  //         this.data.endAt.getFullYear(),
  //         this.data.endAt.getMonth(),
  //         this.data.endAt.getDate()
  //       ),
  //       endHour: this.data.endAt.getHours(),
  //       endMinute: this.data.endAt.getMinutes(),
  //     };
  //     console.log(ret);
  //     return ret;
  //   },
  // },
};
</script>
<style scoped>
.description {
  padding: 12px;
  width: 100%;
  background-color: #fff2cc;
}
.card.active {
  box-shadow: 0 3px 10px rgb(237 113 23 / 50%), 0 3px 10px rgb(0 0 0 / 0%);
}
</style>