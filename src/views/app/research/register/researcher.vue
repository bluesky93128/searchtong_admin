<template>
  <div class="mb-4">
    <h2 class="mt-2">{{ data.title }}</h2>
    <div class="d-flex align-itmes-center">
      <b-badge class="mb-1" variant="primary">{{
        $t("research." + data.type)
      }}</b-badge>
      <span class="gray-text ml-2">설문지 ID: 516s51d6f5s1</span>
    </div>

    <b-form>
      <b-form-group
        :label="$t('research.participate-condition')"
        label-cols="2"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.condition"
          :options="conditionOptions"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="$t('research.gender')"
        label-cols="2"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.gender"
          :options="genderOptions"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="$t('research.age')"
        label-cols="2"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.age"
          :options="ageOptions"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="$t('research.region')"
        label-cols="2"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.region"
          :options="regionOptions"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="$t('research.job')"
        label-cols="2"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.job"
          :options="jobOptions"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="$t('research.education')"
        label-cols="2"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.education"
          :options="educationOptions"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="$t('research.salary')"
        label-cols="2"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.salary"
          :options="salaryOptions"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="$t('research.targetReplyCount')"
        label-cols="2"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.targetReplyCount"
          :options="targetReplyCountOptions"
        ></b-form-radio-group>
      </b-form-group>
    </b-form>
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
      conditionOptions: [
        { text: '있음', value: 0 },
        { text: '없음(조건없이 누구나 참여 가능)    ※광고는 참여조건 설정이 불가합니다.', value: 1 },
      ],
      genderOptions: [
        { text: '무관', value: 0 },
        { text: '남', value: 1 },
        { text: '여', value: 2 },
      ],
      ageOptions: [
        { text: '무관', value: 0 },
        { text: '18세 미만', value: 1 },
        { text: '18~29세', value: 2 },
        { text: '30대', value: 3 },
        { text: '40대', value: 4 },
        { text: '50대', value: 5 },
        { text: '60대', value: 6 },
        { text: '60대 이상', value: 7 },
      ],
      regionOptions: [
        { text: '무관', value: 0 },
        { text: '_', value: 1 },
      ],
      jobOptions: [
        { text: '무관', value: 0 },
      ],
      educationOptions: [
        { text: '무관', value: 0 },
      ],
      salaryOptions: [
        { text: '무관', value: 0 },
      ],
      targetReplyCountOptions: [
        { text: '제한없음', value: 0 },
        { text: '직접입력', value: 1 },
      ],
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