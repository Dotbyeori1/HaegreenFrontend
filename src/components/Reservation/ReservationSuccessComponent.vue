<template>
  <section class="confirmation-area section-bg-2 pat-100 pab-100">
    <div class="container">
      <div class="confirmation-contents center-text">
        <div class="confirmation-contents-icon">
          <i class="las la-check"></i>
        </div>
        <h4 class="confirmation-contents-title"> 예약이 완료 되었습니다. </h4>
        <p class="confirmation-contents-para"> 예약번호는 {{ rvno }}번 입니다. 예약확인은 예약확인 메뉴를 참고해주세요.<br/>
          예약확정시 조우님께서 입력하신 전화번호로 확정 문자메세지가 전송됩니다. <br/> 이용해 주셔서 감사합니다! </p>
        <div class="btn-wrapper flex-btn mt-4 mt-lg-5">
          <router-link to="/" class="cmn-btn btn-outline-1 color-one"> 메인으로</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {useReservationStore} from "@/store/ReservationStore";

export default {
  name : "ReservationSuccessComponent",
  data() {
    return { rvno : "" }
  },
  methods : {
    getRvno(){
      const reservationStore = useReservationStore();
      this.rvno = reservationStore.rvno;
    },
    resetRvno() {
      const reservationStore = useReservationStore();
      reservationStore.setRvno(null);
    }
  },
  mounted() {
    this.getRvno();
  },
  unmounted() {
    this.resetRvno();
  }
}
</script>

<style scoped>

</style>