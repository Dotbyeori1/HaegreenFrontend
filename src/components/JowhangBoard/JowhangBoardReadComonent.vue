<template>
  <section class="blog-details-area pat-100 pab-100">
    <div class="container">
      <div class="row gy-5">
        <div class="col-xl-12 col-lg-12">
          <div class="blog-details-wrapper">
            <div class="single-blog-details">
              <div class="single-blog-details-content pt-0">
                <h2 class="single-blog-details-content-title fw-500"> {{dto.title}} </h2>
                <div class="single-blog-details-content-tags mt-3">
                  <span class="single-blog-details-content-tags-item">
                    최근 업데이트 : {{ formatDate(dto.modTime) }}
                  </span>
                </div>
                <div v-for="img in jowhangBoardImgs" :key="img.ino">
                  <br/>
                  <img :src="`http://localhost/haegreen/${img.uuidfileName}`" :alt="img.realfileName">
                  <br/>
                </div>
                <p class="card-text" style="margin-top: 20px;" v-html="dto.content"></p>
              </div>
            </div>
            <!-- Details Tag area starts -->
            <div class="details-tag-area color-two pat-25 pab-50">
              <div class="row align-items-center">
                <div class="col-lg-6 mt-4">
                  <div class="blog-details-share-content">
                    <h4 class="blog-details-share-content-title"> Share: </h4>
                    <ul class="blog-details-share-social list-style-none">
                      <li class="blog-details-share-social-list">
                        <a class="blog-details-share-social-list-icon"
                           href="javascript:void(0)"> <i class="lab la-facebook-f"></i> </a>
                      </li>
                      <li class="blog-details-share-social-list">
                        <a class="blog-details-share-social-list-icon"
                           href="javascript:void(0)"> <i class="lab la-twitter"></i> </a>
                      </li>
                      <li class="blog-details-share-social-list">
                        <a class="blog-details-share-social-list-icon"
                           href="javascript:void(0)"> <i class="lab la-pinterest-p"></i>
                        </a>
                      </li>
                      <li class="blog-details-share-social-list">
                        <a class="blog-details-share-social-list-icon"
                           href="javascript:void(0)"> <i class="lab la-youtube"></i> </a>
                      </li>
                      <li class="blog-details-share-social-list">
                        <a class="blog-details-share-social-list-icon"
                           href="javascript:void(0)"> <i class="lab la-instagram"></i> </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="col-lg-6 mt-4">
                  <div class="blog-details-share-content right-align">
                    <router-link
                        :to="{ name: 'JowhangBoardList', query: { jbno: dto.jbno, page: page, type: type, keyword: keyword }}">
                      <button type="button" class="btn btn-info">목록으로</button>
                    </router-link>

                    <router-link v-if="role === 'ADMIN'"
                                 :to="{ name: 'JowhangBoardModify', query: { jbno: dto.jbno, page: page, type: type, keyword: keyword }}">
                      <button type="button" class="btn btn-outline-primary">수정하기</button>
                    </router-link>

                    <button type="button" class="btn btn-danger removeBtn" v-if="role === 'ADMIN'" @click="removeNoticeBoard">삭제하기</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Details Tag area end -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import {useUserStore} from "@/store/UserStore";
import frontSideApiService from "@/services/FrontSideApiService";

export default {
  name: "JowhangBoardReadComponent",
  data() {
    return {
      jbno: this.$route.query.jbno,
      page: this.$route.query.page,
      type: this.$route.query.type,
      keyword: this.$route.query.keyword,
      dto: {title: '', content: '', regTime: '', modTime: ''},
      jowhangBoardImgs: [{ino: '', uuidfileName: '', realfileName: ''}]
    }
  },
  methods: {
    formatDate(dateString) {
      return moment(dateString).format('YYYY/MM/DD HH:mm:ss');
    },
    async getBoardDTO() {
      try {
        const response = await frontSideApiService.jowhangBoardRead({params: {jbno: this.jbno}});
        this.dto = response.data.dto;
        this.jowhangBoardImgs = response.data.jowhangBoardImgs;
      } catch (error) {
        alert("데이터 불러오기 실패");
      }
    },
    async removeNoticeBoard() {
      let result = confirm("삭제하시겠습니까?");
      if(!result) return null;

      try {
        const response = await frontSideApiService.jowhangBoardDelete({jbno: this.jbno});
        alert(response.data.success);
        this.$router.push({
          path: '/jowhangboard/list',
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

</style>