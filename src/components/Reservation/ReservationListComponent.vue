<template>
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

  <table class="table table-bordered border-dark"
         style="max-width: 950px; margin: 0 auto 50px auto;">
    <thead>
    <tr class="table-light">
      <th style="width:20%; text-align: center;">날짜</th>
      <th style="width:22%; text-align: center;">예약</th>
      <th style="width:35%; text-align: center;">예약명단</th>
      <th style="width:23%; text-align: center;">남은인원</th>
    </tr>
    </thead>
    <tbody class="dates2">
    <template v-for="(dateInfo, index) in listDates" :key="dateInfo.fullDate">
      <tr class="date" v-if="new Date(dateInfo.fullDate) >= new Date(new Date().setHours(0,0,0,0))"
          :style="selectedIndex === index ? 'background-color: #c0f2ff' : ''"
          @click="updateAndEmitSelectedDate(dateInfo, index)">
        <td class="col">
          {{ dateInfo.fullDate }}({{ dateInfo.dayOfWeek }})
        </td>
        <td>
          <button :class="['btn', dateInfo.btnClass, 'detailBtnClass', 'linkDate']"
                  style="width: 100%; height: 100%; text-align: center;"
                  :data-full-date="dateInfo.fullDate"
                  @click="linkToRegister(dateInfo.fullDate, dateInfo.isAvailable)">
            {{ dateInfo.btnText }}
          </button>
        </td>
        <td class="override-color">
          <div style="margin-bottom: 5px;">
            <span class="btn-light btn-sm">종류</span>&nbsp;
            <span style="margin-top: 2px; font-size: 14px">{{ dateInfo.fishingSort }}</span>
          </div>
          <div class="dataRegInfo">
            <div v-html="getRegInfoHtml(dateInfo.fullDate)"></div>
          </div>
        </td>
        <td class="override-color">{{ dateInfo.extraMembers }}명</td>
      </tr>
    </template>
    </tbody>
  </table>
</template>

<script>
import {useReservationStore} from "@/store/ReservationStore";
import moment from "moment/moment";

export default {
  name: "ReservationListComponent",
  props: {
    reservationData: Object,
    selectedDate: String,
  },
  data() {
    return {
      listDates: [],
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
        btnText: ''
      }
    }
  },
  methods: {
    formatDate(dateString) {
      return moment(dateString).format('YYYY-MM-DD');
    },
    renderList() {
      const reservationStore = useReservationStore();

      const today = this.formatDate(new Date())

      const selectedYear = parseInt(this.selectedDate.split("-")[0]);
      const selectedMonth = parseInt(this.selectedDate.split("-")[1]) - 1;

      const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0); // 해당 월의 마지막 날을 구합니다.

      this.listDates = []; // 캘린더 날짜를 저장할 배열을 초기화합니다.

      // 해당 월의 모든 날짜를 순회하면서 날짜 정보를 생성합니다.
      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const thisDate = new Date(selectedYear, selectedMonth, day);
        const paddedMonth = String(thisDate.getMonth() + 1).padStart(2, '0');
        const paddedDate = String(thisDate.getDate()).padStart(2, '0');
        const fullDate = `${thisDate.getFullYear()}-${paddedMonth}-${paddedDate}`;
        const dayOfWeek = this.dayNames[thisDate.getDay()];
        const confirmedMemberCount = this.reservationData.reservationCountByDate[fullDate]?.confirmedMember || 0;
        const extraMembers = this.reservationData.extraMembersBydate[fullDate] || 0;
        const isAvailable = this.reservationData.availabilityByDate[fullDate] && (extraMembers - confirmedMemberCount > 0);

        const dateInfo = {
          fullDate,
          displayDate: `${paddedMonth}-${paddedDate}`,
          dayOfWeek,
          isAvailable,
          fishingSort: this.reservationData.fishingSortBydate[fullDate] || '',
          message: this.reservationData.messageByDate[fullDate] || '',
          extraMembers: extraMembers - confirmedMemberCount,
          dateModify: this.reservationData.dateModifyByDate[fullDate] || false,
          btnClass: this.getButtonClass(fullDate),
          btnText: this.getButtonText(fullDate),
        };
        this.listDates.push(dateInfo);
      }

      if (reservationStore.userSelectedDateDetail === null) {
        const todayIndex = this.listDates.findIndex(dateInfo => dateInfo.fullDate === today);

        if (todayIndex !== -1) {
          this.selectedIndex = todayIndex;
          this.selectedDateDetails = {...this.listDates[todayIndex]};
        }
      }else {
        const selectedIndex = this.listDates.findIndex(dateInfo => dateInfo.fullDate === reservationStore.userSelectedDateDetail.fullDate);

        if (selectedIndex !== -1) {
          this.selectedIndex = selectedIndex;
          this.selectedDateDetails = {...this.listDates[selectedIndex]};
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

      const reservationStore = useReservationStore();
      reservationStore.setUserSelectedDateDetail(this.selectedDateDetails);
    }
  },
  watch: {
    'reservationData.reservations': {
      immediate: true, // 초기 로딩 시에도 실행
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          // 데이터가 로드된 경우에만 처리
          this.renderList();
        }
      }
    },
    selectedDate() {
      this.selectedIndex=null;
      this.renderList();
    },
    selectedInfoData(oldVal, newVal) {
      if (oldVal !== newVal) {
        this.renderList();
      }
    }
  }
}
</script>


<style scoped>
.dates2 {
  border-left: 1px solid #b9bbbe;
  border-right: 1px solid #b9bbbe;
  border-bottom: 1px solid #b9bbbe;
}

.day:nth-child(7n + 1),
.date:nth-child(7n + 1) {
  color: #D13E3E;
}

.day:nth-child(7n),
.date:nth-child(7n) {
  color: #396EE2;
}

.override-color {
  color: black !important;
}
</style>