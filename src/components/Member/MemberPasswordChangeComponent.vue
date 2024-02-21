<template>

  <div class="dashboard-area section-bg-2 pat-100 pab-100">
    <div class="container">
      <div class="dashboard-contents-wrapper">
        <div class="dashboard-icon">
          <div class="sidebar-icon">
            <i class="las la-bars"></i>
          </div>
        </div>
        <div class="dashboard-left-content">
          <div class="dashboard-close-main">
            <div class="close-bars"><i class="las la-times"></i></div>
            <div class="dashboard-bottom">
              <ul class="dashboard-list list-style-none">
<!--                <li class="list">-->
<!--                  <router-link to="/member/point"><i class="las la-briefcase"></i> 포인트</router-link>-->
<!--                </li>-->
                <li class="list" v-if="!role">
                  <router-link to="/reservation/check"><i class="las la-briefcase"></i> 예약확인</router-link>
                </li>
                <li class="list" v-if="role">
                  <router-link to="/reservation/details"><i class="las la-briefcase"></i> 예약확인</router-link>
                </li>
                <li class="list has-children active open show">
                  <a href="javascript:void(0)"> <i class="las la-user-circle"></i> 프로필 </a>
                  <ul class="submenu list-style-none">
                    <li class="list">
                      <router-link to="/member/memberinfo"> 프로필</router-link>
                    </li>
                    <li class="list">
                      <router-link to="/member/update"> 프로필 수정</router-link>
                    </li>
                    <li class="list selected">
                      <router-link to="/member/changepw"> 비밀번호 변경</router-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="dashboard-right-contents mt-4 mt-lg-0">
          <div class="dashboard-reservation">
            <div class="single-reservation bg-white base-padding">
              <h3 class="single-reservation-title"> 비밀번호 변경 </h3>
              <div class="custom--form dashboard-form">
                <form @submit.prevent="changePassword">
                  <div class="dashboard-input mt-4">
                    <label class="label-title" for="password"> 현재 비밀번호 </label>
                    <input type="password" v-model="password" class="form--control" placeholder="현재 비밀번호" required>
                    <div class="toggle-password"><span class="eye-icon"> </span></div>
                    <p class="text-danger">{{errorMessage}}</p>
                  </div>
                  <div class="dashboard-input mt-4">
                    <label class="label-title"> 새 비밀번호 </label>
                    <input type="password" v-model="newPassword" class="form--control" placeholder="새 비밀번호" required>
                    <div class="toggle-password"><span class="eye-icon"> </span></div>
                  </div>
                  <div class="dashboard-input mt-4">
                    <label class="label-title"> 새 비밀번호 확인 </label>
                    <input type="password" v-model="confirmPassword" class="form--control" placeholder="새 비밀번호 확인" required>
                    <div class="toggle-password"><span class="eye-icon"> </span></div>
                  </div>
                  <p id="passwordError" class="text-danger">{{passwordError}}</p>
                  <div class="btn-wrapper mt-4">
                    <button class="submit-btn w-100 mt-4" type="submit">비밀번호 변경</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Dashboard area end -->

</template>

<script>
import frontSideApiService from "@/services/FrontSideApiService";
import {useUserStore} from "@/store/UserStore";
import { redirectToPreviousPage } from "@/router/frontRouter";

export default {
  name : "MemberPasswordChangeComponent",
  data() {
    return {
      errorMessage : "",
      password : "",
      newPassword : "",
      confirmPassword : "",
      passwordError : ""
    }
  },
  computed: {
    role() {
      const userStore = useUserStore();
      return userStore.role;
    }
  },
  methods : {
    async changePassword() {
      if(this.newPassword !== this.confirmPassword){
        this.passwordError = "비밀번호가 일치하지 않습니다.";
        return null;
      } else if(this.newPassword.length < 6){
        this.passwordError = "비밀번호는 6자 이상으로 해주세요.";
        return null;
      } else {
        this.passwordError = "";
      }

      const passwordData = { password : this.password, newPassword : this.newPassword };

      try {
        const response = await frontSideApiService.changePassword(passwordData);
        alert(response.data.success)
        redirectToPreviousPage();
      }catch (error) {
        this.errorMessage = error.response.data.error;
      }
    }
  }
}

</script>



<style scoped>

</style>