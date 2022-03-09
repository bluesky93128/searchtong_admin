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
        <!-- <b-card class="mb-4" title="PUSH 등록"> -->
        <b-form @submit.prevent="onRegister">
          <!-- <b-form-group label-cols="2" label="유형" content-cols="2">
            <v-select
              :options="typeOptions"
              v-model="faq_data.type"
            ></v-select>
          </b-form-group> -->
          <b-form-group label-cols="2" label="제목" content-cols="8">
            <b-form-input v-model="faq_data.title" required />
          </b-form-group>
          <b-form-group label-cols="2" label="내용" content-cols="8">
            <b-form-textarea v-model="faq_data.content" required />
          </b-form-group>
          <b-form-group label-cols="2" label="공개여부" content-cols="6">
            <b-row class="mb-4">
              <b-colxx xs="6"
                ><b-form-radio
                  name="isPublic"
                  v-model="faq_data.isPublic"
                  :value="true"
                  >공개</b-form-radio
                ></b-colxx
              >
              <b-colxx xs="6"
                ><b-form-radio
                  name="isPublic"
                  v-model="faq_data.isPublic"
                  :value="false"
                  >비공개</b-form-radio
                ></b-colxx
              >
            </b-row>
          </b-form-group>
          <div class="d-flex justify-content-center align-items-center">
            <b-button variant="primary" type="submit" class="mr-2">수정</b-button>
            <b-button variant="outline-primary" @click="onRemove()">삭제</b-button>
          </div>
        </b-form>
        <!-- </b-card> -->
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

export default {
  components: {
    "v-select": vSelect,
    "single-lightbox": SingleLightbox,
    datepicker: Datepicker,
  },
  data() {
    return {
      typeOptions: ["회원가입", "티켓예매", "결제수단", "티켓인증", "티켓수령", '취소, 환불'],
      faq_data: {
        type: "",
        title: "",
        content: "",
        isPublic: false,
      },
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(apiUrl + "/faq/" + this.id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.faq_data = result.data;
      })
      .catch((error) => console.log("error", error));
  },
  methods: {
    onHorizontalSubmit() {},
    onUpload(type) {
      let input = document.createElement("input");
      input.accept = ".jpg, .jpeg, .gif, .png";
      input.type = "file";
      var self = this;
      input.onchange = (_) => {
        // you can use this method to get file and perform respective operations
        var formdata = new FormData();
        formdata.append("file", input.files[0]);

        var requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };

        fetch(apiUrl + "/upload", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            this.faq_data.image = downloadUrl + "/" + result.filename;
            console.log(this.faq_data);
          })
          .catch((error) => console.log("error", error));
      };
      input.click();
    },
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD");
    },
    onRegister() {
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(this.faq_data),
        redirect: "follow",
      };

      var self = this;
      fetch(apiUrl + "/faq/" + this.id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.status) {
            self.addNotification(
              "success filled",
              "팝업 수정",
              "성공적으로 업데이트되었습니다."
            );
            self.$router.go(-1);
          } else {
            self.addNotification(
              "error filled",
              "팝업 수정",
              "업데이트 중에 오류가 발생했습니다."
            );
          }
        })
        .catch((error) => console.log("error", error));
    },
    onRemove() {
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );

      var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      var self = this;
      fetch(apiUrl + "/faq/" + this.id, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.status) {
            self.addNotification(
              "success filled",
              "팝업 삭제",
              "성공적으로 삭제되었습니다."
            );
            self.$router.go(-1);
          } else {
            self.addNotification(
              "error filled",
              "팝업 삭제",
              "삭제 중에 오류가 발생했습니다."
            );
          }
        })
        .catch((error) => console.log("error", error));
    },
    addNotification(
      type = "success",
      title = "This is Notify Title",
      message = "This is Notify Message,<br>with html."
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false });
    },
  },
};
</script>


<style scoped>
[role="button"] {
  cursor: pointer;
}
img::after {
  content: "+";
}
</style>