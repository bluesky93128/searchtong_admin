<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <!-- <h2>배너 상세</h2>
        <div class="separator mb-5"></div> -->
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="공지사항 등록">
          <b-form>
            <b-form-group label-cols="2" content-cols="8" label="제목">
              <b-form-input v-model="notice_data.name" />
            </b-form-group>
            <b-form-group label-cols="2" content-cols="8" label="내용">
              <quill-editor
                ref="myTextEditor"
                v-model="notice_data.content"
                :options="editorOption"
              >
              </quill-editor>
            </b-form-group>
            <b-form-group label-cols="2" content-cols="4" label="메인공지">
              <b-checkbox v-model="notice_data.isMain">메인공지</b-checkbox>
            </b-form-group>
            <b-form-group label-cols="2" content-cols="4" label="노출여부">
              <b-row class="mb-4">
                <b-colxx xs="6"
                  ><b-form-radio
                    name="isPublic"
                    v-model="notice_data.isPublic"
                    :value="true"
                    >노출</b-form-radio
                  ></b-colxx
                >
                <b-colxx xs="6"
                  ><b-form-radio name="isPublic" v-model="notice_data.isPublic" :value="false"
                    >비노출</b-form-radio
                  ></b-colxx
                >
              </b-row>
            </b-form-group>
            <div class="d-flex justify-content-center align-items-center">
              <b-button variant="primary" @click="onRegister()" class="mr-2">수정</b-button>
              <b-button variant="outline-primary" @click="onRemove()">삭제</b-button>
            </div>
          </b-form>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { apiUrl } from "../../../../constants/config";
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
      notice_data: {
        name: "",
        content: '',
        isMain: false,
        isPublic: true,
      },
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
    this.id = this.$route.query.id;
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    var self = this;
    fetch(apiUrl + "/notice/"+this.id, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        self.notice_data = result.data;
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
      console.log(this.notice_data);
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(this.notice_data),
        redirect: 'follow'
      };

      fetch(apiUrl + "/notice/"+this.id, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if(result.status) {
            this.addNotification("success filled", "공지사항 수정", "공지사항이 성공적으로 업데이트되었습니다.");
            this.$router.go(-1);
          }
        })
        .catch(error => console.log('error', error));
    },
    onRemove() {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      var self = this;
      fetch(apiUrl + "/notice/" + this.id, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if(result.status) {
            self.addNotification("success filled", "공지사항 삭제", "공지사항이 성공적으로 삭제되었습니다!");
            self.$router.go(-1);
          } else {
            self.addNotification("error filled", "공지사항 삭제", "공지사항을 삭제하는 중에 오류가 발생했습니다!");
          }
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
  computed: {
    editor () {
      return this.$refs.myTextEditor.quill
    }
  }
};
</script>