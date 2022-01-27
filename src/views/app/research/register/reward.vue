<template>
  <div class="mb-4">
    <h2 class="mt-2">{{ data.title }}</h2>
    <div class="d-flex align-itmes-center">
      <b-badge class="mb-1" variant="primary">{{
        $t("research." + data.type)
      }}</b-badge>
      <span class="gray-text ml-2">설문지 ID: {{data._id}}</span>
    </div>

    <b-row>
      <b-colxx xxs="7">
        <b-card>
          <div class="d-flex justify-content-between">
            <span>보유중인 통통코인: {{}} TTC</span>
            <span>통통지갑: {{}}</span>
          </div>
          <b-form-group
            label-cols="2"
            :label="$t('research.paymentMethod')"
          >
            <b-form-radio-group
              v-model="data.itemReward.paymentMethod"
              :options="paymentOptions"
            ></b-form-radio-group>
          </b-form-group>
          <b-form-group
            label-cols="2"
            :label="$t('research.paymentCount')"
          >
            <div class="d-flex align-items-center">
              <b-form-radio-group
                :options="paymentCountOption"
              ></b-form-radio-group>
              <b-input class="ml-2 w-10" v-model="data.itemReward.paymentCount" />
              <span class="ml-2">명</span>
            </div>
          </b-form-group>
          <b-form-group
            label-cols="2"
            :label="$t('research.paymentAmount')"
          >
            <div class="d-flex align-items-center">
              <b-form-radio-group
                :options="paymentAmountOption"
              ></b-form-radio-group>
              <b-input class="ml-2 w-10" v-model="data.itemReward.paymentAmount" />
              <span class="ml-2">TTC</span>
            </div>
          </b-form-group>
        </b-card>
      </b-colxx>
      <b-colxx xxs="5">
        <b-card :title="$t('research.estimatePrice')" class="text-center">
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
            <span>{{data.itemReward.paymentCount}}TTC</span>
          </div>
          <div class="d-flex justify-content-between mt-4">
            <span>{{$t('research.researchBudget')}}</span>
            <span>{{data.itemReward.paymentCount * data.itemReward.paymentAmount}}TTC</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>{{$t('research.fee')}}</span>
            <span>{{data.itemReward.paymentCount * data.itemReward.paymentAmount * 0.1}}TTC</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>{{$t('research.totalPrice')}}</span>
            <span>{{data.itemReward.paymentCount * data.itemReward.paymentAmount * 1.1}}TTC</span>
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

import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    "quill-editor": quillEditor,
  },
  props: ["data"],
  data() {
    return {
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
      paymentOptions: [
        { text: '고정금액 지급', value: 0 },
      ],
      paymentCountOption: [
        { text: '총', value: 0 },
      ],
      paymentAmountOption: [
        { text: '1인당', value: 0 },
      ]
    };
  },
  mounted() {
    var startAt = new Date(this.data.itemFinish.benefitsStartAt);
    var endAt = new Date(this.data.itemFinish.benefitsEndAt);
    this.startDate = startAt;
    this.startHour = startAt.getHours();
    this.startMinute = startAt.getMinutes();
    this.endDate = endAt;
    this.endHour = endAt.getHours();
    this.endMinute = endAt.getMinutes();
  },
  methods: {
    onStartDateChanged() {
      this.data.itemFinish.benefitsStartAt = new Date(this.startDate);
      this.data.itemFinish.benefitsStartAt.setHours(this.startHour);
      this.data.itemFinish.benefitsStartAt.setMinutes(this.startMinute);
    },
    onEndDateChanged() {
      this.data.itemFinish.benefitsEndAt = new Date(this.endDate);
      this.data.itemFinish.benefitsEndAt.setHours(this.endHour);
      this.data.itemFinish.benefitsEndAt.setMinutes(this.endMinute);
    },
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