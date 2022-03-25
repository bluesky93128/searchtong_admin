<template>
  <div id="root">
    <div class="fixed-background" style="overflow-y: auto;">
        <div class="container">
          <b-row class="h-100">
            <b-colxx xxs="12" class="mx-auto my-4">
              <b-card>
                <div id="main-text"></div>
              </b-card>
            </b-colxx>
          </b-row>
        </div>
    </div>
  </div>
</template>
<script>
import { apiUrl } from "../constants/config";
export default {
  data() {
    return {
      policy_text: ""
    }
  },
  methods: {
    goBack() {
      this.$router.push("/");
    }
  },
  mounted: function() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(apiUrl + "/terms-of-service/privacy_policy", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.policy_text = result.data.content;
        document.getElementById('main-text').innerHTML = this.policy_text;
      })
      .catch(error => console.log('error', error));
  },
  beforeDestroy() {
    document.body.classList.remove("background");
  }
};
</script>
