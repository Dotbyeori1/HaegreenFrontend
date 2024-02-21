<template>
  <div class="calendar" style="margin-top: -25px;">
    <div class="main">
      <div class="days">
        <div class="day">일</div>
        <div class="day">월</div>
        <div class="day">화</div>
        <div class="day">수</div>
        <div class="day">목</div>
        <div class="day">금</div>
        <div class="day">토</div>
      </div>
      <div class="dates">
        <template v-for="(dateInfo, index) in calendarDates" :key="dateInfo.fullDate">
          <div class="date" v-if="dateInfo.isThisMonth"
               :style="selectedIndex === index ? 'background-color: #c0f2ff' : ''"
               @click="updateAndEmitSelectedDate(dateInfo, index)">
            {{ dateInfo.day }}
            <div style="margin-bottom: 5px;">
              <span class="btn-light btn-sm">종류</span><br/>
              <span style="margin-top: 2px; font-size: 14px; color: black;">{{ dateInfo.fishingSort }}</span></div>
            <div>
                        <span :class="['rounded-pill', dateInfo.btnClass, 'detailBtnClass', 'linkDate']"
                              style="padding: 3px;">
                            {{ dateInfo.btnText }}
                        </span>
            </div>
          </div>
          <div v-else class="date"></div>
        </template>
      </div>
    </div>
  </div>

  <table class="table table-bordered" style="max-width: 950px; margin: 0 auto 50px auto;">
    <thead>
    <tr class="table-light">
      <th colspan="4" style="text-align: center;">
        {{ selectedDateDetails.fullDate }} ({{ selectedDateDetails.dayOfWeek }})
      </th>
    </tr>
    <tr class="table-light">
      <th style="width:17%; text-align: center;">예약</th>
      <th style="width:25%;text-align: center;">공지사항</th>
      <th style="width:35%;text-align: center;">예약명단</th>
      <th style="width:23%;text-align: center;">남은인원</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>
        <button :class="['btn', selectedDateDetails.btnClass, 'detailBtnClass', 'linkDate']"
                style="width: 100%; height: 100%; text-align: center;"
                :data-full-date="selectedDateDetails.fullDate"
                @click="linkToRegister(selectedDateDetails.fullDate, selectedDateDetails.isAvailable)">
          {{ selectedDateDetails.btnText }}
        </button>
      </td>
      <td>{{ selectedDateDetails.message }}</td>
      <td>
        <div style="margin-bottom: 5px;">
          <span class="btn-light btn-sm">종류</span>&nbsp;
          <span>{{ selectedDateDetails.fishingSort }}</span>
        </div>
        <div v-html="getRegInfoHtml(selectedDateDetails.fullDate)"></div>
      </td>
      <td>{{ selectedDateDetails.extraMembers }}명</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import {useReservationStore} from "@/store/ReservationStore";
import moment from "moment";

