<template>
  <div>
    <div class="loader-container" v-show="isLoading">
      <div class="loader"></div>
    </div>
    <b-row>
      <b-colxx xxs="12">
        <!-- <h2>배너 상세</h2>
        <div class="separator mb-5"></div> -->
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="설문조사리포트 등록">
          <b-form>
            <b-form-group label-cols="2" content-cols="4" label="썸네일">
              <!-- <b-img :src="image" /> -->
              <div class="d-flex">
                <img
                  v-if="report_data.thumbnailUrl"
                  :src="downloadUrl + '/' + report_data.thumbnailUrl"
                  class-name="card-img"
                  style="
                    width: 200px;
                    height: 150px;
                    border: 1px solid #d7d7d7;
                    justify-content: center;
                    display: flex;
                  "
                  alt="이미지"
                  :key="thumbnailKey"
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
                  >이미지 업로드</b-button
                >
              </div>
            </b-form-group>
            <b-form-group label-cols="2" content-cols="2" label="레벨">
              <b-select
                v-model="report_data.level"
                :options="level_options"
              />
            </b-form-group>
            <b-form-group label-cols="2" content-cols="6" label="첨부파일">
              <b-button
                variant="primary"
                class="ml-2"
                style="height: 32px;"
                @click="onUploadFiles()"
              >
                파일 업로드
              </b-button>
              <div class="file-list" v-for="(item, index) in report_data.attachFileList" :key="index">
                <span class="file-item">{{item.title}}</span>
                <b-button variant="outline-primary" @click="onDeleteFile(index)">삭제</b-button>
              </div>
            </b-form-group>
            <b-form-group label-cols="2" content-cols="8" label="제목">
              <b-form-input v-model="report_data.title" />
            </b-form-group>
            <b-form-group label-cols="2" content-cols="8" label="본문">
              <!-- <quill-editor
                ref="myTextEditor"
                v-model="report_data.content"
                :options="editorOption"
              >
              </quill-editor> -->
              <b-textarea v-model="report_data.content" />
            </b-form-group>
            <!-- <b-form-group label-cols="2" content-cols="4" label="메인공지">
              <b-checkbox v-model="report_data.isMain">메인공지</b-checkbox>
            </b-form-group> -->
            <b-form-group label-cols="2" content-cols="8" label="공개상태">
              <b-row class="mb-4">
                <b-colxx xs="4">
                  <b-form-radio name="publicStatus" v-model="report_data.publicStatus" :value="0">전체공개</b-form-radio>
                </b-colxx>
                <b-colxx xs="4">
                  <b-form-radio name="publicStatus" v-model="report_data.publicStatus" :value="1">회원공개</b-form-radio>
                </b-colxx>
                <b-colxx xs="4">
                  <b-form-radio name="publicStatus" v-model="report_data.publicStatus" :value="2">비공개</b-form-radio>
                </b-colxx>
              </b-row>
            </b-form-group>
            <div class="d-flex justify-content-center align-items-center">
              <b-button variant="primary" @click="onDelete()">삭제</b-button>
              <b-button variant="primary" @click="onRegister()">수정</b-button>
            </div>
          </b-form>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { apiUrl, downloadUrl } from "../../../../constants/config";
import axios from "axios";
import moment from "moment";
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
import Datepicker from "vuejs-datepicker";
import SingleLightbox from "../../../../containers/pages/SingleLightbox";

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    "v-select": vSelect,
    "single-lightbox": SingleLightbox,
    datepicker: Datepicker,
    'quill-editor' : quillEditor
  },
  data() {
    return {
      downloadUrl: downloadUrl,
      isLoading: false,
      report_data: {
        title: "",
        content: '',
        attachFileList: [],
        publicStatus: 0,
        level: 99
      },
      level_options: [1, 2, 3, 99],
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' }
            ],
            ['link', 'image'],
            ['clean']
          ]
        }
      },
    };
  },
  mounted() {
    this.isLoading = true;
    this.id = this.$route.query.id;
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(apiUrl + "/report/" + this.id, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        this.report_data = result.report;
        this.isLoading = false;
      })
      .catch(error => console.log('error', error));
  },
  methods: {
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD");
    },

    // onEditorBlur (editor) {
    //   console.log('editor blur!', editor)
    // },
    // onEditorFocus (editor) {
    //   console.log('editor focus!', editor)
    // },
    // onEditorReady (editor) {
    //   console.log('editor ready!', editor)
    // },

    onRegister() {
      this.isLoading = true;
      console.log(this.report_data);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(this.report_data),
        redirect: 'follow'
      };

      fetch(apiUrl + "/report/" + this.id, requestOptions)
        .then(response => response.json())
        .then(result => {
          this.addNotification("success filled", "여론조사 리포트 수정", "여론조사 리포트가 성공적으로 수정되었습니다.");
          this.isLoading = false;
          this.$router.go(-1);
        })
        .catch(error => {
          console.log('error', error)
          this.addNotification("error filled", "여론조사 리포트 수정", "여론조사 리포트 수정이 실패하였습니다.");
        });
    },
    onDelete() {
      if(confirm("여론조사리포트를 삭제하시겠습니까?")) {
        this.isLoading = true;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(apiUrl + "/report/" + this.id, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result)
            this.addNotification("success filled", "여론조사 리포트 삭제", "여론조사 리포트가 성공적으로 삭제되었습니다.");
            this.isLoading = false;
            this.$router.go(-1);
           })
          .catch(error => {
            console.log('error', error)
            this.addNotification("error filled", "여론조사 리포트 삭제", "여론조사 리포트 삭제가 실패하였습니다.");
          });
      }
    },
    onClickSelectFile() {
      let input = document.createElement('input');
      input.accept=".jpg, .jpeg, .png";
      input.type = 'file';
      var self = this;
      input.onchange = _ => {
        // you can use this method to get file and perform respective operations
        this.isLoading = true;
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
            self.report_data.thumbnailUrl = result.filename;
            self.thumbnailKey = result.filename;
            this.isLoading = false;
          })
          .catch(error => console.log('error', error));
        
      };
      input.click();
    },

    onDeleteFile(index) {
      this.report_data.attachFileList.splice(index, 1);
    },

    onUploadFiles() {
      let input = document.createElement('input');
      // input.accept=".jpg, .jpeg, .png";
      input.type = 'file';
      input.multiple = 'multiple';
      var self = this;
      input.onchange = async _ => {
        // you can use this method to get file and perform respective operations
        this.isLoading = true;
        for(let i = 0; i < input.files.length; i++) {
          var formdata = new FormData();
          formdata.append("file", input.files[i]);

          var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };

          let res = await fetch(apiUrl + "/upload", requestOptions)
          let json = await res.json();
            // .then(response => response.json())
            // .then(result => {
          console.log(input.files[i]);
          console.log(json);
          self.report_data.attachFileList.push({
            title: input.files[i].name,
            fileUrl: json.filename
          })
          // self.report_data.thumbnailUrl = result.filename;
          // self.thumbnailKey = result.filename;
            // })
            // .catch(error => console.log('error', error));
        }
        
        this.isLoading = false;
        
      };
      input.click();
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
    editor () {
      return this.$refs.myTextEditor.quill
    }
  }
};
</script>

<style scoped>
.file-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
.file-item {
  color: #ed7117;
  text-decoration: underline;
  font-size: 14px;
}
</style>