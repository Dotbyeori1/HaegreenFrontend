<template>
  <div class="dashboard-area section-bg-2 pat-100 pab-100">
    <div class="container">
      <div class="dashboard-contents-wrapper">
        <div class="dashboard-right-contents mt-4 mt-lg-0">
          <div class="dashboard-reservation">
            <div class="single-reservation bg-white base-padding">
              <h4 class="card-title" style="left: 0;">{{ dto.title }}</h4>
              <div style="width: 100%; border-bottom: #000000 solid 1px; margin-top: 10px;"></div>
              <p class="card-text" v-html="dto.content" style="margin-top: 20px;"></p>
              <div v-for="img in noticeBoardImgs" :key="img.ino">
                <br/>
                <img :src="`http://localhost/haegreen/${img.uuidfileName}`" :alt="img.realfileName">
                <br/>
              </div>
              <p style="margin-top: 20px; text-align: right;">작성일 : {{ formatDate(dto.regTime) }}<br/>
                수정일 : {{ formatDate(dto.modTime) }}</p>
              <div class="button-container" style="text-align: center">
                <router-link
                    :to="{ name: 'NoticeBoardList', query: { nbno: dto.nbno, page: page, type: type, keyword: keyword }}">
                  <button type="button" class="btn btn-info">목록으로</button>
                </router-link>

                <router-link v-if="role === 'ADMIN'"
                             :to="{ name: 'NoticeBoardModify', query: { nbno: dto.nbno, page: page, type: type, keyword: keyword }}">
                  <button type="button" class="btn btn-outline-primary">수정하기</button>
                </router-link>

                <button type="button" class="btn btn-danger removeBtn" v-if="role === 'ADMIN'" @click="removeNoticeBoard">
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {useUserStore} from "@/store/UserStore";
import frontSideApiService from "@/services/FrontSideApiService";

export default {
  name: "NoticeBoardReadComponent",
  data() {
    return {
      nbno: this.$route.query.nbno,
      page: this.$route.query.page,
      type: this.$route.query.type,
      keyword: this.$route.query.keyword,
      dto: {title: '', content: '', regTime: '', modTime: ''},
      noticeBoardImgs: [{ino: '', uuidfileName: '', realfileName: ''}]
    }
  },
  methods: {
    formatDate(dateString) {
      return moment(dateString).format('YYYY/MM/DD HH:mm:ss');
    },
    async getBoardDTO() {
      try {
        const response = await frontSideApiService.noticeBoardRead({params: {nbno: this.nbno}});
        this.dto = response.data.dto;
        this.noticeBoardImgs = response.data.noticeBoardImgs;
      } catch (error) {
        alert("데이터 불러오기 실패");
      }
    },
    async removeNoticeBoard() {
      let result = confirm("삭제하시겠습니까?");
      if(!result) return null;

      try {
        const response = await frontSideApiService.noticeBoardDelete({nbno: this.nbno});
        alert(response.data.success);
        this.$router.push({
          path: '/noticeboard/list',
          query: {
            page: this.page,
            type: this.type,
            keyword: this.keyword
          }
        });
      } catch (error) {
        alert("게시물 삭제 실패");
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
    this.getBoardDTO();
  }
}
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button-container button {
  margin: 0 5px;
}
</style>