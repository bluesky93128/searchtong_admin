<template>
  <div class="mb-4">
    <h2 class="mt-2 cursor-pointer" @click="gotoHome()">{{ data.title }}</h2>
    <div class="d-flex align-itmes-center">
      <b-badge class="mb-1" variant="primary">{{
        typeOption[data.type]
      }}</b-badge>
      <span class="gray-text ml-2">설문지 ID: {{data._id}}</span>
      <span class="gray-text ml-4">작성자 ID: {{data.creatorPhone}}</span>
    </div>

    <b-row>
      <b-colxx xxs="7">
        <b-card>
          <div class="d-flex justify-content-between">
            <span>보유중인 통통코인: {{balance}} TTC</span>
            <span>통통지갑: {{user_data.wallet_addr}}</span>
          </div>
          <b-form-group
            label-cols="2"
            :label="$t('research.paymentMethod')"
            :disabled="isSetReward ? false : isView"
          >
            <b-form-radio-group
              v-model="data.itemReward.paymentMethod"
              :options="paymentOptions"
            ></b-form-radio-group>
          </b-form-group>
          <b-form-group
            label-cols="2"
            :label="$t('research.paymentCount')"
            :disabled="isSetReward ? false : isView"
          >
            <div class="d-flex align-items-center">
              <b-form-radio-group
                v-model="hasPaymentCount"
                :options="paymentCountOption"
                @change="onChangePaymentCount()"
              ></b-form-radio-group>
              <b-input class="ml-2 w-15" type="number" v-model="data.itemReward.paymentCount" @change="key++" :disabled="!hasPaymentCount" />
              <span class="ml-2">명</span>
            </div>
          </b-form-group>
          <b-form-group
            label-cols="2"
            :label="$t('research.paymentAmount')"
            :disabled="isSetReward ? false : isView"
          >
            <div class="d-flex align-items-center">
              <b-form-radio-group
                v-model="data.itemReward.paymentMethod"
                :options="paymentAmountOption"
              ></b-form-radio-group>
              <b-input class="ml-2 w-15" type="number" v-model="data.itemReward.paymentAmount" @change="key++" />
              <span class="ml-2">TTC</span>
            </div>
          </b-form-group>
        </b-card>
      </b-colxx>
      <b-colxx xxs="5">
        <b-card :title="$t('research.estimatePrice')" class="text-center" :key="key">
          <div class="d-flex justify-content-between">
            <span>{{$t('research.researchBudget')}}</span>
            <span>{{data.itemReward.paymentCount * data.itemReward.paymentAmount}}TTC</span>
          </div>
          <div class="d-flex justify-content-between mt-4">
            <span>{{$t('research.perPrice')}}</span>
            <span>{{data.itemReward.paymentAmount}}TTC</span>
          </div>
          <div class="d-flex justify-content-between mt-4">
            <span>{{$t('research.paymentCount')}}</span>
            <span>{{data.itemReward.paymentCount}} 명</span>
          </div>
          <div class="d-flex justify-content-between mt-4">
            <span>{{$t('research.researchBudget')}}</span>
            <span>{{data.itemReward.paymentCount * data.itemReward.paymentAmount}}TTC</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>{{$t('research.fee')}}</span>
            <span>{{formatNumber(data.itemReward.paymentCount * data.itemReward.paymentAmount * 0.1)}}TTC</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>{{$t('research.totalPrice')}}</span>
            <span>{{formatNumber(data.itemReward.paymentCount * data.itemReward.paymentAmount * 1.1)}}TTC</span>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { apiUrl } from "../../../../constants/config";

import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    "quill-editor": quillEditor,
  },
  props: ["data", "gotoHome", "isView", "isSetReward"],
  data() {
    return {
      key: 0,
      editorOption: {
        placeholder: "",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
          ],
        },
      },
      typeOption: ["여론조사", "서베이", "광고"],
      paymentOptions: [
        { text: '고정금액 지급', value: 0 },
      ],
      paymentCountOption: [
        { text: '코인소진시까지', value: 0 },
        { text: '총', value: 1 },
      ],
      paymentAmountOption: [
        { text: '1인당', value: 0 },
      ],
      user_data: {},
      balance: 0,
      hasPaymentCount: 0
    };
  },
  mounted() {
    this.getCoinBallance();
    this.user_data = JSON.parse(localStorage.getItem('user'));
    var startAt = new Date(this.data.itemFinish.benefitsStartAt);
    var endAt = new Date(this.data.itemFinish.benefitsEndAt);
    this.startDate = startAt;
    this.startHour = startAt.getHours();
    this.startMinute = startAt.getMinutes();
    this.endDate = endAt;
    this.endHour = endAt.getHours();
    this.endMinute = endAt.getMinutes();
    this.hasPaymentCount = this.data.itemReward.paymentCount > 0 ? 1 : 0;
  },
  methods: {
    onStartDateChanged() {
      if(this.isView) return;
      this.data.itemFinish.benefitsStartAt = new Date(this.startDate);
      this.data.itemFinish.benefitsStartAt.setHours(this.startHour);
      this.data.itemFinish.benefitsStartAt.setMinutes(this.startMinute);
    },
    onEndDateChanged() {
      if(this.isView) return;
      this.data.itemFinish.benefitsEndAt = new Date(this.endDate);
      this.data.itemFinish.benefitsEndAt.setHours(this.endHour);
      this.data.itemFinish.benefitsEndAt.setMinutes(this.endMinute);
    },
    formatNumber(num) {
      return num.toFixed(2);
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
    onChangePaymentCount() {
      console.log('hasPaymentCount = ', this.hasPaymentCount);
      if(this.hasPaymentCount == 1) {
        this.data.itemReward.paymentCount = 0;
      } else {
        this.data.itemReward.paymentCount = 1;
      }
      console.log(this.data.itemReward);
    }
  },
  computed: {
    duration() {
      return {
        startDate: new Date(
          this.data.startAt.getFullYear(),
          this.data.startAt.getMonth(),
          this.data.startAt.getDate()
        ),
        startHour: this.data.startAt.getHours(),
        startMinute: this.data.startAt.getMinutes(),
        endDate: new Date(
          this.data.endAt.getFullYear(),
          this.data.endAt.getMonth(),
          this.data.endAt.getDate()
        ),
        endHour: this.data.endAt.getHours(),
        endMinute: this.data.endAt.getMinutes(),
      };
    },
  },
};
</script>
<style scoped>
.gray-text {
  color: #d7d7d7;
  line-height: 24px;
}
</style>