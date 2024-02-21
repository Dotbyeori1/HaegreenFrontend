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
                <li class="list active" v-if="!role">
                  <router-link to="/reservation/check"><i class="las la-briefcase"></i> 예약확인</router-link>
                </li>
                <li class="list active" v-if="role">
                  <router-link to="/reservation/details"><i class="las la-briefcase"></i> 예약확인</router-link>
                </li>
                <li class="list has-children">
                  <a href="javascript:void(0)"> <i class="las la-user-circle"></i> 프로필 </a>
                  <ul class="submenu list-style-none">
                    <li class="list">
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
            <div class="single-reservation bg-white base-padding show open">
              <ul class="tabs details-tab details-tab-border">
                <li class="active" data-tab="prev"> 이용전</li>
                <li data-tab="end"> 이용완료</li>
              </ul>
            </div>

            <div id="prev" class="tab-content-item active">
              <template v-for="rv in reservationlist" :key="rv.rvno">
                <template v-if="rv.regDate >= today">
                  <div class="single-reservation bg-white base-padding show open mat-25">
                    <div class="row">
                      <div class="single-reservation-expandIcon"><i
                          class="las la-angle-down"></i>
                      </div>
                      <div class="single-reservation-head">
                        <div class="single-reservation-flex">
                          <div class="single-reservation-content">
                            <h5 class="single-reservation-content-title"> 예약번호 </h5>
                            <span class="single-reservation-content-id">{{ rv.rvno }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="single-reservation-inner">
                        <div class="single-reservation-item">
                          <div class="single-reservation-details">
                            <div class="single-reservation-details-item">
                              <span class="single-reservation-details-subtitle"> 예약자명 </span>
                              <h5 class="single-reservation-details-title">
                                {{ rv.regName }} </h5>
                            </div>
                            <div class="single-reservation-details-item">
                              <span class="single-reservation-details-subtitle"> 입금자명 </span>
                              <h5 class="single-reservation-details-title">
                                {{ rv.depositName }}</h5>
                            </div>
                            <div class="single-reservation-details-item">
                              <span class="single-reservation-details-subtitle"> 예약인원 </span>
                              <h5 class="single-reservation-details-title">
                                {{ rv.member }}명 </h5>
                            </div>
                            <div class="single-reservation-details-item">
                              <span class="single-reservation-details-subtitle"> 예약날짜 </span>
                              <h5 class="single-reservation-details-title">
                                {{ formatDate(rv.regDate) }} </h5>
                            </div>
                          </div>
                        </div>
                        <div class="single-reservation-item">
                          <div class="single-reservation-flex">
                            <div class="single-reservation-content">
                              <h5 class="single-reservation-content-title"> 확정여부 </h5>
                              <h5 class="single-reservation-details-title">
                                <p v-if="rv.state">최종 예약 완료</p>
                                <p v-else>입금 확인 완료</p>
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div class="single-reservation-item">
                          <div class="single-reservation-flex">
                            <div class="single-reservation-content">
                              <h5 class="single-reservation-content-title"> 입금
                                금액 </h5>
                              <span class="single-reservation-content-price"> {{ rv.money }} </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </div>

            <div id="end" class="tab-content-item">
              <template v-for="rv in reservationlist" :key="rv.rvno">
                <template v-if="rv.regDate < today && rv.state === true">
                  <div class="single-reservation bg-white base-padding show open mat-25">
                    <div class="row">
                      <div class="single-reservation-expandIcon"><i
                          class="las la-angle-down"></i>
                      </div>
                      <div class="single-reservation-head">
                        <div class="single-reservation-flex">
                          <div class="single-reservation-content">
                            <h5 class="single-reservation-content-title"> 예약번호 </h5>
                            <span class="single-reservation-content-id">{{ rv.rvno }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="single-reservation-inner">
                        <div class="single-reservation-item">
                          <div class="single-reservation-details">
                            <div class="single-reservation-details-item">
                              <span class="single-reservation-details-subtitle"> 예약자명 </span>
                              <h5 class="single-reservation-details-title">
                                {{ rv.regName }} </h5>
                            </div>
                            <div class="single-reservation-details-item">
                              <span class="single-reservation-details-subtitle"> 입금자명 </span>
                              <h5 class="single-reservation-details-title">
                                {{ rv.depositName }}</h5>
                            </div>
                            <div class="single-reservation-details-item">
                              <span class="single-reservation-details-subtitle"> 예약인원 </span>
                              <h5 class="single-reservation-details-title">
                                {{ rv.member }}명 </h5>
                            </div>
                            <div class="single-reservation-details-item">
                              <span class="single-reservation-details-subtitle"> 예약날짜 </span>
                              <h5 class="single-reservation-details-title">
                                {{ formatDate(rv.regDate) }} </h5>
                            </div>
                          </div>
                        </div>
                        <div class="single-reservation-item">
                          <div class="single-reservation-flex">
                            <div class="single-reservation-content">
                              <h5 class="single-reservation-content-title"> 확정여부 </h5>
                              <h5 class="single-reservation-details-title">
                                <p v-if="rv.state">최종 예약 완료</p>
                                <p v-else>확인 대기 중</p>
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div class="single-reservation-item">
                          <div class="single-reservation-flex">
                            <div class="single-reservation-content">
                              <h5 class="single-reservation-content-title"> 입금
                                금액 </h5>
                              <span class="single-reservation-content-price"> {{ rv.money }}원 </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useUserStore} from "@/store/UserStore";
import moment from "moment/moment";
import frontSideApiService from "@/services/FrontSideApiService";

export default {
  name: "ReservationDetailComponent",
  data() {
    return {
      reservationlist: [{rvno: '', regName: '', regDate: '', depositName: '', moeny: ''}],
      today: '',
      message: '',
      checkedAuthData: {regName: '', tel1: '', tel2: '', tel3: ''}
    }
  },
  methods: {
    formatDate(dateString) {
      return moment(dateString).format('YYYY/MM/DD');
    },
    async loadReservationData() {
      const userStore = useUserStore();
      const reservationDTO = userStore.reservationDTO;
      let regName, tel1, tel2, tel3;
      if (reservationDTO !== null) {
        regName = reservationDTO.regName;
        tel1 = reservationDTO.tel1;
        tel2 = reservationDTO.tel2;
        tel3 = reservationDTO.tel3;
      }
      let reservationData = {regName: regName || null, tel1: tel1 || null, tel2: tel2 || null, tel3: tel3 || null};
      try {
        const response = await frontSideApiService.reservationDetail(reservationData);
        this.today = response.data.today;
        this.reservationlist = response.data.reservationlist;
        this.message = response.data.message;
        userStore.setReservationDTO(null);
      } catch (error) {
        alert("에러가 발생하였습니다.");
      }
    }
  },
  computed: {
    role() {
      const userStore = useUserStore();
      return userStore.role;
    }
  },
  mounted() {
    const userStore = useUserStore();
    if (userStore.reservationDTO === null && userStore.role === null) {
      this.$router.push('/reservation/check');
    }
    this.loadReservationData();
  }
}
</script>


<style scoped>

</style>