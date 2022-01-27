<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.online_policy')" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <quill-editor
            ref="myTextEditor"
            v-model="policy_text"
            :options="editorOption"
            class="terms-of-service-textarea"
          >
          </quill-editor>
          <b-button variant="primary" class="float-right mt-4" @click="onRegister()">보관</b-button>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { apiUrl } from "../../../constants/config";
import axios from "axios";
import moment from "moment";
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
import Datepicker from "vuejs-datepicker";
import SingleLightbox from "../../../containers/pages/SingleLightbox";

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
      policy_text: "",
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
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(apiUrl + "/terms-of-service/online_policy", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.policy_text = result.data.content;
      })
      .catch(error => console.log('error', error));
  },
  methods: {
    formatDate(date) {
      return moment(date).format("YYYY.MM.DD");
    },
    onRegister() {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "type": "online_policy",
        "content": this.policy_text
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(apiUrl + "/terms-of-service", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if(result.status) {
            this.addNotification("success filled", "Succeded", "Privacy policy updated successfully");
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