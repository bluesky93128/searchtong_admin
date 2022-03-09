<template>
  <div v-if="customer_center_data.user">
    <b-row>
      <b-colxx xxs="12">
        <!-- <h2>배너 상세</h2>
        <div class="separator mb-5"></div> -->
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <!-- <b-card class="mb-4" title="PUSH 등록"> -->
        <b-form @submit.prevent="onHorizontalSubmit">
          <b-form-group label-cols="2" label="등록일" content-cols="2">
            <b-form-input :value="formatDate(customer_center_data.createdAt)" disabled />
          </b-form-group>
          <b-form-group label-cols="2" label="ID" content-cols="2">
            <b-form-input :value="customer_center_data.user.name" disabled />
          </b-form-group>
          <b-form-group label-cols="2" label="연락처" content-cols="2">
            <b-form-input :value="customer_center_data.user.decPhoneNum" disabled />
          </b-form-group>
          <b-form-group label-cols="2" label="이메일" content-cols="2">
            <b-form-input :value="customer_center_data.user.email" disabled />
          </b-form-group>
          <b-form-group label-cols="2" label="제목" content-cols="8">
            <b-form-input v-model="customer_center_data.title" required disabled />
          </b-form-group>
          <b-form-group label-cols="2" label="내용" content-cols="8">
            <b-form-textarea v-model="customer_center_data.content" required disabled />
          </b-form-group>
          <b-form-group label-cols="2" label="관리자 답변" content-cols="6">
            <b-form-textarea v-model="customer_center_data.answer" />
          </b-form-group>
          <div class="d-flex justify-content-center align-items-center">
            <b-button variant="primary" type="submit" class="mr-2">등록</b-button>
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
      customer_center_data: {
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

    fetch(apiUrl + "/customer_center/detail/" + this.id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.customer_center_data = result.data;
      })
      .catch((error) => console.log("error", error));
  },
  methods: {
    onHorizontalSubmit() {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
      myHeaders.append("Content-Type", "application/json");

      this.customer_center_data.status = 1;

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(this.customer_center_data),
        redirect: 'follow'
      };

      var self = this;

      fetch(apiUrl + "/customer_center/" + this.id, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result.status) {
            self.addNotification(
              "success filled",
              "",
              "등록이 완료되었습니다."
            );
            self.$router.go(-1);
          } else {
            self.addNotification(
              "error filled",
              "",
              "등록중 오류가 발생했습니다."
            );
          }
        })
        .catch(error => console.log('error', error));
    },
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
            this.customer_center_data.image = downloadUrl + "/" + result.filename;
            console.log(this.customer_center_data);
          })
          .catch((error) => console.log("error", error));
      };
      input.click();
    },
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD");
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