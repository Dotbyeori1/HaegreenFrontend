<template>
  <div class="image-container">
    <img src="@/assets/assets/img/28d2cb4be026526627ec53c493d9877f.jpg" alt="img">
  </div>

  <section class="about-area pat-75 pab-75">
    <div class="container">
      <div class="weeklyReservation">
        <div style="width: 325px; height: 50px; margin: 0 auto;"><h3 style="text-align: center;">이번주 예약 및
          예약현황</h3></div>
        <div class="dates">
          <div v-for="(dateInfo, index) in calendarDates" :key="index" class="date">
            <h5>{{ dateInfo.displayDate }} ({{ dateInfo.dayOfWeek }})</h5>
            <div style="text-align: center; margin-top: 5px;">
              <b>{{ dateInfo.isAvailable ? '종류' : (dateInfo.dateModify ? '결항사유' : '종류') }}</b><br/>
              {{
                dateInfo.isAvailable ? dateInfo.fishingSort : (dateInfo.dateModify ? dateInfo.message : dateInfo.fishingSort)
              }}<br/>
              <b>남은인원</b><br/>
              {{ dateInfo.extraMembers }}명<br/>
              <button class="btn" :class="dateInfo.btnClass"
                      @click="redirectToReservation(dateInfo.fullDate, dateInfo.isAvailable)">
                {{ dateInfo.isAvailable ? '예약가능' : '예약불가' }}
              </button>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 50px;">
          <button class="btn btn-info" style="font-size: 18px; width: 200px; height: 50px;"
                  @click="redirectToReservationList()"><i class="las la-calendar"></i>예약현황보기
          </button>
        </div>

        <div class="row center-text" style="margin:75px auto">
          <div class="section-title text-left append-flex">
            <div style="width: 325px; margin: 0 auto;"><h3 style="text-align: center;">조황현황</h3></div>
            <div class="append-attraction"></div>
          </div>
          <div class="row mt-5">
            <div class="col-12"
                 v-if="jowhangBoard != null && jowhangBoard.dtoList != null">
              <div class="global-slick-init attraction-slider nav-style-one slider-inner-margin">
                  <div class="attraction-item" v-for="dto in jowhangBoard.dtoList" :key="dto.jbno"
                     style="width: 24%;">
                    <div class="single-attraction radius-20">
                      <div class="single-attraction-thumb">
                        <router-link :to="{ path: '/jowhangboard/read', query: { jbno: dto.jbno } }">
                          <img src="@/assets/jowhangtitle.jpg"
                             :alt="dto.title">
                        </router-link>
                      </div>
                    <div class="single-attraction-contents">
                      <h4 class="single-attraction-contents-title"
                          style="white-space: nowrap; overflow: hidden;  text-overflow: ellipsis;">
                        <router-link :to="{ path: '/jowhangboard/read', query: { jbno: dto.jbno } }">
                          {{ dto.title }}
                        </router-link>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="max-width: 950px; margin: 75px auto;">
          <h3 style="text-align: center;">입금 계좌 안내</h3>
          <table class="table table-bordered" style="margin-top: 20px;">
            <thead>
            <tr class="table-dark">
              <th style="width: 27%">입금은행</th>
              <th style="width: 46%">계좌번호</th>
              <th style="width: 27%">예금주명</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>농협</td>
              <td>356-0402-7662-83&nbsp;<button class="btn btn-dark" @click="copyTextToClipboard">복사하기</button>
                <span>{{ copyStatus }}</span>
              </td>
              <td>김동수</td>
            </tr>
            </tbody>
          </table>
        </div>


        <div class="contact-map">
          <div class="mt-2" style="width: 300px; margin: 0 auto">
            <h3 style="text-align: center;">오시는길</h3>
          </div>
          <div class="hotel-view-contents-location mt-2" style="width: 300px; margin: 0 auto;">
            <span class="hotel-view-contents-location-para" style="text-align: center;">
            <span class="hotel-view-contents-location-icon">
            <i class="las la-map-marker-alt"></i>
          </span>
          <a href="https://naver.me/xAtwY12g" target="_blank">전라남도 여수시 신월동 120-46</a>
        <div style="text-align:center; margin-top: 10px;">
          <button class="btn btn-info" type="button" style="font-size: 18px; width: 200px; height: 50px;"
                  @click="openNaverMap">
            <i class="lar la-map"></i>네이버지도
          </button>
        </div>
      </span>
          </div>
          <MapComponent></MapComponent>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import frontSideApiService from "@/services/FrontSideApiService";
import MapComponent from "@/components/MapComponent.vue";
import $ from 'jquery'
import 'slick-carousel';

