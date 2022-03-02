<template>
  <div class="mb-4">
    <h2 class="mt-2 cursor-pointer" @click="gotoHome()">{{ data.title }}</h2>
    <div class="d-flex align-itmes-center">
      <b-badge class="mb-1" variant="primary">{{
        typeOption[data.type]
      }}</b-badge>
      <span class="gray-text ml-2">설문지 ID: {{data._id}}</span>
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
        :disabled="!!data.itemResearcher.condition"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.gender"
          :options="genderOptions"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="$t('research.age')"
        label-cols="2"
        :disabled="!!data.itemResearcher.condition"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.age"
          :options="ageOptions"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="$t('research.region')"
        label-cols="2"
        :disabled="!!data.itemResearcher.condition"
      >
        <div class="d-flex">
          <!-- <b-form-radio-group
            v-model="data.itemResearcher.region"
            :options="regionOptions"
          >
          </b-form-radio-group> -->
          <b-form-radio-group>
            <b-form-radio v-model="data.itemResearcher.region" name="region" value="0">무관</b-form-radio>
            <b-form-radio v-model="data.itemResearcher.region" name="region" value="1" style="padding-top: 8px;"></b-form-radio>
          </b-form-radio-group>
          <b-button class="primary" :disabled="data.itemResearcher.region == 0" v-b-modal.regionSelectModal>지역설정</b-button>
          <span style="margin-left: 12px; padding-top: 8px;">{{data.itemResearcher.regionList ? data.itemResearcher.regionList.length : 0}} 개 지역 설정됨</span>
          <b-modal id="regionSelectModal" ref="regionSelectModal" title="지역설정">
            <label class="text-center w-100">참여조건으로 설정할 지역을 선택해주세요.</label>
            <label class="text-center w-100">(선택한 지역의 회원만 참여 가능하도록 설정됩니다.)</label>
            <b-row class="region-content">
              <b-col colxx="6" class="list-container py-2">
                <div :class="'sido-item ' + (selectedSido == item ? 'active' : '')" v-for="item in sidoList" :key="item.code" @click="onClickRegion(item)">
                  <span>{{item.name}}</span>
                </div>
              </b-col>
              <b-col colxx="6" class="list-container py-2">
                <div :class="'gungu-item ' + (isSelectedGungu(item) >= 0 ? 'active' : '')" v-for="item in gunguList" :key="item.code" @click="onClickRegionGungu(item)">
                  <span>{{item.name}}</span>
                </div>
              </b-col>
            </b-row>
            <template slot="modal-footer">
              <b-button variant="primary" @click="onClickSelectRegion()">적용</b-button>
            </template>
          </b-modal>
        </div>
      </b-form-group>
      <b-form-group
        :label="$t('research.job')"
        label-cols="2"
        :disabled="!!data.itemResearcher.condition"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.job"
          :options="jobOptions"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="$t('research.education')"
        label-cols="2"
        :disabled="!!data.itemResearcher.condition"
      >
        <b-form-radio-group
          v-model="data.itemResearcher.education"
          :options="educationOptions"
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        :label="$t('research.salary')"
        label-cols="2"
        :disabled="!!data.itemResearcher.condition"
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
        <div class="d-flex">
          <b-form-radio-group
            class="d-flex align-items-center"
            v-model="data.itemResearcher.targetReplyCount"
            :options="targetReplyCountOptions"
          ></b-form-radio-group>
          <b-form-input class="w-10" v-show="data.itemResearcher.targetReplyCount" v-model="data.itemResearcher.targetReplyCount" />
        </div>
      </b-form-group>
    </b-form>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import axios from 'axios';

import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    "quill-editor": quillEditor,
  },
  props: ["data", "gotoHome"],
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
        { text: '', value: 1 },
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
      sidoList: [],
      selectedSido: null,
      gunguList: [],
      selectedGunguList: []
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

    if(this.data && this.data.itemResearcher.regionList) {
      this.data.itemResearcher.regionList.forEach(x => {
        this.selectedGunguList.push({
          code: x.sidoCode + x.gunguCode + '00000'
        })
      })
    }

    console.log('---------', this.selectedGunguList);

    axios.get("https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=*00000000")
      .then((result) => result.data)
      .then((data) => {
        console.log(data);
        this.sidoList = data.regcodes;
      })
      .catch((_error) => {
        console.log(_error);
      });
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
    onClickSelectRegion() {
      let list = this.selectedGunguList.filter(x => x.name != '전체');
      this.data.itemResearcher.regionList = list.map(x => {
        return {
          sidoCode: x.code.slice(0, 2),
          gunguCode: x.code.slice(2, 5)
        }
      })
    },
    onClickRegion(item) {
      this.selectedSido = item;
      this.sidoCode = this.selectedSido.code.slice(0, 2);
      console.log(this.sidoCode);
      axios.get("https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=" + this.sidoCode + "*000000")
      .then((result) => result.data)
      .then((data) => {
        console.log(data);
        this.gunguList = data.regcodes;
        this.gunguList.forEach((item, idx) => {
          if(idx == 0) {
            item.name = "전체";
          } else {
            item.name = item.name.split(' ')[1];
          }
        })
      })
      .catch((_error) => {
        console.log(_error);
      });
    },
    onClickRegionGungu(item) {
      if(item.name == '전체') {
        if(this.selectedGunguList.indexOf(item) >= 0) {
          this.gunguList.forEach(x => {
            let index = this.selectedGunguList.findIndex(y => y.code == x.code);
            if(index >= 0) { 
              this.selectedGunguList.splice(index, 1);
            } else {
              
            }
          })
        } else {
          this.gunguList.forEach(x => {
            let index = this.selectedGunguList.findIndex(y => y.code == x.code);
            if(index >= 0) { 

            } else {
              this.selectedGunguList.push(x);
            }
          })
        }
      } else {
        let index = this.selectedGunguList.findIndex(x => x.code == item.code);
        if(index >= 0) {
          this.selectedGunguList.splice(index, 1);
        } else {
          this.selectedGunguList.push(item);
        }
        let itemCnt = 0;
        this.gunguList.forEach((x, idx) => {
          if(idx != 0) {
            let index = this.selectedGunguList.findIndex(y => y.code == x.code);
            if(index >= 0) {
              itemCnt++;
            }
          }
        })
        if(itemCnt < this.gunguList.length - 1) {
          let index = this.selectedGunguList.findIndex(y => y.code == this.gunguList[0].code);
          if(index >= 0) {
            this.selectedGunguList.splice(index, 1);
          }
        } else {
          let index = this.selectedGunguList.findIndex(y => y.code == this.gunguList[0].code);
          if(index < 0) {
            this.selectedGunguList.push(this.gunguList[0]);
          }
        }
      }
      console.log(this.selectedGunguList);
      this.$forceUpdate();
    },
    isSelectedGungu(item) {
      let index = -1;
      this.selectedGunguList.forEach((gungu, idx) => {
        if(gungu.code == item.code) {
          index = idx;
        }
      })
      return index;
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
.region-content {
  height: 150px;
}
.list-container {
  overflow-y: auto;
  height: 150px;
  border: 1px solid #d7d7d7;
}
.sido-item {
  height: 20px;
}
.sido-item.active {
  background-color: #d7d7d7;
}
.gungu-item {
  height: 20px;
}
.gungu-item.active {
  background-color: #d7d7d7;
}
</style>