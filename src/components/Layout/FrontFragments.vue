<template>
  <div class="FrontFragments">
    <slot name="frontHeader">
      <header class="header-style-01">
        <nav class="navbar navbar-area navbar-border navbar-padding navbar-expand-lg">
          <div class="container custom-container-one nav-container">
            <div class="logo-wrapper" style="font-size: 21px;">
              <a href="/">해그린피싱</a>
            </div>
            <div class="responsive-mobile-menu d-lg-none">
              <a href="javascript:void(0)" class="click-nav-right-icon">
                <i class="lar la-user"></i>
              </a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                      data-bs-target="#hotel_booking_menu">
                <span class="navbar-toggler-icon"></span>
              </button>
            </div>
            <div class="collapse navbar-collapse" id="hotel_booking_menu">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <router-link to="/noticeboard/list">공지사항</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/jowhangboard/list">조황현황</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/reservation/list">예약하기/예약현황</router-link>
                </li>
                <li class="nav-item" v-if="role == null">
                  <router-link to="/reservation/check">예약확인</router-link>
                </li>
                <li class="nav-item" v-if="role != null">
                  <router-link to="/reservation/details">예약확인</router-link>
                </li>
                <li class="menu-item-has-children current-menu-item">
                  <a href="javascript:void(0)">기상정보</a>
                  <ul class="sub-menu">
                    <li><a href="https://www.weather.go.kr/w/ocean/forecast/daily-forecast.do"
                           target="_blank">기상청</a></li>
                    <li><a href="https://www.khoa.go.kr/Main.do" target="_blank">국립해양조사원</a></li>
                    <li><a href="https://www.windy.com/?33.443,127.095,8" target="_blank">미국기상청</a></li>
                  </ul>
                </li>
              </ul>
            </div>

            <div class="navbar-right-content show-nav-content">
              <div class="single-right-content">
                <div class="navbar-right-flex">
                  <div class="navbar-right-btn">
                    <ul class="navbar-nav">
                      <li class="nav-item">
                        <router-link class="nav-link" to="/member/login" v-if="role == null">로그인</router-link>
                      </li>
                      <li class="nav-item">
                        <router-link class="nav-link" to="/member/join" v-if="role == null">회원가입</router-link>
                      </li>
                      <li class="nav-item" v-if="role==='ADMIN'">
                        <a class="nav-link" href="http://localhost:3001/admin/reservationlist" @click="changeMode(true)">관리자</a>
                      </li>
                      <li class="nav-item" v-if="role != null ">
                        <router-link class="nav-link" to="/member/memberinfo">회원정보</router-link>
                      </li>
                      <li class="nav-item" v-if="role != null">
                        <a class="nav-link" @click="logout()">로그아웃</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </slot>
    <slot name="content"></slot>
    <slot name="frontFooter">
      <footer class="footer-area">
        <div class="copyright-area footer-padding copyright-bg-1">
          <div class="container">
            <div class="copyright-contents-flex">
              <div class="copyright-contents-items">
                <div class="copyright-contents-single">
                  <div class="copyright-contents-single-flex">
                    <div class="copyright-contents-single-icon">
                      <i class="las la-phone"></i>
                    </div>
                    <div class="copyright-contents-single-details">
                      <span class="copyright-contents-single-details-title"> 문의전화 </span>
                      <a href="tel:01044212628" class="copyright-contents-single-details-link">
                        010-4421-2628 </a>
                    </div>
                  </div>
                </div>
                <div class="copyright-contents-single">
                  <div class="copyright-contents-single-flex">
                    <div class="copyright-contents-single-icon">
                      <img src="../../assets/assets/img/band.png" alt="band">
                    </div>
                    <div class="copyright-contents-single-details">
                      <span class="copyright-contents-single-details-title"> 밴드 </span>
                      <a href="https://band.us/band/68756801" target="_blank"
                         class="copyright-contents-single-details-link"> 해그린피싱 </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="footer-contents-logo">
                <h3 class="footer-contents-logo-title text-white" style="text-align:center;"><a
                    href="/">
                  해그린피싱 </a>
                </h3>
                <p class="footer-contents-logo-para mt-3" style="text-align: center;"> 대표 김동수. 전화 010-4421-2628.<br/>
                  Copyright© 해그린피싱. All Rights Reserved. </p>
                <div class="footer-widget widget">
                  <div class="footer-widget-nav mt-5" style="text-align: center;">
                    <ul>
                      <a href="javascript:void(0)" class="footer-widget-nav-list-link"> 이용약관 </a> &nbsp;&nbsp;
                      <a href="javascript:void(0)" class="footer-widget-nav-list-link">
                        개인정보처리방침 </a>
                    </ul>
                  </div>
                </div>
              </div>
              <span class="copyright-contents-main"> ©2023, All Rights Reserved by <a
                  href="/"> HAEGREEN </a> </span>
            </div>
          </div>
        </div>
      </footer>
    </slot>
  </div>
</template>

<script>
import {useUserStore} from "@/store/UserStore";
import {computed} from "vue";

export default {
  name: "FrontFragments",
  props: {
    changeView: Boolean
  },
  setup(props, {emit}) {
    const userStore = useUserStore();
    const role = computed(() => userStore.role);

    function changeMode(change) {
      emit('changeView', change);
    }

    function logout() {
      userStore.logout();
    }

    return {role, logout, changeMode};
  }
}

</script>

<style lang="css" scoped>
@import url('@/assets/assets/css/bootstrap.min.css');
@import url('@/assets/assets/css/line-awesome.min.css');
@import url('@/assets/assets/css/animate.css');
@import url('@/assets/assets/css/slick.css');
@import url('@/assets/assets/css/magnific-popup.css');
@import url('@/assets/assets/css/flatpicker.css');
@import url('@/assets/assets/css/intlTelInput.css');
@import url('@/assets/assets/css/nice-select.css');
@import url('@/assets/assets/css/style.css');
</style>