export default {
  name: "MainComponent",
  components: {MapComponent},
  data() {
    return {
      reservations: [], // reservations 데이터 배열
      reservationDates: [], // reservationDate 데이터 배열
      jowhangBoard: {dtoList: []}, // 조황게시판
      calendarDates: [], // 캘린더 뷰를 위한 데이터 배열
      dayNames: ["일", "월", "화", "수", "목", "금", "토"],
      reservationCountByDate: {},
      availabilityByDate: {},
      messageByDate: {},
      fishingSortBydate: {},
      extraMembersBydate: {},
      dateModifyByDate: {},
      copyStatus: "", // 복사실패
    }
  },
  async mounted() {
    await this.getMainData();
    this.$nextTick(function() {
      $(".global-slick-init").slick({
        appendArrows: ".append-attraction",
        infinite: true,
        arrows: true,
        dots: false,
        slidesToShow: 4,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 2500,
        prevArrow: '<div class="prev-icon"><i class="las la-angle-left"></i></div>',
        nextArrow: '<div class="next-icon"><i class="las la-angle-right"></i></div>',
        responsive: [
          {
            breakpoint: 1400,
            settings: {
              slidesToShow: 4
            }
          },
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      });
    });
  },
  beforeUnmount() {
    $(".global-slick-init").slick('unslick');
  },
  methods: {
    redirectToReservationList() {
      this.$router.push('/reservation/list');
    },
    async getMainData() {
      try {
        const response = await frontSideApiService.getMain();

        this.reservations = response.data.reservationDTOS;
        this.reservationDates = response.data.reservationDateDTOS;
        this.jowhangBoard = response.data.jowhangBoard;

        this.processReservationDates();
        this.processReservations();
        this.renderCalendar();

      } catch (error) {
        console.log(error.response.data)
        alert(error.response.data.error || "데이터를 가져오는 중 문제가 발생했습니다.");
      }
    },
    openNaverMap() {
      window.open("https://naver.me/xAtwY12g", "_blank");
    },
    async copyTextToClipboard() {
      const text = '농협 356-0402-7662-83';
      if (!navigator.clipboard) {
        this.copyStatus = '클립보드에 접근할 수 없습니다.';
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        this.copyStatus = '복사성공';
        setTimeout(() => {
          this.copyStatus = '';
        }, 1500);
      } catch (err) {
        console.error('Error copying text: ', err);
        this.copyStatus = '복사실패';
        setTimeout(() => {
          this.copyStatus = '';
        }, 1500);
      }
    },
    processReservations() {
      const reservationCountByDate = {};

      this.reservations.forEach(reservation => {
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
        }

        reservationCountByDate[date].regInfo.push(`${regName}님(${memberCount}명)`);
      });

      this.reservationCountByDate = reservationCountByDate;
    },
    processReservationDates() {
      const availabilityByDate = {};
      const messageByDate = {};
      const fishingSortBydate = {};
      const extraMembersBydate = {};
      const dateModifyByDate = {};

      this.reservationDates.forEach(reservationDate => {
        const regDate = reservationDate.regDate;
        availabilityByDate[regDate] = reservationDate.available;
        messageByDate[regDate] = reservationDate.message;
        fishingSortBydate[regDate] = reservationDate.fishingSort;
        extraMembersBydate[regDate] = reservationDate.extrasMembers;
        dateModifyByDate[regDate] = reservationDate.dateModify;
      });

      this.availabilityByDate = availabilityByDate;
      this.messageByDate = messageByDate;
      this.fishingSortBydate = fishingSortBydate;
      this.extraMembersBydate = extraMembersBydate;
      this.dateModifyByDate = dateModifyByDate;
    },
    renderCalendar() {
      const today = new Date();
      const viewYear = today.getFullYear();
      const viewMonth = today.getMonth();
      const viewDay = today.getDate();

      for (let i = 0; i < 8; i++) {
        const thisDate = new Date(viewYear, viewMonth, viewDay + i);
        const paddedMonth = String(thisDate.getMonth() + 1).padStart(2, '0');
        const paddedDate = String(thisDate.getDate()).padStart(2, '0');
        const fullDate = `${thisDate.getFullYear()}-${paddedMonth}-${paddedDate}`;
        const dayOfWeek = this.dayNames[thisDate.getDay()];
        const confirmedMemberCount = this.reservationCountByDate[fullDate]?.confirmedMember || 0;
        const extraMembers = this.extraMembersBydate[fullDate] || 0;
        const isAvailable = this.availabilityByDate[fullDate] && (extraMembers - confirmedMemberCount > 0);

        const dateInfo = {
          fullDate,
          displayDate: `${paddedMonth}-${paddedDate}`,
          dayOfWeek,
          isAvailable,
          fishingSort: this.fishingSortBydate[fullDate] || '',
          message: this.messageByDate[fullDate] || '',
          extraMembers: extraMembers - confirmedMemberCount,
          dateModify: this.dateModifyByDate[fullDate] || false,
          btnClass: this.getButtonClass(fullDate),
          btnText: this.getButtonText(fullDate, extraMembers - confirmedMemberCount)
        };

        this.calendarDates.push(dateInfo);
      }
    },
    getButtonClass(fullDate) {
      const availableDate = this.availabilityByDate[fullDate] || false;
      const availableSeats = this.extraMembersBydate[fullDate] - (this.reservationCountByDate[fullDate]?.confirmedMember || 0);
      if (availableDate && availableSeats > 0) {
        return 'btn-success';
      } else if (availableDate && availableSeats === 0) {
        return 'btn-warning';
      } else {
        return 'btn-danger';
      }
    },
    getButtonText(fullDate) {
      const availableDate = this.availabilityByDate[fullDate] || false;
      const availableSeats = this.extraMembersBydate[fullDate] - (this.reservationCountByDate[fullDate]?.confirmedMember || 0);
      if (availableDate && availableSeats > 0) {
        return '예약가능';
      } else if (availableDate && availableSeats === 0) {
        return '예약완료';
      } else {
        return '예약불가';
      }
    },
    redirectToReservation(fullDate, isAvailable) {
      if (isAvailable) {
        window.location.href = `Reservation/register?mainYN=false&regDate=${fullDate}`;
      }
    }
  }
}

</script>

<style scoped>
.image-container img {
  object-fit: cover;
  width: 100%;
  max-height: 400px;
}

.weeklyReservation {
  position: relative;
  max-width: 950px;
  margin: 0 auto;
}

.dates {
  display: flex;
  flex-flow: row wrap;
  border-top: 2px solid #333333;
  border-bottom: 1px solid #333333;
}

.date {
  width: calc(100% / 4);
  height: 175px;
  margin: 25px auto 25px auto;
  align-content: center;
  text-align: center;
}
</style>