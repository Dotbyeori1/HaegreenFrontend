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
                    <li class="list selected">
                      <router-link to="/member/update"> 프로필 수정</router-link>
                    </li>
                    <li class="list">
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
              <h3 class="single-reservation-title"> 프로필 수정 </h3>
              <div class="custom--form dashboard-form">
                <form @submit.prevent="updateMemberInfo">
                  <div class="dashboard-flex-input">
                    <div class="dashboard-input mt-4">
                      <label class="label-title mb-3" for="email"> 이메일 </label>
                      <input type="text" class="form--control" placeholder="이메일을 입력하세요"
                             :value="memberInfo.email" readonly>
                      <p th:if="errorMessage.email" class="fieldError">{{ errorMessage.email }}</p>
                    </div>
                  </div>
                  <div class="dashboard-flex-input">
                    <div class="dashboard-input mt-4">
                      <label class="label-title mb-3" for="name"> 이름 </label>
                      <input type="text" class="form--control" placeholder="이름을 입력하세요"
                             v-model="memberInfo.name">
                      <p v-if="errorMessage.name" class="fieldError">{{ errorMessage.name }}</p>
                    </div>
                  </div>
                  <div class="dashboard-flex-input">
                    <div class="dashboard-input mt-4">
                      <label class="label-title mb-3" for="nickName"> 닉네임 </label>
                      <input type="text" class="form--control" placeholder="닉네임을 입력하세요"
                             v-model="memberInfo.nickName">
                      <p v-if="errorMessage.nickName" class="fieldError">{{ errorMessage.nickName }}</p>
                    </div>
                  </div>
                  <div class="dashboard-flex-input">
                    <div class="dashboard-input mt-4">
                      <label class="label-title mb-3" for="tel"> 전화번호 </label>
                      <div style="display: flex;">
                        <input type="text" id="tel1" v-model="memberInfo.tel1" class="form--control" @input="enforceMaxLength('tel1', 3)" required style="flex: 1;">-
                        <input type="text" id="tel2" v-model="memberInfo.tel2" class="form--control" @input="enforceMaxLength('tel2', 4)" required style="flex: 1;">-
                        <input type="text" id="tel3" v-model="memberInfo.tel3" class="form--control" @input="enforceMaxLength('tel3', 4)" required style="flex: 1;">
                      </div>
                      전화번호를 바르게 입력하셔야 예약확인 및 알림전송이 가능합니다
                    </div>
                  </div>
                  <div class="btn-wrapper mt-4">
                    <button type="submit" class="cmn-btn btn-bg-1">프로필 수정</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import frontSideApiService from "@/services/FrontSideApiService";
import {useUserStore} from "@/store/UserStore";
import { redirectToPreviousPage } from "@/router/frontRouter";

export default {
  name: "MemberUpdateComponent",
  data() {
    return {
      memberInfo: {
        email: "",
        name: "",
        tel1: "",
        tel2: "",
        tel3: "",
        nickName: ""
      },
      errorMessage: {}
    }
  },
  computed: {
    role() {
      const userStore = useUserStore();
      return userStore.role;
    }
  },
  methods: {
    enforceMaxLength(field, maxLength) {
      if (field === 'tel1') {
        this.tel1 = this.tel1.replace(/[^\d]/g, '').slice(0, maxLength);
      } else if (field === 'tel2') {
        this.tel2 = this.tel2.replace(/[^\d]/g, '').slice(0, maxLength);
      } else if (field === 'tel3') {
        this.tel3 = this.tel3.replace(/[^\d]/g, '').slice(0, maxLength);
      }
    },
    async loadMemberInfo() {

      try {
        const response = await frontSideApiService.getMemberUpdate();
        this.memberInfo = response.data.dataObject;
      } catch (error) {
        if (error.response.data) {
          alert(error.response.data.error);
          return redirectToPreviousPage();
        }
        alert("에러가 발생하였습니다.");
      }
    },
    async updateMemberInfo() {

      const updateMemberData = {
        email: this.memberInfo.email,
        name: this.memberInfo.name,
        nickName: this.memberInfo.nickName,
        tel1: this.memberInfo.tel1,
        tel2: this.memberInfo.tel2,
        tel3: this.memberInfo.tel3
      }

      try {
        const response = await frontSideApiService.updateMember(updateMemberData);
        alert(response.data);
        this.$router.push("/member/memberinfo")
      } catch (error) {
        if (error.response.data) {
          this.errorMessage = error.response.data;
        }
      }
    }
  },
  mounted() {
    this.loadMemberInfo();
  }
}
</script>

<style scoped>

</style>