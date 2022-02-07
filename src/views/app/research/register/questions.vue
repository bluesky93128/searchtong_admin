<template>
  <div class="mb-4">
    <h2 class="mt-2">{{ data.title }}</h2>
    <div class="d-flex align-itmes-center">
      <b-badge class="mb-1" variant="primary">{{
        typeOption[data.type]
      }}</b-badge>
      <span class="gray-text ml-2">설문지 ID: {{data._id}}</span>
    </div>

    <b-row>
      <b-colxx xxs="4" class="body">
        <div class="content left">
          <h5 class="list-item">총 {{data.itemQuestion.length}}개 문항</h5>
          <draggable type="ul" class="list-unstyled" handle=".handle" v-model="data.itemQuestion" @change="log">
            <li v-for="item in data.itemQuestion" :key="item.order" class="list-item">
              <span class="handle mr-1"><i class="simple-icon-cursor-move" /></span>
              <span>{{item.title}}</span>
            </li>
          </draggable>
        </div>
      </b-colxx>
      <b-colxx xxs="8" class="body">
        <div class="content">
          <div v-for="(item, index) in data.itemQuestion" :key="item.order" class="content-item">
            <h5>Q{{item.order + 1}}</h5>
            <b-form-input placeholder="문항 내용을 입력하세요" v-model="item.title" />
            <b-form-group
              label="문항유형"
              label-cols="2"
              class="mt-2"
            >
              <b-form-radio-group
                v-model="item.type1"
                :options="type1Options"
              ></b-form-radio-group>
              <b-row v-if="item.type1 == 0">
                <b-colxx xxs="6">
                  <b-form-radio-group
                    v-model="item.type2"
                    :options="type2Options"
                  ></b-form-radio-group>
                </b-colxx>
                <b-colxx xxs="6" class="d-flex align-items-center">
                  <span class="mr-1">최소</span>
                  <b-input class="w-10" v-model="item.min" :disabled="item.type2==0" />
                  <span class="ml-1">개</span>
                  <span class="mx-2">~</span>
                  <span class="mr-1">최대</span>
                  <b-input class="w-10" v-model="item.max" :disabled="item.type2==0" />
                  <span class="ml-1">개</span>
                </b-colxx>
              </b-row>
            </b-form-group>
            <b-form-textarea v-model="item.answerGuide" placeholder="답변을 입력해주세요" />
            <b-form-group
              label="보기문항"
              label-cols="2"
               v-if="item.type1 == 0"
            >
              <b-form-radio-group
                v-model="item.viewType"
                :options="viewTypeOptions"
              ></b-form-radio-group>
            </b-form-group>
            <draggable v-if="item.type1 == 0" type="ul" class="list-unstyled" handle=".handle" v-model="data.itemQuestion[index].itemView" @change="log">
              <li v-for="(view, vIndex) in item.itemView" :key="view.order" class="view-item">
                <b-input-group class="mb-3 d-flex align-items-center">
                  <div class="view-handle handle">{{view.order + 1}}</div>
                  <b-form-input class="w-50" v-model="view.content"></b-form-input>
                  <b-form-select v-model="view.nextItemQuestionOrder" :options="['Option1', 'Option2','Option3','Option4']"  plain class="ml-2 mr-2" />
                  <span class="view-icon cursor-pointer mr-1" @click="onAddView(index)"><i class="simple-icon-plus" /></span>
                  <span class="view-icon cursor-pointer mr-1" @click="onCopyView(index, vIndex)"><i class="iconsminds-files" /></span>
                  <span class="view-icon cursor-pointer mr-1" @click="onDeleteView(index, vIndex)"><i class="iconsminds-close" /></span>
                </b-input-group>
              </li>
            </draggable>
            <ul v-if="item.type1 == 0" class="list-unstyled">
              <li v-for="(view, vIndex) in item.itemViewOther" :key="'other-' + view.order" class="view-item">
                <b-input-group class="mb-3 d-flex align-items-center">
                  <div class="view-other">기타 {{view.order + 1}}</div>
                  <b-form-input class="w-50" v-model="view.content"></b-form-input>
                  <b-form-select v-model="view.nextItemQuestionOrder" :options="['Option1', 'Option2','Option3','Option4']"  plain class="ml-2 mr-2" />
                  <span class="view-icon cursor-pointer mr-1" @click="onAddViewOther(index)"><i class="simple-icon-plus" /></span>
                  <span class="view-icon cursor-pointer mr-1" @click="onCopyViewOther(index, vIndex)"><i class="iconsminds-files" /></span>
                  <span class="view-icon cursor-pointer mr-1" @click="onDeleteViewOther(index, vIndex)"><i class="iconsminds-close" /></span>
                </b-input-group>
              </li>
            </ul>
            <a v-if="item.type1 == 0" class="cursor-pointer" @click="onAddViewOther(index)">기타보기 추가</a>
            <span v-if="item.type1 == 0" class="gray-text">※기타보기는 보기섞기 선택 시에도 순서가 변경되지 않습니다</span>
            <div class="divider my-2"></div>
            <div class="d-flex justify-content-between">
              <div class="d-flex align-items-center">
                <p>필수답변</p>
                <switches v-model="item.isRequireAnswer" theme="custom" color="primary-inverse" class="vue-switcher ml-2 mr-4"></switches>
                <p v-if="item.type1 == 0">보기섞기</p>
                <switches v-if="item.type1 == 0" v-model="item.isRequireMix" theme="custom" color="primary-inverse" class="vue-switcher ml-2 mr-4"></switches>
                <p v-if="item.type1 == 0">기타보기유지</p>
                <switches v-if="item.type1 == 0" v-model="item.isKeedExtraView" theme="custom" color="primary-inverse" class="vue-switcher ml-2 mr-4"></switches>
              </div>
              <div class="d-flex align-items-center">
                <span class="item-icon cursor-pointer mr-2" @click="onAddItem()"><i class="simple-icon-plus" /></span>
                <span class="item-icon cursor-pointer mr-2" @click="onCopyItem(index)"><i class="iconsminds-files" /></span>
                <span class="item-icon cursor-pointer mr-2" @click="onDeleteItem(index)"><i class="iconsminds-close" /></span>
              </div>
            </div>
          </div>
        </div>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import Draggable from "vuedraggable";
