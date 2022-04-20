<template>
  <div class="mb-4">
    <h2 class="mt-2 cursor-pointer" @click="gotoHome()">{{ data.title }}</h2>
    <div class="d-flex align-itmes-center">
      <b-badge class="mb-1" variant="primary">{{
        typeOption[data.type]
      }}</b-badge>
      <span class="gray-text ml-2">설문지 ID: {{data._id}}</span>
    </div>

    <h3 class="mt-4" v-if="data.type != 'research'">{{ $t("research.benefits") }}</h3>
    <b-card v-if="data.type != 0">
      <b-form>
        <b-form-group
          :label="$t('research.benefitsDescription')"
          label-cols="2"
        >
          <quill-editor
            ref="refBenefitsDescription"
            :options="editorOption"
            v-model="data.itemFinish.benefitsDescription"
            :disabled="isView"
          >
          </quill-editor>
        </b-form-group>
        <b-form-group :label="$t('research.benefitsPeriod')" label-cols="2">
          <div class="d-flex">
            <b-datepicker
              locale="ko-KR"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              style="flex: 8; margin-right: 10px"
              v-model="startDate"
              :disabled="isView"
              @change="onStartDateChanged()"
            />
            <b-input
              type="number"
              min="0"
              max="23"
              v-model="startHour"
              style="flex: 2; margin-right: 10px"
              :disabled="isView"
              @change="onStartDateChanged()"
            />
            <b-input
              type="number"
              min="0"
              max="59"
              v-model="startMinute"
              style="flex: 2; margin-right: 10px"
              :disabled="isView"
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
              v-model="endDate"
              style="flex: 8; margin-left: 10px"
              :disabled="isView"
              @change="onEndDateChanged()"
            />
            <b-input
              type="number"
              min="0"
              max="23"
              v-model="endHour"
              style="flex: 2; margin-left: 10px"
              :disabled="isView"
              @change="onEndDateChanged()"
            />
            <b-input
              type="number"
              min="0"
              max="59"
              v-model="endMinute"
              style="flex: 2; margin-left: 10px"
              @change="onEndDateChanged()"
              :disabled="isView"
            />
          </div>
        </b-form-group>
        <b-form-group
          :label="$t('research.benefitsLink')"
          label-cols="2"
        >
          <b-form-input v-model="data.itemFinish.benefitsLink" :disabled="isView" />
        </b-form-group>
      </b-form>
    </b-card>
    <h3 class="mt-4">{{ $t("research.finish-text") }}</h3>
    <quill-editor
      ref="myTextEditor"
      :options="editorOption"
      v-model="data.itemFinish.content"
      :disabled="isView"
    >
    </quill-editor>
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
  props: ["data", "gotoHome", "isView"],
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
      typeOption: ["여론조사", "서베이", "광고"],
      startDate: null,
      startHour: 0,
      startMinute: 0,
      endDate: null,
      endHour: 0,
      endMinute: 0
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