<template>
  <div class="container mab-25">
    <div class="login-wrapper-flex">
      <div class="login-wrapper-contents login-padding">
        <p v-if="errorMessage" class="text-danger">{{errorMessage}}</p>
        <form class="login-wrapper-contents-form custom-form" @submit.prevent="handleLogin" method="post">
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="email"> Email </label>
            <input class="form-control" type="email" v-model="email" placeholder="이메일을 입력해주세요">
            <p class="text-danger">{{ emailError }}</p>
          </div>
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="password"> Password </label>
            <input class="form-control" type="password" v-model="password" placeholder="패스워드를 입력해주세요">
            <p class="text-danger">{{ passwordError }}</p>
            <div class="icon toggle-password">
              <div class="show-icon"><i class="las la-eye-slash"></i></div>
              <span class="hide-icon"> <i class="las la-eye"></i> </span>
            </div>
          </div>
          <div class="checkbox-inline mt-4">
            <input class="check-input" type="checkbox" v-model="check15">
            <label class="checkbox-label" for="check15">자동로그인 </label>
            <p id="checkboxError" class="text-danger"></p>
          </div>
          <button class="submit-btn w-100 mt-4" type="submit"> 로그인</button>
          <span class="account color-light mt-3"> 계정이 없으신가요? <a class="color-one"
                                                                href="/member/join"> 회원가입 </a> </span>
        </form>
        <div class="single-checkbox mt-3">
          <div class="forgot-password">
            <a href="/member/forgotpw" class="forgot-btn color-one"> 비밀번호 찾기</a>
          </div>
        </div>
        <div class="login-bottom-contents">
          <div class="or-contents mb-3">
            <span class="or-contents-para"> 소셜로그인 </span>
          </div>
          <div class="login-others">
            <div class="login-others-single">
              <a href="/oauth2/authorization/kakao?redeirect_uri=/member/login/oauth2/code/kakao" class="login-others-single-btn w-100">
                <img src="@/assets/assets/img/single-page/kakaologo.jpg" width="24px" height="24px"
                     alt="">
                <span class="login-para"> 카카오 로그인 </span>
              </a>
            </div>
            <div class="login-others-single">
              <a href="/oauth2/authorization/google" class="login-others-single-btn w-100">
                <img src="@/assets/assets/img/single-page/google.png" alt="">
                <span class="login-para">구글 로그인 </span>
              </a>
            </div>
            <!--                        <div class="login-others-single">-->
            <!--                            <a href="/oauth2/authorization/naver" class="login-others-single-btn w-100">-->
            <!--                                <img th:src="@{/assets/img/single-page/naverlogin.png}" alt="" width="24px"-->
            <!--                                     height="24px">-->
            <!--                                <span class="login-para">네이버 로그인 </span>-->
            <!--                            </a>-->
            <!--                        </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FrontSideApiService from "@/services/FrontSideApiService";
import { useUserStore } from "@/store/UserStore";
import { redirectToPreviousPage } from "@/router/frontRouter";

export default {
  name : "LoginComponent",
  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      errorMessage : '',
      check15 : false,
    };
  },
  computed : {
    role() {
      const userStore = useUserStore();
      return userStore.role;
    }
  },
  methods: {
    async handleLogin() {
      if (!this.email) {
        this.emailError = '이메일을 입력해주세요';
        return;
      } else {
        this.emailError = '';
      }

      if (!this.password) {
        this.passwordError = '비밀번호를 입력해주세요';
        return;
      } else {
        this.passwordError = '';
      }

      let loginData = {email : this.email, password : this.password, check15 : this.check15 };

      try {
        const response = await FrontSideApiService.login(loginData);
        localStorage.removeItem('token');
        const userStore = useUserStore();
        let token = response.data.token;
        if (this.check15) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token',response.data.token);
        }
        userStore.setRole(response.data.role);
        redirectToPreviousPage();
      } catch (error) {
        this.errorMessage = error.response.data.error;
      }
    },
  },
  created() {
    const userStore = useUserStore();
    if (userStore.needLogin) {
      this.errorMessage = "로그인이 필요합니다.";
      userStore.setNeedLogin(false);
    }
  },
  unmounted() {
    this.errorMessage = ""
  },
}
</script>

<style>

</style>