import Switches from "vue-switches";

import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    "draggable" : Draggable,
    "quill-editor": quillEditor,
    switches: Switches
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
      startDate: null,
      startHour: 0,
      startMinute: 0,
      endDate: null,
      endHour: 0,
      endMinute: 0,
      typeOption: ["여론조사", "서베이", "광고"],
      type1Options: [
        { text: '객관식', value: 0 },
        { text: '주관식', value: 1 },
      ],
      type2Options: [
        { text: '단일응답', value: 0 },
        { text: '다중응답', value: 1 },
      ],
      viewTypeOptions: [
        { text: '텍스트', value: 0 },
        { text: '이미지', value: 1 },
      ],
    };
  },
  mounted() {
    var startAt = new Date(this.data.itemText.benefitsStartAt);
    var endAt = new Date(this.data.itemText.benefitsEndAt);
    this.startDate = startAt;
    this.startHour = startAt.getHours();
    this.startMinute = startAt.getMinutes();
    this.endDate = endAt;
    this.endHour = endAt.getHours();
    this.endMinute = endAt.getMinutes();
  },
  methods: {
    onStartDateChanged() {
      this.data.itemText.benefitsStartAt = new Date(this.startDate);
      this.data.itemText.benefitsStartAt.setHours(this.startHour);
      this.data.itemText.benefitsStartAt.setMinutes(this.startMinute);
    },
    onEndDateChanged() {
      this.data.itemText.benefitsEndAt = new Date(this.endDate);
      this.data.itemText.benefitsEndAt.setHours(this.endHour);
      this.data.itemText.benefitsEndAt.setMinutes(this.endMinute);
    },
    log() {
      console.log(this.data.itemQuestion);
    },
    onAddView(index) {
      this.data.itemQuestion[index].itemView.push({
        content: "",
        nextItemQuestionOrder: 1,
        order: this.data.itemQuestion[index].itemView.length
      });
    },
    onCopyView(index, vIndex) {
      var temp = {...this.data.itemQuestion[index].itemView[vIndex]};
      temp.order = this.data.itemQuestion[index].itemView.length;
      this.data.itemQuestion[index].itemView.push(temp);
    },
    onDeleteView(index, vIndex) {
      this.data.itemQuestion[index].itemView.splice(vIndex, 1);
      this.data.itemQuestion[index].itemView.forEach((item, i) => {
        item.order = i;
      });
    },
    onAddViewOther(index) {
      console.log('other view add');
      if (!this.data.itemQuestion[index].itemViewOther) {
        this.data.itemQuestion[index].itemViewOther = [];
      }
      this.data.itemQuestion[index].itemViewOther.push({
        content: "",
        nextItemQuestionOrder: 1,
        order: this.data.itemQuestion[index].itemViewOther.length
      });
      this.$forceUpdate();
    },
    onCopyViewOther(index, vIndex) {
      var temp = {...this.data.itemQuestion[index].itemViewOther[vIndex]};
      temp.order = this.data.itemQuestion[index].itemViewOther.length;
      this.data.itemQuestion[index].itemView.push(temp);
      this.$forceUpdate();
    },
    onDeleteViewOther(index, vIndex) {
      this.data.itemQuestion[index].itemViewOther.splice(vIndex, 1);
      this.data.itemQuestion[index].itemViewOther.forEach((item, i) => {
        item.order = i;
      });
      this.$forceUpdate();
    },
    onAddItem() {
      this.data.itemQuestion.push({
        order: this.data.itemQuestion.length,
        title: "",
        answerGuide: "",
        type1: 0,
        type2: 0,
        min: 1,
        max: 1,
        viewType: 0,
        itemView: [
          {
            order: 0,
            content: "",
            nextItemQuestionOrder: 1,
            imageLinks: [""],
            isMain: true,
          }
        ],
        isRequireAnswer: true,
        isRequireMix: false,
        isKeedExtraView: true,

      });
      this.$forceUpdate();
    },
    onCopyItem(index) {
      var temp = {...this.data.itemQuestion[index]};
      temp.order = this.data.itemQuestion.length;
      this.data.itemQuestion.push(temp);
      this.$forceUpdate();
    },
    onDeleteItem(index) {
      this.data.itemQuestion.splice(index, 1);
      this.data.itemQuestion.forEach((item, i) => {
        item.order = i;
      });
      this.$forceUpdate();
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
.body {
  height: 400px;
}
.content {
  height: 100%;
  overflow-y: auto;
  padding: 5px;
}
.content.left {
  border-radius: 5px;
  box-shadow: 0 0 5px -1px;
}
.list-item {
  padding: 10px;
  border-bottom: 1px solid #c1c1c1;
  display: flex;
  align-content: center;
  margin: 0;
}
.content-item {
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 5px -1px;
  margin-bottom: 10px;
}
.view-handle {
  background-image: url('/assets/img/handle.png');
  background-repeat: no-repeat;
  background-size: 16px;
  width: 70px;
  border: 1px solid #d7d7d7;
  background-color: #e9ecef;
  text-align: right;
  padding: 7px;
}
.view-other {
  width: 70px;
  border: 1px solid #d7d7d7;
  background-color: #e9ecef;
  text-align: right;
  padding: 7px;
}
.view-icon {
  font-size: 18px;
}
.item-icon {
  font-size: 24px;
}
.cursor-pointer {
  cursor: pointer;
}
.divider {
  width: 100%;
  height: 1px;
  background-color: #c1c1c1;
}
</style>