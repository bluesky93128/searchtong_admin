import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'
import { currentUser, isAuthActive, apiUrl } from '../../constants/config'

export default {
  state: {
    currentUser: isAuthActive ? currentUser : (localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null),
    loginError: null,
    processing: false,
    forgotMailSuccess:null,
    resetPasswordSuccess:null
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess:state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout(state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.forgotMailSuccess=true
    },
    setResetPasswordSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.resetPasswordSuccess=true
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    login({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      axios
        .post(apiUrl + "/user/adminLogin", {
          username: payload.username,
          password: payload.password,
        })
        .then(response => {
          return response.data;
        })
        .then(res => {
          console.log(res);
          // if(res.status == 1) {
            const item = {
              ...currentUser,
              username: res.name,
              title: "Admin",
              img: "/assets/img/avatar.jpg",
              wallet_name: res.wallet_name,
              wallet_pw: res.wallet_pw,
              wallet_addr: res.wallet_addr
            };
  
            localStorage.setItem("user", JSON.stringify(item));
            localStorage.setItem("token", res.token);
            commit("setUser", item);
          // }
        })
        .catch(err => {
          commit("setError", err.response.data.message);
        });
    },
    forgotPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      firebase
        .auth()
        .sendPasswordResetEmail(payload.email)
        .then(
          user => {
            commit('clearError')
            commit('setForgotMailSuccess')
          },
          err => {
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },
    resetPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      firebase
        .auth()
        .confirmPasswordReset(payload.resetPasswordCode,payload.newPassword)
        .then(
          user => {
            commit('clearError')
            commit('setResetPasswordSuccess')
          },
          err => {
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },



    /*
       return await auth.(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
    */
    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem('user')
          commit('setLogout')
        }, _error => { })
    }
  }
}
