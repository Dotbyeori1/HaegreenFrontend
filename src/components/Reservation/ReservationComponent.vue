<template>
  <section class="about-area pat-50 pab-75">
    <div class="container">
      <div class="row justify-content-between">
        <div
            style="position:relative; max-width: 950px; height: 60px; margin: 50px auto; border: #1a1e21 2px solid; border-radius: 10px;">
          <span style="position:absolute; left:10px; width: 200px; margin: 10px 0;">
            <select class="form-select" v-model="selectedDate">
              <option v-for="date in dateOptions" :key="date.value" :value="date.value">{{ date.label }}</option>
            </select>
          </span>
          <span id="tab-buttons" style="position:absolute; right: 10px; width:90px; margin: 10px 0;">
            <button class="btn btn-outline-dark" style="width: 40px; height: 40px; margin-right: 10px;"
                    @click="changeTab(false)"><i class="las la-bars"></i></button>
            <button class="btn btn-outline-dark" style="width: 40px; height: 40px;"
                    @click="changeTab(true)"><i class="las la-calendar"></i></button>
          </span>
        </div>
        <ReservationCalendarComponent v-if="change" :reservationData="reservationData" :selectedDate="selectedDate"></ReservationCalendarComponent>
        <ReservationListComponent v-if="!change" :reservationData="reservationData" :selectedDate="selectedDate"></ReservationListComponent>
      </div>
    </div>
  </section>
</template>

<script>
import ReservationCalendarComponent from "@/components/Reservation/ReservationCalendarComponent.vue";
import ReservationListComponent from "@/components/Reservation/ReservationListComponent.vue";
import frontSideApiService from "@/services/FrontSideApiService";

export default {
  name: "ReservationComponent",
  components: {ReservationListComponent, ReservationCalendarComponent},
  data() {
    return {
      change: false, // 기본 출력 defalut
      selectedDate: "", // 초기 선택값
      selectedInfoData: {},
      reservationData: {
        reservations: [],
        reservationDates: [],
        reservationCountByDate: {},
        availabilityByDate: {},
        messageByDate: {},
        fishingSortBydate: {},
        extraMembersBydate: {},
        dateModifyByDate: {},
      }, // reservationDate 데이터 배열
      monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    }
  }, methods: {
    async getReservationsData() {
      const response = await frontSideApiService.loadReservationData();
      try {
        this.reservationData.reservations = response.data.reservationDTOS;
        this.reservationData.reservationDates = response.data.reservationDateDTOS;

        this.processReservations();
        this.processReservationDates();
      } catch (error) {
        alert("데이터를 불러오는 중 오류가 발생하였습니다.");
      }
    },
    changeTab(isChange) {
      this.change = isChange;
    },
    processReservations() {
      const reservationCountByDate = {};

      this.reservationData.reservations.forEach(reservation => {
        const date = reservation.regDate;
        const state = reservation.state;
        const memberCount = reservation.member;
        const regName = reservation.regName;

        if (!reservationCountByDate[date]) {
          reservationCountByDate[date] = {
            totalMember: 0,
            confirmedMember: 0,
            regInfo: []
          };
        }

        reservationCountByDate[date].totalMember += memberCount;

        if (state) {
          reservationCountByDate[date].confirmedMember += memberCount;
          reservationCountByDate[date].regInfo.push(`${regName}님(${memberCount}명)`);
        }
      });

      this.reservationData.reservationCountByDate = reservationCountByDate;
    },
    processReservationDates() {
      const availabilityByDate = {};
      const messageByDate = {};
      const fishingSortBydate = {};
      const extraMembersBydate = {};
      const dateModifyByDate = {};

      this.reservationData.reservationDates.forEach(reservationDate => {
        const regDate = reservationDate.regDate;
        availabilityByDate[regDate] = reservationDate.available;
        messageByDate[regDate] = reservationDate.message;
        fishingSortBydate[regDate] = reservationDate.fishingSort;
        extraMembersBydate[regDate] = reservationDate.extrasMembers;
        dateModifyByDate[regDate] = reservationDate.dateModify;
      });

      this.reservationData.availabilityByDate = availabilityByDate;
      this.reservationData.messageByDate = messageByDate;
      this.reservationData.fishingSortBydate = fishingSortBydate;
      this.reservationData.extraMembersBydate = extraMembersBydate;
      this.reservationData.dateModifyByDate = dateModifyByDate;
    },
    handleDateSelected(selectedDateDetails) {
      this.selectedInfoData = selectedDateDetails;
      console.log(this.selectedInfoData);
    }
  },
  computed: {
    dateOptions() {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const options = [];

      for (let i = 0; i < 3; i++) {
        const year = currentYear + Math.floor((currentMonth + i) / 12);
        const month = (currentMonth + i) % 12;

        options.push({
          value: `${year}-${month + 1}`,
          label: `${year}년 ${month + 1}월`,
        });
      }

      return options;
    }
  },
  mounted() {
    // 초기 선택값 설정
    this.selectedDate = this.dateOptions[0].value;
    this.getReservationsData();
  }
}

</script>

<style scoped>

</style>
