<template>

  <div class="container mab-50 mat-50">
    <div class="login-wrapper-flex">
      <div class="login-wrapper-contents login-padding">
        <div style="margin: 0 auto">
          <h2 style="text-align: center">예약하기</h2>
        </div>
        <form class="login-wrapper-form custom-form padding-top-20"
              @submit.prevent="registerReservation">
          <!--<p class="text-danger" th:text="${errorMessage}" th:if="${errorMessage}"></p>-->
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="regDate">예약날짜</label>
            <input type="text" id="regDate" :value="regDate" class="form--control"
                   readonly>
          </div>
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="member">예약인원</label>
            <select v-model="member" class="form-select" aria-label="Default select example" id="member">
              <option v-for="i in extras" :key="i" :value="i" :selected="i === member">{{ i + '명' }}</option>
            </select>
          </div>
          <div class="single-input mt-4">
            <label class="label-title mb-3">입금금액</label>
            <input type="text" id="money" :value="money" class="form--control" readonly>
          </div>
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="regName">예약자명</label>
            <input type="text" v-model="memberFormDto.name" class="form--control"
                   placeholder="예약자명을 입력해주세요" required>
          </div>
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="name">입금자명</label>
            <input type="text" v-model="depositName" class="form--control" placeholder="입금자명을 입력해주세요" required>
          </div>
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="region">지역</label>
            <input type="text" v-model="region" class="form--control" placeholder="예시) 거제, 부산, 창원, 대전"
                   required>
          </div>
          <div class="single-input mt-4">
            <label class="label-title mb-3" for="tel">전화번호</label>
            <div style="display: flex;">
              <input type="text" id="tel1" v-model="tel1" class="form--control" @input="enforceMaxLength('tel1', 3)"
                     required style="flex: 1;">-
              <input type="text" id="tel2" v-model="tel2" class="form--control" @input="enforceMaxLength('tel2', 4)"
                     required style="flex: 1;">-
              <input type="text" id="tel3" v-model="tel3" class="form--control" @input="enforceMaxLength('tel3', 4)"
                     required style="flex: 1;">
            </div>
            전화번호를 바르게 입력하셔야 예약확인 및 알림전송이 가능합니다
          </div>
          <button class="submit-btn w-100 mt-4" type="submit">예약하기</button>
          <button @click="goToBack" class="btn btn-outline-primary w-100 mt-4" type="button">
            돌아가기
          </button>
        </form>

      </div>
    </div>
  </div>

</template>

<script>

import frontSideApiService from "@/services/FrontSideApiService";
import {useReservationStore} from "@/store/ReservationStore";
import { redirectToPreviousPage } from "@/router/frontRouter";

export default {
  name: "ReservationRegisterComponent",
  data() {
    return {
      fishingMoney: 0,
      extras: "",
      memberFormDto: {email: "", name: ""},
      mainYN: this.$route.query.mainYN,
      regDate: this.$route.query.regDate,
      depositName: "",
      member: 1,
      region: "",
      tel1: "",
      tel2: "",
      tel3: "",
      money: 0
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
    async loadReservationDateDetail() {
      try {
        const response = await frontSideApiService.loadReservationDateDetail(this.regDate)  // 여기서 data를 사용하여 전달);
        this.extras = response.data.extras;
        this.fishingMoney = response.data.fishingMoney;
        this.memberFormDto = response.data.memberFormDto;
        this.calculateCost();
      } catch (error) {
        alert(error.response.data || "데이터를 가져오는 중 문제가 발생했습니다.");
        redirectToPreviousPage();
      }
    },
    async registerReservation() {

      console.log(this.regDate);
      const registerData = {
        email : this.memberFormDto.email || null,
        regDate: this.regDate,
        regName: this.memberFormDto.name,
        member: this.member,
        depositName: this.depositName,
        region : this.region,
        tel1 : this.tel1,
        tel2 : this.tel2,
        tel3 : this.tel3
      }


      try {
        const response = await frontSideApiService.registerReservation(registerData);
        let reservationStore = useReservationStore();
        reservationStore.setRvno(response.data.success);
        this.$router.push('/reservation/success');

      } catch (error) {
        if(error.response.data){
          alert(error.response.data.error);
        }
        alert(error.response.data.error || "전송 중 오류가 발생하였습니다.");
      }
    },
    calculateCost() {
      const fishingMoney = parseInt(this.fishingMoney) || 0;

      // Calculate the total cost
      this.totalCost = this.member * fishingMoney;

      // Format total cost with commas
      const formattedTotalCost = this.totalCost.toLocaleString('en-US');

      // Assign the formatted value to the money input
      this.money = formattedTotalCost + '원';
    },
    goToBack(){
      if(this.mainYN === "true"){
        this.$router.push('/');
      }else {
        this.$router.push('/reservation/list');
      }
    }
  },
  watch: {
    member: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.calculateCost();
      }
    },
  },
  mounted() {
    this.loadReservationDateDetail();
  }
}
</script>


<style scoped>

</style>