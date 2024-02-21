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
                    <li class="list selected">
                      <router-link to="/member/memberinfo"> 프로필</router-link>
                    </li>
                    <li class="list">
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
              <div class="single-reservation-flex mb-4">
                <div class="single-reservation-author">
                  <div class="single-reservation-author-flex">
                    <div class="single-reservation-author-contents">
                      <h5 class="single-reservation-author-contents-title"> {{memberInfo.name}}님 </h5>
                      <p class="single-reservation-author-contents-para"> 닉네임 : {{memberInfo.nickName}} </p>
                    </div>
                  </div>
                </div>
                <div class="btn-wrapper">
                  <router-link to="/member/update" class="cmn-btn btn-border"> 프로필 수정 </router-link>
                </div>
              </div>
              <div class="single-reservation-item">
                <div class="single-reservation-contact">
                  <div class="single-reservation-contact-item">
                    <span class="single-reservation-contact-list"> <span> <i class="las la-phone-alt"></i> </span> {{memberInfo.tel}} </span>
                  </div>
                  <div class="single-reservation-contact-item">
                    <a :href="`mailto:${memberInfo.email}`" class="single-reservation-contact-list">
                      <span><i class="las la-envelope"></i></span>
                      {{ memberInfo.email }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="single-reservation bg-white base-padding">
              <div class="single-reservation-flex">
                <div class="single-reservation-author">
                  <div class="single-reservation-author-flex">
                    <div class="single-reservation-author-contents">
                      <h5 class="single-reservation-author-contents-title"> 비밀번호 </h5>
                      <p class="single-reservation-author-contents-para"></p>
                    </div>
                  </div>
                </div>
                <div class="btn-wrapper">
                  <router-link to="/member/changepw" class="cmn-btn btn-border"> 비밀번호 변경 </router-link>
                </div>
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

export default {
  name : "MemberInfoComponent",
  data() {
    return {
      memberInfo : {
        email : "",
        name : "",
        tel1 : "",
        tel2 : "",
        tel3 : "",
        nickName: ""
      }
    }
  },
  computed: {
    role() {
      const userStore = useUserStore();
      return userStore.role;
    }
  },
  methods : {
    async loadMemberInfo() {

      try {
        const response = await frontSideApiService.getMemberInfo();
        this.memberInfo = response.data.dataObject;
      } catch (error) {
        if(error.response.data){
          alert(error.response.data.error);
          return
        }
        alert("에러가 발생하였습니다.");
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