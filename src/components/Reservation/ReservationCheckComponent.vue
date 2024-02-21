<template>
  <div class="container mab-25">
    <div class="login-wrapper-flex">
      <div class="login-wrapper-contents login-padding">
        <form class="login-wrapper-form custom-form padding-top-20"
              @submit.prevent="reservationCheck()" id="register" method="post">
          <div style="margin: 0 auto">
            <h2 style="text-align: center">예약확인</h2>
          </div>
          <p class="text-danger" v-if="message">{{message}}</p>
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="regName">예약자명</label>
            <input type="text" v-model="regName" class="form--control" placeholder="예약자명을 입력해주세요" required>
          </div>
          <div class="single-input mt-4">
            <label class="label-title mb-3" th:for="tel">전화번호</label>
            <div style="display: flex;">
              <input type="text" id="tel1" v-model="tel1" class="form--control" @input="enforceMaxLength('tel1', 3)" required style="flex: 1;">-
              <input type="text" id="tel2" v-model="tel2" class="form--control" @input="enforceMaxLength('tel2', 4)" required style="flex: 1;">-
              <input type="text" id="tel3" v-model="tel3" class="form--control" @input="enforceMaxLength('tel3', 4)" required style="flex: 1;">
            </div>
          </div>
          <button class="submit-btn w-100 mt-4" type="submit">예약확인</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {useUserStore} from "@/store/UserStore";
import frontSideApiService from "@/services/FrontSideApiService";

export default {
  data(){
    return {
      message : '',
      regName : '',
      tel1 : '',
      tel2 : '',
      tel3 : ''
    }
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
    async reservationCheck() {
      let checkData = {
        regName : this.regName,
        tel1 : this.tel1,
        tel2 : this.tel2,
        tel3 : this.tel3 }
      try {
        const response = await frontSideApiService.reservationCheck(checkData);
        const userStore = useUserStore();
        userStore.setReservationDTO(response.data.dataObject);
        this.$router.push('/reservation/details');
      }catch (error){
        if(error.response){
          this.message = error.response.data.error;
        }
      }
    }
  }
}
</script>

<style scoped>

</style>