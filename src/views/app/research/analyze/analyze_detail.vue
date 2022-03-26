<template>
  <div>
    <div class="loader-container" v-show="isLoading">
      <div class="loader"></div>
    </div>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-row class="mb-4 align-items-center">
            <b-badge class="mb-1" variant="primary">{{
              typeOption[data.type]
            }}</b-badge>
            <span class="gray-text ml-2">설문지 ID: {{ data._id }}</span>
          </b-row>
          <b-row class="mb-2">
            <h3 class="ml-4">{{ data.title }}</h3>
          </b-row>
          <b-row>
            <b-col xxs="4">
              <span>시작: {{ formatDateWithMin(data.startAt) }}</span>
            </b-col>
            <b-col xxs="4">
              <span>종료: {{ formatDateWithMin(data.endAt) }}</span>
            </b-col>
            <b-col xxs="4">
              <span
                >응답자수:
                {{
                  data.attendCount +
                    "/" +
                    (data.itemReward
                      ? data.itemReward.paymentCount
                      : "설정되지 않음")
                }}</span
              >
            </b-col>
            <b-col xxs="4">
              <!-- <span>{{data.itemReward ? '응답비용:' + data.responseCost + '/' +  (data.itemReward.paymentCount * data.itemReward.paymentAmount) : '설정되지 않음'}}</span> -->
              <span>응답비용: {{ data.responseCost }}</span>
            </b-col>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <div class="button-container">
          <b-button class="primary">주관식 답변 내보내기</b-button>
          <b-button class="primary ml-2">전체결과 내보내기</b-button>
        </div>
        <b-card
          class="mb-4"
          no-body
          v-if="analyticsData && analyticsData.respondentCharacteristics && data.attendCount"
        >
          <b-tabs card no-fade>
            <b-tab title="분석" active>
              <h4>응답자특성</h4>
              <b-table-simple small responsive class="text-center">
                <b-thead head-variant="dark">
                  <b-tr>
                    <b-th colspan="4" rowspan="2" class="main-header"
                      >구분</b-th
                    >
                    <b-th colspan="2" class="main-header"
                      >조사완료 응답자수</b-th
                    >
                    <b-th class="main-header">목표응답자수</b-th>
                  </b-tr>
                  <b-tr>
                    <b-th class="sub-header">사례수(명)</b-th>
                    <b-th class="sub-header">비율(%)</b-th>
                    <b-th class="sub-header">사례수(명)</b-th>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr>
                    <b-td colspan="4" class="item-header">전체</b-td>
                    <b-td>{{
                      analyticsData.respondentCharacteristics.totalReplies
                    }}</b-td>
                    <b-td>100%</b-td>
                    <b-td :rowspan="calcTotalRows()">{{
                      data.itemResearcher.targetReplyCount == 0
                        ? "제한없음"
                        : data.itemResearcher.targetReplyCount
                    }}</b-td>
                  </b-tr>
                  <b-tr>
                    <b-td rowspan="2" class="item-header">성별</b-td>
                    <b-td colspan="3" class="subitem-header">남성</b-td>
                    <b-td>{{
                      analyticsData.respondentCharacteristics.bySex.male
                    }}</b-td>
                    <b-td
                      >{{
                        (analyticsData.respondentCharacteristics.bySex.male /
                          analyticsData.respondentCharacteristics
                            .totalReplies) *
                          100
                      }}%</b-td
                    >
                  </b-tr>
                  <b-tr>
                    <b-td colspan="3" class="subitem-header">여성</b-td>
                    <b-td>{{
                      analyticsData.respondentCharacteristics.bySex.female
                    }}</b-td>
                    <b-td
                      >{{
                        (analyticsData.respondentCharacteristics.bySex.female /
                          analyticsData.respondentCharacteristics
                            .totalReplies) *
                          100
                      }}%</b-td
                    >
                  </b-tr>
                  <b-tr>
                    <b-td rowspan="7" class="item-header">연령</b-td>
                    <b-td colspan="3" class="subitem-header">18세 이하</b-td>
                    <b-td>{{
                      analyticsData.respondentCharacteristics.byAge.byAge10
                    }}</b-td>
                    <b-td
                      >{{
                        (analyticsData.respondentCharacteristics.byAge.byAge10 /
                          analyticsData.respondentCharacteristics
                            .totalReplies) *
                          100
                      }}%</b-td
                    >
                  </b-tr>
                  <b-tr>
                    <b-td colspan="3" class="subitem-header"
                      >18세 이상 ~ 29세 이하</b-td
                    >
                    <b-td>{{
                      analyticsData.respondentCharacteristics.byAge.byAge20
                    }}</b-td>
                    <b-td
                      >{{
                        (analyticsData.respondentCharacteristics.byAge.byAge20 /
                          analyticsData.respondentCharacteristics
                            .totalReplies) *
                          100
                      }}%</b-td
                    >
                  </b-tr>
                  <b-tr>
                    <b-td colspan="3" class="subitem-header">30대</b-td>
                    <b-td>{{
                      analyticsData.respondentCharacteristics.byAge.byAge30
                    }}</b-td>
                    <b-td
                      >{{
                        (analyticsData.respondentCharacteristics.byAge.byAge30 /
                          analyticsData.respondentCharacteristics
                            .totalReplies) *
                          100
                      }}%</b-td
                    >
                  </b-tr>
                  <b-tr>
                    <b-td colspan="3" class="subitem-header">40대</b-td>
                    <b-td>{{
                      analyticsData.respondentCharacteristics.byAge.byAge40
                    }}</b-td>
                    <b-td
                      >{{
                        (analyticsData.respondentCharacteristics.byAge.byAge40 /
                          analyticsData.respondentCharacteristics
                            .totalReplies) *
                          100
                      }}%</b-td
                    >
                  </b-tr>
                  <b-tr>
                    <b-td colspan="3" class="subitem-header">50대</b-td>
                    <b-td>{{
                      analyticsData.respondentCharacteristics.byAge.byAge50
                    }}</b-td>
                    <b-td
                      >{{
                        (analyticsData.respondentCharacteristics.byAge.byAge50 /
                          analyticsData.respondentCharacteristics
                            .totalReplies) *
                          100
                      }}%</b-td
                    >
                  </b-tr>
                  <b-tr>
                    <b-td colspan="3" class="subitem-header">60대</b-td>
                    <b-td>{{
                      analyticsData.respondentCharacteristics.byAge.byAge60
                    }}</b-td>
                    <b-td
                      >{{
                        (analyticsData.respondentCharacteristics.byAge.byAge60 /
                          analyticsData.respondentCharacteristics
                            .totalReplies) *
                          100
                      }}%</b-td
                    >
                  </b-tr>
                  <b-tr>
                    <b-td colspan="3" class="subitem-header">70대 이상</b-td>
                    <b-td>{{
                      analyticsData.respondentCharacteristics.byAge.byAge70
                    }}</b-td>
                    <b-td
                      >{{
                        (analyticsData.respondentCharacteristics.byAge.byAge60 /
                          analyticsData.respondentCharacteristics
                            .totalReplies) *
                          100
                      }}%</b-td
                    >
                  </b-tr>
                  <b-tr>
                    <b-td :rowspan="calcTotalRegionCount()" class="item-header"
                      >지역</b-td
                    >
                  </b-tr>
                  <template
                    v-for="region in Object.keys(
                      analyticsData.respondentCharacteristics.byRegion
                    )"
                  >
                    <b-tr :key="region">
                      <b-td
                        :rowspan="calcRegionCount(region)"
                        class="subitem-header"
                        >{{ region }}</b-td
                      >
                    </b-tr>
                    <template v-for="sido in Object.keys(analyticsData.respondentCharacteristics.byRegion[region])">
                      <b-tr :key="sido">
                        <b-td :rowspan="calcDongCount(region, sido)">{{ sido }}</b-td>
                      </b-tr>
                      <b-tr
                        v-for="dong in Object.keys(analyticsData.respondentCharacteristics.byRegion[region][sido])" :key="dong"
                      >
                        <b-td>{{ dong }}</b-td>
                        <b-td>{{
                          analyticsData.respondentCharacteristics.byRegion[
                            region
                          ][sido][dong]
                        }}</b-td>
                        <b-td
                          >{{
                            (analyticsData.respondentCharacteristics.byRegion[
                              region
                            ][sido][dong] /
                              analyticsData.respondentCharacteristics
                                .totalReplies) *
                              100
                          }}%</b-td
                        >
                      </b-tr>
                    </template>
                  </template>
                </b-tbody>
                <b-tfoot>
                  <b-tr> </b-tr>
                </b-tfoot>
              </b-table-simple>
              <h4 class="mt-4">응답개수</h4>
              <b-table-simple
                small
                responsive
                class="text-center"
                v-if="analyticsData"
              >
                <b-thead head-variant="dark">
                  <b-tr>
                    <b-th rowspan="2" class="main-header">구분</b-th>
                    <b-th :colspan="getMaxViewitems() + 1" class="main-header"
                      >보기문항</b-th
                    >
                    <b-th :colspan="getMaxOtherViewitems()" v-if="getMaxOtherViewitems()" class="main-header"
                      >기타문항</b-th
                    >
                    <b-th rowspan="2" class="main-header">합계</b-th>
                  </b-tr>
                  <b-tr>
                    <b-th class="sub-header">주관식</b-th>
                    <b-th
                      v-for="index in getMaxViewitems()"
                      :key="index"
                      class="sub-header"
                      >{{ index }}</b-th
                    >
                    <b-th
                      v-for="index in getMaxOtherViewitems()"
                      :key="index"
                      class="sub-header"
                      >{{ index }}</b-th
                    >
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr
                    v-for="(item, index) in analyticsData.itemQuestionDetails"
                    :key="item.itemQuestionId"
                  >
                    <b-td class="item-header">Q{{ index + 1 }}</b-td>
                    <b-td>{{ getSubjectiveDetailCount(item) }}</b-td>
                    <b-td
                      v-for="subIndex in getMaxViewitems()"
                      :key="'sub-' + subIndex"
                      >{{ getDetailCount(item, subIndex - 1) }}</b-td
                    >
                    <b-td
                      v-for="subIndex in getMaxOtherViewitems()"
                      :key="'other-sub-' + subIndex"
                      >{{ getOtherDetailCount(item, subIndex - 1) }}</b-td
                    >
                    <b-td>{{
                      item.respondentCharacteristics ? item.respondentCharacteristics.totalReplies : 0
                    }}</b-td>
                  </b-tr>
                </b-tbody>
                <b-tfoot>
                  <b-tr> </b-tr>
                </b-tfoot>
              </b-table-simple>
            </b-tab>
            <b-tab title="리포트">
              <b-tabs no-fade>
                <template
                  v-for="(item, index) in analyticsData.itemQuestionDetails"
                >
                  <b-tab :title="'Q' + (index + 1)" :key="item.itemQuestionId">
                    <div class="question-container">
                      <div class="question-title">
                        <span
                          >Q{{ index + 1 }} :
                          {{ getQuestion(item).title }}</span
                        >
                      </div>
                      <div class="question-body">
                        <b-row v-if="getQuestion(item).type1 == 0">
                          <b-colxx xxs="10">
                            <template
                              v-for="(subItem, subIndex) in getQuestionItems(
                                item
                              )"
                            >
                              <b-row :key="subItem._id">
                                <b-colxx xxs="3">
                                  {{ subIndex + 1 }}. {{ subItem.content }}
                                </b-colxx>
                                <b-colxx xxs="5">
                                  <div
                                    class="count-bar"
                                    :style="
                                      'width: ' +
                                        (getItemCount(item, subIndex) /
                                          item.respondentCharacteristics
                                            .totalReplies) *
                                          100 +
                                        '%'
                                    "
                                  ></div>
                                </b-colxx>
                                <b-colxx xxs="2" class="text-center">
                                  {{
                                    (getItemCount(item, subIndex) /
                                      item.respondentCharacteristics
                                        .totalReplies) *
                                      100
                                  }}%
                                </b-colxx>
                                <b-colxx xxs="2" class="text-center">
                                  ({{ getItemCount(item, subIndex) }}명)
                                </b-colxx>
                              </b-row>
                            </template>
                          </b-colxx>
                          <b-colxx xxs="2" class="align-items-center">
                            <div>
                              <span>총 응답자</span>
                              <span>{{
                                item.respondentCharacteristics.totalReplies
                              }}</span>
                            </div>
                          </b-colxx>
                          <b-colxx xxs="5" class="mt-4">
                            <doughnut-chart
                              :data="doughnutChartData[index]"
                              containerClass="chart-container"
                            />
                          </b-colxx>
                          <b-colxx xxs="7" class="mt-4">
                            <bar-chart
                              :data="barChartData[index]"
                              shadow
                              containerClass="chart-container"
                            />
                          </b-colxx>
                        </b-row>
                        <b-table-simple
                          small
                          responsive
                          class="text-center"
                          v-if="getQuestion(item).type1 == 1"
                        >
                          <b-thead>
                            <b-tr>
                              <b-td>유저ID</b-td>
                              <b-td>참여일</b-td>
                              <b-td>답변내용</b-td>
                            </b-tr>
                          </b-thead>
                          <b-tbody>
                            <b-tr
                              v-for="answer in item.subjectiveDetails"
                              :key="answer._id"
                            >
                              <b-td>{{ answer.userId }}</b-td>
                              <b-td>{{
                                formatDateWithMin(answer.createdAt)
                              }}</b-td>
                              <b-td>{{ answer.answerText }}</b-td>
                            </b-tr>
                          </b-tbody>
                        </b-table-simple>
                      </div>
                    </div>

                    <b-table-simple v-if="getQuestion(item).type1 == 0" small responsive class="text-center mt-4">
                      <b-thead head-variant="dark">
                        <b-tr>
                          <b-th colspan="4" class="main-header">구분</b-th>
                          <b-th class="main-header">응답자수</b-th>
                          <b-th
                            class="main-header"
                            v-for="(item, i) in item.itemViewDetails"
                            :key="i"
                            >보기문항 {{ i+1 }}</b-th
                          >
                          <b-th
                            class="main-header"
                            v-for="(item, i) in item.itemViewOtherDetails"
                            :key="i"
                            >기타문항 {{ i+1 }}</b-th
                          >
                        </b-tr>
                      </b-thead>
                      <b-tbody>
                        <b-tr>
                          <b-td colspan="4" class="item-header">전체</b-td>
                          <b-td>{{
                            item.respondentCharacteristics.totalReplies
                          }}</b-td>
                          <!-- <b-td :rowspan="calcTotalRows()">{{data.itemResearcher.targetReplyCount == 0 ? '제한없음' : data.itemResearcher.targetReplyCount}}</b-td> -->
                          <b-td
                            v-for="(detailItem, i) in item.itemViewDetails"
                            :key="i"
                            >{{ (detailItem.respondentCharacteristics? detailItem.respondentCharacteristics.totalReplies : 0) / item.respondentCharacteristics.totalReplies * 100}} %</b-td
                          >
                          <b-td
                            v-for="(detailItem, i) in item.itemViewOtherDetails"
                            :key="i"
                            >{{ (detailItem.respondentCharacteristics? detailItem.respondentCharacteristics.totalReplies : 0) / item.respondentCharacteristics.totalReplies * 100}} %</b-td
                          >
                        </b-tr>
                        <b-tr>
                          <b-td rowspan="2" class="item-header">성별</b-td>
                          <b-td colspan="3" class="subitem-header">남성</b-td>
                          <b-td>{{item.respondentCharacteristics ? item.respondentCharacteristics.bySex.male : 0}}</b-td>
                          <b-td v-for="detailItem in item.itemViewDetails">{{((detailItem.respondentCharacteristics? detailItem.respondentCharacteristics.bySex.male : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                          <b-td v-for="detailItem in item.itemViewOtherDetails">{{((detailItem.respondentCharacteristics ? detailItem.respondentCharacteristics.bySex.male : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                        </b-tr>
                        <b-tr>
                          <b-td colspan="3" class="subitem-header">여성</b-td>
                          <b-td>{{item.respondentCharacteristics ? item.respondentCharacteristics.bySex.female : 0}}</b-td>
                          <b-td v-for="detailItem in item.itemViewDetails">{{((detailItem.respondentCharacteristics? detailItem.respondentCharacteristics.bySex.female : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                          <b-td v-for="detailItem in item.itemViewOtherDetails">{{((detailItem.respondentCharacteristics ? detailItem.respondentCharacteristics.bySex.female : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                        </b-tr>
                        <b-tr>
                          <b-td rowspan="7" class="item-header">연령</b-td>
                          <b-td colspan="3" class="subitem-header">18세 이하</b-td>
                          <b-td>{{item.respondentCharacteristics ? item.respondentCharacteristics.byAge.byAge10 : 0}}</b-td>
                          <b-td v-for="detailItem in item.itemViewDetails">{{((detailItem.respondentCharacteristics? detailItem.respondentCharacteristics.byAge.byAge10 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                          <b-td v-for="detailItem in item.itemViewOtherDetails">{{((detailItem.respondentCharacteristics ? detailItem.respondentCharacteristics.byAge.byAge10 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                        </b-tr>

                        <b-tr>
                          <b-td colspan="3" class="subitem-header">18세 이상 ~ 29세 이하</b-td>
                          <b-td>{{item.respondentCharacteristics ? item.respondentCharacteristics.byAge.byAge10 : 0}}</b-td>
                          <b-td v-for="detailItem in item.itemViewDetails">{{((detailItem.respondentCharacteristics? detailItem.respondentCharacteristics.byAge.byAge20 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                          <b-td v-for="detailItem in item.itemViewOtherDetails">{{((detailItem.respondentCharacteristics ? detailItem.respondentCharacteristics.byAge.byAge20 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                        </b-tr>

                        <b-tr>
                          <b-td colspan="3" class="subitem-header">30대</b-td>
                          <b-td>{{item.respondentCharacteristics ? item.respondentCharacteristics.byAge.byAge10 : 0}}</b-td>
                          <b-td v-for="detailItem in item.itemViewDetails">{{((detailItem.respondentCharacteristics? detailItem.respondentCharacteristics.byAge.byAge30 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                          <b-td v-for="detailItem in item.itemViewOtherDetails">{{((detailItem.respondentCharacteristics ? detailItem.respondentCharacteristics.byAge.byAge30 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                        </b-tr>

                        <b-tr>
                          <b-td colspan="3" class="subitem-header">40대</b-td>
                          <b-td>{{item.respondentCharacteristics ? item.respondentCharacteristics.byAge.byAge10 : 0}}</b-td>
                          <b-td v-for="detailItem in item.itemViewDetails">{{((detailItem.respondentCharacteristics? detailItem.respondentCharacteristics.byAge.byAge40 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                          <b-td v-for="detailItem in item.itemViewOtherDetails">{{((detailItem.respondentCharacteristics ? detailItem.respondentCharacteristics.byAge.byAge40 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                        </b-tr>

                        <b-tr>
                          <b-td colspan="3" class="subitem-header">50대</b-td>
                          <b-td>{{item.respondentCharacteristics ? item.respondentCharacteristics.byAge.byAge10 : 0}}</b-td>
                          <b-td v-for="detailItem in item.itemViewDetails">{{((detailItem.respondentCharacteristics? detailItem.respondentCharacteristics.byAge.byAge50 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                          <b-td v-for="detailItem in item.itemViewOtherDetails">{{((detailItem.respondentCharacteristics ? detailItem.respondentCharacteristics.byAge.byAge50 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                        </b-tr>

                        <b-tr>
                          <b-td colspan="3" class="subitem-header">60대</b-td>
                          <b-td>{{item.respondentCharacteristics ? item.respondentCharacteristics.byAge.byAge10 : 0}}</b-td>
                          <b-td v-for="detailItem in item.itemViewDetails">{{((detailItem.respondentCharacteristics? detailItem.respondentCharacteristics.byAge.byAge60 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                          <b-td v-for="detailItem in item.itemViewOtherDetails">{{((detailItem.respondentCharacteristics ? detailItem.respondentCharacteristics.byAge.byAge60 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                        </b-tr>

                        <b-tr>
                          <b-td colspan="3" class="subitem-header">70대 이상</b-td>
                          <b-td>{{item.respondentCharacteristics ? item.respondentCharacteristics.byAge.byAge10 : 0}}</b-td>
                          <b-td v-for="detailItem in item.itemViewDetails">{{((detailItem.respondentCharacteristics? detailItem.respondentCharacteristics.byAge.byAge70 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                          <b-td v-for="detailItem in item.itemViewOtherDetails">{{((detailItem.respondentCharacteristics ? detailItem.respondentCharacteristics.byAge.byAge70 : 0) / item.respondentCharacteristics.totalReplies) * 100}}%</b-td>
                        </b-tr>
                        
                        <b-tr>
                          <b-td
                            :rowspan="calcTotalRegionCount()"
                            class="item-header"
                            >지역</b-td
                          >
                        </b-tr>
                        <template v-for="region in Object.keys(item.respondentCharacteristics.byRegion)">
                          <b-tr :key="region">
                            <b-td
                              :rowspan="calcRegionCount(region)"
                              class="subitem-header"
                            >
                              {{ region }}
                            </b-td>
                          </b-tr>
                          <template v-for="sido in Object.keys(item.respondentCharacteristics.byRegion[region])">
                            <b-tr :key="sido">
                              <b-td :rowspan="calcDongCount(region, sido)">{{ sido }}</b-td>
                            </b-tr>
                            <b-tr v-for="dong in Object.keys(item.respondentCharacteristics.byRegion[region][sido])" :key="dong">
                              <b-td>{{dong}}</b-td>
                              <b-td>{{item.respondentCharacteristics.byRegion[region][sido][dong]}}</b-td>
                              <b-td v-for="detailItem in item.itemViewDetails">
                                {{((detailItem.respondentCharacteristics.byRegion[region] && detailItem.respondentCharacteristics.byRegion[region][sido] ? detailItem.respondentCharacteristics.byRegion[region][sido][dong] : 0) /item.respondentCharacteristics.totalReplies) *100}}%
                              </b-td>
                              <b-td v-for="detailItem in item.itemViewOtherDetails">
                                {{((detailItem.respondentCharacteristics.byRegion[region] && detailItem.respondentCharacteristics.byRegion[region][sido] ? detailItem.respondentCharacteristics.byRegion[region][sido][dong] : 0) /item.respondentCharacteristics.totalReplies) *100}}%
                              </b-td>
                            </b-tr>
                          </template>
                        </template>
                      </b-tbody>
                      <b-tfoot>
                        <b-tr> </b-tr>
                      </b-tfoot>
                    </b-table-simple>
                  </b-tab>
                </template>
              </b-tabs>
            </b-tab>
          </b-tabs>
        </b-card>
        <b-card class="mb-4" title="통계자료가 없습니다." v-else></b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { apiUrl } from "../../../../constants/config";
import axios from "axios";
import moment from "moment";
import DoughnutChart from "../../../../components/Charts/Doughnut";
import BarChart from "../../../../components/Charts/Bar";

export default {
  components: {
    "doughnut-chart": DoughnutChart,
    "bar-chart": BarChart
  },
  data() {
    return {
      isLoading: false,
      typeOption: ["여론조사", "서베이", "광고"],
      isReport: false,
      data: {
        type: 0,
        startAt: new Date(),
        endAt: new Date(),
        itemText: {},
        itemQuestion: [],
        itemFinish: {},
        itemResearcher: {},
        itemReward: {}
      },
      analyticsData: null,
      doughnutChartData: [],
      barChartData: []
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    if (this.id) {
      this.isLoading = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch(apiUrl + "/research/" + this.id, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          this.data = result;
          this.data.itemText = this.data.itemText || {};
          this.data.itemQuestion = this.data.itemQuestion || {};
          this.data.itemFinish = this.data.itemFinish || {};
          this.data.itemResearcher = this.data.itemResearcher || {};
          this.data.itemReward = this.data.itemReward || {};
          this.isLoading = false;
        })
        .catch(error => {
          console.log("error", error)
          this.isLoading = false;
        });

      this.isLoading = true;
      fetch(apiUrl + "/research/analytics/" + this.id, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log("analyticsData = ", result);
          this.analyticsData = result;

          this.analyticsData.itemQuestionDetails.forEach(item => {
            this.doughnutChartData.push({
              labels: ["남자", "여자"],
              datasets: [
                {
                  label: "",
                  borderColor: ["#ed7d31", "#9dc3e6"],
                  backgroundColor: ["#ed7d31", "#9dc3e6"],
                  borderWidth: 2,
                  data: [item.respondentCharacteristics.bySex.male, item.respondentCharacteristics.bySex.female]
                }
              ]
            });
            this.barChartData.push({
              labels: [
                "18세 이하",
                "18세 이상~29세 이하",
                "30대",
                "40대",
                "50대",
                "60대"
              ],
              datasets: [
                {
                  borderColor: "#4990cf",
                  backgroundColor: "#4990cf",
                  data: [
                    item.respondentCharacteristics.byAge.byAge10,
                    item.respondentCharacteristics.byAge.byAge20,
                    item.respondentCharacteristics.byAge.byAge30,
                    item.respondentCharacteristics.byAge.byAge40,
                    item.respondentCharacteristics.byAge.byAge50,
                    item.respondentCharacteristics.byAge.byAge60
                  ],
                  borderWidth: 2
                }
              ]
            })
          })
          this.isLoading = false;
        })
        .catch(error => {
          console.log("error", error)
          this.isLoading = false;
        });
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD");
    },

    formatDateWithMin(date) {
      return moment(date).format("YYYY.MM.DD hh:mm");
    },

    calcTotalRows() {
      return this.calcTotalRegionCount() + 10;
    },

    calcTotalRegionCount() {
      let regionData = this.analyticsData.respondentCharacteristics.byRegion;
      let totalCnt = 0;
      Object.keys(regionData).forEach(key => {
        totalCnt += this.calcRegionCount(key);
      });
      return totalCnt + 1;
    },

    calcRegionCount(region) {
      let regionData = this.analyticsData.respondentCharacteristics.byRegion;
      // let totalCnt = Object.keys(regionData[region]).length + 1;
      let totalCnt = 0;
      Object.keys(regionData[region]).forEach(sido => {
        totalCnt += Object.keys(regionData[region][sido]).length + 1;
      })
      return totalCnt + 1;
    },

    calcDongCount(region, sido) {
      let regionData = this.analyticsData.respondentCharacteristics.byRegion;
      let totalCnt = Object.keys(regionData[region][sido]).length + 1;
      return totalCnt;
    },

    getSubjectiveDetailCount(item) {
      let question = this.data.itemQuestion.find(
        x => x._id == item.itemQuestionId
      );
      if (question.type1) {
        return item.subjectiveDetails.length;
      } else {
        return "/";
      }
    },

    getDetailCount(item, index) {
      let question = this.data.itemQuestion.find(
        x => x._id == item.itemQuestionId
      );
      if (!question.type1) {
        if (item.itemViewDetails[index]) {
          if (item.itemViewDetails[index].respondentCharacteristics) {
            return item.itemViewDetails[index].respondentCharacteristics
              .totalReplies;
          } else {
            return 0;
          }
        } else {
          return "/";
        }
      } else {
        return "/";
      }
    },

    getOtherDetailCount(item, index) {
      let question = this.data.itemQuestion.find(
        x => x._id == item.itemQuestionId
      );
      if (!question.type1) {
        if (item.itemViewDetails[index]) {
          if (item.itemViewDetails[index].respondentCharacteristics) {
            return item.itemViewDetails[index].respondentCharacteristics
              .totalReplies;
          } else {
            return 0;
          }
        } else {
          return "/";
        }
      } else {
        return "/";
      }
    },

    getQuestion(item) {
      let question = this.data.itemQuestion.find(
        x => x._id == item.itemQuestionId
      );
      // this.doughnutChartData.datasets[0].data = [
      //   item.respondentCharacteristics.bySex.male,
      //   item.respondentCharacteristics.bySex.female
      // ];
      // this.barChartData.datasets[0].data = [
      //   item.respondentCharacteristics.byAge.byAge10,
      //   item.respondentCharacteristics.byAge.byAge20,
      //   item.respondentCharacteristics.byAge.byAge30,
      //   item.respondentCharacteristics.byAge.byAge40,
      //   item.respondentCharacteristics.byAge.byAge50,
      //   item.respondentCharacteristics.byAge.byAge60
      // ];
      // console.log('chartData = ', this.doughnutChartData);
      return question;
    },

    getQuestionItems(item) {
      let question = this.data.itemQuestion.find(
        x => x._id == item.itemQuestionId
      );
      return question.itemView;
    },

    getItemCount(item, index) {
      try {
        if (item.itemViewDetails[index].respondentCharacteristics) {
          return item.itemViewDetails[index].respondentCharacteristics
            .totalReplies;
        } else {
          return 0;
        }
      } catch(e) {
        console.log('----------------')
        console.log(item);
        console.log(index);
      }
    },

    getMaxCount() {
      let max = 0;
      this.data.itemQuestion.forEach(item => {
        if (max < item.itemView.length + item.itemViewOther.length) {
          max = item.itemView.length + item.itemViewOther.length;
        }
      });
      return max;
    },

    getMaxViewitems() {
      let max = 0;
      this.data.itemQuestion.forEach(item => {
        if (max < item.itemView.length) {
          max = item.itemView.length;
        }
      });
      return max;
    },

    getMaxOtherViewitems() {
      let max = 0;
      this.data.itemQuestion.forEach(item => {
        if (max < item.itemViewOther.length) {
          max = item.itemViewOther.length;
        }
      });
      return max;
    },

    addNotification(
      type = "success",
      title = "This is Notify Title",
      message = "This is Notify Message,<br>with html."
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false });
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  }
};
</script>
<style scoped>
.gray-text {
  color: #d7d7d7;
}
.button-container {
  display: flex;
  position: absolute;
  right: 20px;
  top: 5px;
  z-index: 100;
}
.table th,
.table td {
  /* border-color: #000000 !important; */
  border: 1px solid black !important;
  vertical-align: middle;
}
.bottom {
  border-bottom: 1px solid black;
}
.sub-header {
  background-color: #8497b0 !important;
}
.main-header {
  background-color: #203864 !important;
}
.item-header {
  background-color: #bfbfbf !important;
}
.subitem-header {
  background-color: #e7e6e6 !important;
}
.question-container {
  width: 100%;
  border: 1px solid #a3a3a3;
}
.question-container .question-title {
  width: 100%;
  background-color: #d7d7d7;
  padding: 4px 8px;
}
.question-container .question-body {
  padding: 24px;
}
.count-bar {
  height: 10px;
  background-color: #203864;
}
.chart-container {
  height: 200px;
}
</style>
