<template>
  <div class="container mab-25">
    <div class="login-wrapper-flex">
      <div class="login-wrapper-contents login-padding">
        <p class="text-danger" v-if="errorMessage">{{errorMessage}} </p>
        <form class="login-wrapper-contents-form custom-form padding-top-20"
             @submit.prevent="memberRegister" id="join" method="post">
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="email"> 이메일 </label>
            <input v-if="paramEmail !== null" type="email" class="form--control" :value="paramEmail" readonly />
            <input v-if="paramEmail === null" type="email" class="form--control" v-model="email" placeholder="이메일을 입력해주세요" required />
          </div>
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="name">이름</label>
            <input type="text" v-model="name" class="form--control" placeholder="이름을 입력해주세요" required>
          </div>
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="nickName">닉네임</label>
            <input type="text" v-model="nickName" class="form--control" placeholder="닉네임을 입력해주세요" required>
          </div>
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="tel">전화번호</label>
            <div style="display: flex;">
              <input type="text" id="tel1" v-model="tel1" class="form--control" @input="enforceMaxLength('tel1', 3)" required style="flex: 1;">-
              <input type="text" id="tel2" v-model="tel2" class="form--control" @input="enforceMaxLength('tel2', 4)" required style="flex: 1;">-
              <input type="text" id="tel3" v-model="tel3" class="form--control" @input="enforceMaxLength('tel3', 4)" required style="flex: 1;">
            </div>
            전화번호를 바르게 입력하셔야 예약확인 및 알림전송이 가능합니다
          </div>
          <div class="input-flex-item">
            <div class="single-input mt-4">
              <label class="label-title mb-3" for="password"> 비밀번호 생성 </label>
              <input class="form--control" type="password" placeholder="Type Password" v-model="password" required>
              <div class="icon toggle-password">
                <div class="show-icon"> <i class="las la-eye-slash"></i> </div>
                <span class="hide-icon"> <i class="las la-eye"></i> </span>
              </div>
            </div>
            <div class="single-input mt-4">
              <label class="label-title mb-3"> 비밀번호 확인 </label>
              <input class="form--control" v-model="confirmPassword" type="password" placeholder="Confirm Password" required>
              <div class="icon toggle-password">
                <div class="show-icon"> <i class="las la-eye-slash"></i> </div>
                <span class="hide-icon"> <i class="las la-eye"></i> </span>
              </div>
            </div>
          </div>
          <p class="text-danger">{{passwordError}}</p>
          <div class="checkbox-inline mt-4">
            <input class="check-input" type="checkbox" v-model="check">
            <label class="checkbox-label" for="check15">해그린피싱의 <a class="color-one" href="javascript:void(0)">이용약관</a>과
              <a class="color-one" href="javascript:void(0)"> 개인정보 수집 및 이용</a>에 동의합니다. </label>
            <p class="text-danger">{{checkboxError}}</p>
          </div>
          <button class="submit-btn w-100 mt-4" type="submit">회원가입</button>
          <span class="account color-light mt-3"> 이미 계정이 있으신가요? <router-link class="color-one" to="/member/login"> 로그인 </router-link> </span>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import frontSideApiService from "@/services/FrontSideApiService";
import { redirectToPreviousPage } from "@/router/frontRouter";

export default {
  name : "MemberRegisterComponent",
  data() {
    return {
      email: '',
      name: '',
      nickName: '',
      password: '',
      confirmPassword: '',
      paramEmail: null,
      passwordError: '',
      checkboxError: '',
      message: '',
      agreedTerms: false,
      errorMessage : '',
      tel1: '',
      tel2: '',
      tel3: '',
      check: false
    };
  },
  methods : {
    enforceMaxLength(field, maxLength) {
      if (field === 'tel1') {
        this.tel1 = this.tel1.replace(/[^\d]/g, '').slice(0, maxLength);
      } else if (field === 'tel2') {
        this.tel2 = this.tel2.replace(/[^\d]/g, '').slice(0, maxLength);
      } else if (field === 'tel3') {
        this.tel3 = this.tel3.replace(/[^\d]/g, '').slice(0, maxLength);
      }
    },
    async memberRegister() {
      if(this.password.length <= 5){
        this.passwordError = '비밀번호는 6자리 이상으로 해주세요.';
        return
      }else if (this.password !== this.confirmPassword) {
        this.passwordError = '비밀번호가 일치하지 않습니다.';
        return
      } else {
        this.passwordError = '';
      }

      // 체크 확인
      if (!this.check) {
        this.checkboxError = '이용약관, 위치기반서비스, 개인정보 수집 및 이용에 동의해주세요.'
        return;
      } else {
        this.checkboxError = '';
      }

      let registerData =
          {
            email : this.email || this.paramEmail,
            password : this.password,
            name : this.name,
            nickName : this.nickName,
            tel1 : this.tel1,
            tel2 : this.tel2,
            tel3 : this.tel3
          };
      try {
        const response = await frontSideApiService.registerMember(registerData);
        alert(response.data.success);
        redirectToPreviousPage();
      }catch (error){
        this.errorMessage = error.response.data.error;
      }
    }
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
     if(urlParams.get('error') === 'signup'){
       this.errorMessage = '회원가입이 필요합니다.';
       this.paramEmail = urlParams.get('email');
     }
  }
}
</script>

<style scoped>

</style>