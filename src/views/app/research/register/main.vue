<template>
  <div class="mb-4">
    <p class="description">※설문유형을 선택해주세요.</p>
    <b-form>
      <b-row class="icon-cards-row mt-4">
        <b-colxx xxs="3">
          <div class="rounded">
            <b-card
              :class="`text-center ${data.type == 'research' ? 'active' : ''}`"
              @click="setType('research')"
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
              :class="`text-center ${data.type == 'survey' ? 'active' : ''}`"
              @click="setType('survey')"
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
              :class="`text-center ${
                data.type == 'advertisement' ? 'active' : ''
              }`"
              @click="setType('advertisement')"
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
                  >보유중인 통통코인: {{ data.coin }} TTC</span
                >
                <span class="card-text font-weight-semibold"
                  >통통지갑: {{ data.wallet_addr }}</span
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
                <b-form-input v-model="data.title" required></b-form-input>
              </b-form-group>
              <b-form-group
                label-cols="2"
                horizontal
                :label="$t('research.duration')"
              >
                <div class="d-flex">
                  <b-datepicker
                    locale="ko-KR"
                    :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                    style="flex: 8; margin-right: 10px"
                    v-model="startDate"
                    :disabled="data.isSetPeriodLater"
                    @change="onStartDateChanged()"
                  />
                  <b-input
                    type="number"
                    min="0"
                    max="23"
                    v-model="startHour"
                    style="flex: 2; margin-right: 10px"
                    :disabled="data.isSetPeriodLater"
                    @change="onStartDateChanged()"
                  />
                  <b-input
                    type="number"
                    min="0"
                    max="59"
                    v-model="startMinute"
                    style="flex: 2; margin-right: 10px"
                    :disabled="data.isSetPeriodLater"
                    @change="onStartDateChanged()"
                  />
                  <span class="span-center-text mx-2">~</span>
                  <b-datepicker
                    locale="ko-KR"
                    :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                    v-model="endDate"
                    style="flex: 8; margin-left: 10px"
                    :disabled="data.isSetPeriodLater"
                    @change="onEndDateChanged()"
                  />
                  <b-input
                    type="number"
                    min="0"
                    max="23"
                    v-model="endHour"
                    style="flex: 2; margin-left: 10px"
                    :disabled="data.isSetPeriodLater"
                    @change="onEndDateChanged()"
                  />
                  <b-input
                    type="number"
                    min="0"
                    max="59"
                    v-model="endMinute"
                    style="flex: 2; margin-left: 10px"
                    :disabled="data.isSetPeriodLater"
                    @change="onEndDateChanged()"
                  />
                </div>
                <b-check class="col-3 mt-2" v-model="data.isSetPeriodLater">
                  {{ $t("research.isSetPeriodLater") }}
                </b-check>
              </b-form-group>
            </b-card>
          </div>
        </b-colxx>
      </b-row>
    </b-form>
  </div>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {
      startDate: null,
      startHour: 0,
      startMinute: 0,
      endDate: null,
      endHour: 0,
      endMinute: 0
    }
  },
  methods: {
    setType(type) {
      this.data.type = type;
    },
    onStartDateChanged() {
      this.data.startAt = new Date(this.startDate);
      this.data.startAt.setHours(this.startHour);
      this.data.startAt.setMinutes(this.startMinute);
    },
    onEndDateChanged() {
      this.data.endAt = new Date(this.endDate);
      this.data.endAt.setHours(this.endHour);
      this.data.endAt.setMinutes(this.endMinute);
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
.description {
  padding: 12px;
  width: 100%;
  background-color: #fff2cc;
}
.card.active {
  box-shadow: 0 3px 10px rgb(237 113 23 / 50%), 0 3px 10px rgb(0 0 0 / 0%);
}
</style>