export default {
  name: "ReservationCalendarComponent",
  props: {
    reservationData: Object,
    selectedDate: String,
  },
  data() {
    return {
      calendarDates: [],
      dayNames: ["일", "월", "화", "수", "목", "금", "토"],
      selectedIndex: null, // select된 요소의 인덱스 번호
      selectedDateDetails: {
        fullDate: '',
        dayOfWeek: '',
        isAvailable: false,
        message: '',
        extraMembers: 0,
        dateModify: false,
        btnClass: '',
        btnText: '',
      }
    }
  },
  methods: {
    formatDate(dateString) {
      return moment(dateString).format('YYYY-MM-DD');
    },
    renderCalendar() {
      const reservationStore = useReservationStore();

      this.calendarDates = []; // 캘린더 날짜를 저장할 배열을 초기화합니다.

      const today = this.formatDate(new Date());

      const selectedYear = parseInt(this.selectedDate.split("-")[0]);
      const selectedMonth = parseInt(this.selectedDate.split("-")[1]) - 1;

      // 지난 달 마지막 Date, 이번 달 마지막 Date
      const prevLast = new Date(selectedYear, selectedMonth, 0);
      const thisLast = new Date(selectedYear, selectedMonth + 1, 0);

      const PLDate = prevLast.getDate();
      const PLDay = prevLast.getDay();

      const TLDate = thisLast.getDate();
      const TLDay = thisLast.getDay();

      // Dates 기본 배열들
      const prevDates = [];
      const thisDates = [...Array(TLDate + 1).keys()].slice(1);
      const nextDates = [];

      // prevDates 계산
      if (PLDay !== 6) {
        for (let i = 0; i < PLDay + 1; i++) {
          prevDates.unshift(PLDate - i);
        }
      }

      // nextDates 계산
      for (let i = 1; i < 7 - TLDay; i++) {
        nextDates.push(i)
      }

      const dates = prevDates.concat(thisDates, nextDates);

      // 해당 월의 모든 날짜를 순회하면서 날짜 정보를 생성합니다.
      dates.forEach((currentDate, i) => {
        const day = currentDate;
        const paddedMonth = String(selectedMonth + 1).padStart(2, '0');
        const paddedDate = String(currentDate).padStart(2, '0');
        const fullDate = `${selectedYear}-${paddedMonth}-${paddedDate}`;
        const thisDate = new Date(selectedYear, selectedMonth, day);
        const dayOfWeek = this.dayNames[thisDate.getDay()];
        const confirmedMemberCount = this.reservationData.reservationCountByDate[fullDate]?.confirmedMember || 0;
        const extraMembers = this.reservationData.extraMembersBydate[fullDate] || 0;
        const isAvailable = this.reservationData.availabilityByDate[fullDate] && (extraMembers - confirmedMemberCount > 0);
        const isThisMonth = i >= prevDates.length && i < (prevDates.length + thisDates.length);
        const availableByDate = this.reservationData.availabilityByDate[fullDate] || false;

        const dateInfo = {
          day,
          fullDate,
          dayOfWeek,
          isAvailable,
          fishingSort: this.reservationData.fishingSortBydate[fullDate] || '',
          message: this.reservationData.messageByDate[fullDate] || '',
          extraMembers: extraMembers - confirmedMemberCount,
          dateModify: this.reservationData.dateModifyByDate[fullDate] || false,
          btnClass: this.getButtonClass(fullDate),
          btnText: this.getButtonText(fullDate),
          isThisMonth,
          availableByDate
        };
        this.calendarDates.push(dateInfo);
      });

      if (reservationStore.userSelectedDateDetail === null) {
        const todayIndex = this.calendarDates.findIndex(dateInfo => dateInfo.fullDate === today);

        if (todayIndex !== -1) {
          this.selectedIndex = todayIndex;
          this.selectedDateDetails = {...this.calendarDates[todayIndex]};
        }
      }else {
        const selectedIndex = this.calendarDates.findIndex(dateInfo => dateInfo.fullDate === reservationStore.userSelectedDateDetail.fullDate);

        if (selectedIndex !== -1) {
          this.selectedIndex = selectedIndex;
          this.selectedDateDetails = {...this.calendarDates[selectedIndex]};
        }else {
          this.selectedDateDetails = reservationStore.userSelectedDateDetail;
        }
      }
    },
    getButtonClass(fullDate) {
      const availableDate = this.reservationData.availabilityByDate[fullDate] || false;
      const availableSeats = this.reservationData.extraMembersBydate[fullDate] - (this.reservationData.reservationCountByDate[fullDate]?.confirmedMember || 0);
      if (availableDate && availableSeats > 0) {
        return 'btn-success';
      } else if (availableDate && availableSeats === 0) {
        return 'btn-warning';
      } else {
        return 'btn-danger';
      }
    },
    getButtonText(fullDate) {
      const availableDate = this.reservationData.availabilityByDate[fullDate] || false;
      const availableSeats = this.reservationData.extraMembersBydate[fullDate] - (this.reservationData.reservationCountByDate[fullDate]?.confirmedMember || 0);
      if (availableDate && availableSeats > 0) {
        return '예약가능';
      } else if (availableDate && availableSeats === 0) {
        return '예약완료';
      } else {
        return '예약불가';
      }
    },
    linkToRegister(fullDate, isAvailable) {
      if (isAvailable) {
        this.$router.push(`/reservation/register?mainYN=false&regDate=${fullDate}`);
      }
    },
    getRegInfoHtml(fullDate) {
      const regInfoArray = this.reservationData.reservationCountByDate[fullDate]?.regInfo;
      return Array.isArray(regInfoArray) ? regInfoArray.join('<br/>') : '';
    },
    updateAndEmitSelectedDate(dateInfo, index) {
      // 선택된 요소의 인덱스 업데이트
      this.selectedIndex = index;

      // 얕은 복사를 사용하여 선택된 날짜 정보 업데이트
      this.selectedDateDetails = {...dateInfo};

      // pinia 사용
      const reservationStore = useReservationStore();
      reservationStore.setUserSelectedDateDetail(this.selectedDateDetails);
    }
  },
  mounted() {
    this.renderCalendar();
  },
  watch: {
    selectedDate() {
      this.selectedIndex=null;
      this.renderCalendar();
    }
  }
}
</script>


<style scoped>
.calendar {
  max-width: 950px;
  margin: 50px auto;
}

@media (max-width: 995px) {
  .calendar {
    min-height: 820px;
  }
}


.days {
  display: flex;
  margin: 25px 0 10px;
}

.day {
  width: calc(100% / 7);
  text-align: center;
}

.dates {
  display: flex;
  flex-flow: row wrap;
  min-height: 500px;
  border-top: 1px solid #b9bbbe;
  border-right: 1px solid #b9bbbe;
}

.date {
  width: calc(100% / 7);
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #b9bbbe;
  border-left: 1px solid #b9bbbe;
}

.day:nth-child(7n + 1),
.date:nth-child(7n + 1) {
  color: #D13E3E;
}

.day:nth-child(7n),
.date:nth-child(7n) {
  color: #396EE2;
}

</style>