<template>
  <div class="dashboard-area section-bg-2 pat-100 pab-100">
    <div class="container">
      <div class="dashboard-contents-wrapper">
        <div class="dashboard-right-contents mt-4 mt-lg-0">
          <div class="dashboard-reservation">
            <div class="single-reservation bg-white base-padding">
              <div class="row justify-content-between">
                <div class="col-md-3 col-lg-3">
                  <button @click="goWrite" type="button" class="btn btn-primary"
                          v-if="role==='ADMIN'">글쓰기
                  </button>
                </div>
                <div class="col-md-4 col-lg-5">
                  <form @submit.prevent="searchAudit(this.searchForm)">
                    <div class="input-group">
                      <input type="hidden" name="page" value="1">
                      <div class="input-group-prepend">
                        <select class="form-select" v-model="searchForm.type">
                          <option value="t">제목</option>
                          <option value="c">내용</option>
                          <option value="tc">제목 + 내용</option>
                        </select>
                      </div>
                      <input class="form-control" v-model="searchForm.keyword"/>&nbsp;
                      <div class="input-group-append" id="button-addon4">
                        <button class="btn btn-primary" type="submit" style="margin-right: 5px;">검색</button>
                        <button class="btn btn-outline-primary" type="button" @click="clear">초기화</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div class="table-responsive" style="margin-top: 20px;">
                <table class="table table-hover">
                  <thead>
                  <tr class="table-primary">
                    <th scope="col" class="col-9">제목</th>
                    <th scope="col" class="col-3">등록일</th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-if="result != null && result.dtoList != null">
                    <tr v-for="dto in result.dtoList" :key="dto.nbno" class="table-light">
                      <td>
                        <router-link
                            :to="`/noticeboard/read?nbno=${dto.nbno}&page=${result.page}&type=${pageRequestDTO.type}&keyword=${pageRequestDTO.keyword}`">
                          {{ dto.title }}
                        </router-link>
                      </td>
                      <td>{{ formatDate(dto.regTime) }}</td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>

              <nav v-if="result">
                <ul class="pagination justify-content-center">
                  <!-- 'Previous' 버튼 -->
                  <li :class="result.prev ? 'page-item' : 'page-item disabled'">
                    <a class="page-link" @click="changePage( this.result.page - 1)">
                      이전
                    </a>
                  </li>

                  <!-- 페이지네이션 -->
                  <li v-for="page in paginationRange" :key="page"
                      :class="result.page === page ? 'page-item active' : 'page-item'">
                    <a class="page-link" @click="changePage(page)">
                      {{ page }}
                    </a>
                  </li>

                  <!-- 'Next' 버튼 -->
                  <li :class="result.next ? 'page-item' : 'page-item disabled'">
                    <a class="page-link" @click="changePage(this.result.page + 1)">
                      다음
                    </a>
                  </li>
                </ul>
              </nav>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import frontSideApiService from "@/services/FrontSideApiService";
import {useUserStore} from "@/store/UserStore";

export default {
  name: "NoticeBoardListComponent",
  data() {
    return {
      pageRequestDTO: {page : '', size : '',type: '', keyword: ''},
      result: {
        dtoList: [{nbno: ""}],
        prev: false,
        next: false,
      },
      searchForm: {
        page : this.$route.query.page || 1,
        type: this.$route.query.type || 't',
        keyword: this.$route.query.keyword  || '',
      },
    };
  },
  mounted() {
    this.getMainData(this.searchForm);
  },
  computed: {
    role() {
      const userStore = useUserStore();
      return userStore.role;
    },
    paginationRange() {
      const totalPages = this.result.totalPage;
      const currentPage = this.result.page;
      const range = 5;
      let startPage = currentPage - Math.floor(range / 2);
      startPage = Math.max(startPage, 1);
      let endPage = startPage + range - 1;
      endPage = Math.min(endPage, totalPages);
      startPage = Math.max(endPage - range + 1, 1);
      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    goWrite() {
      this.$router.push('/noticeboard/register');
    },
    changePage(page){
      this.searchForm.page=page;
      this.getMainData(this.searchForm);
    },
    searchAudit(searchForm){
      if(!searchForm.keyword){
        return null;
      } else if(searchForm.keyword && this.searchForm.page > 1){
        this.searchForm.page = 1;
        this.getMainData(searchForm);
      } else {
        this.getMainData(searchForm);
      }
    },
    async getMainData(searchForm) {
      try {
        const response = await frontSideApiService.noticeBoardListGet(searchForm);
        this.pageRequestDTO = response.data.pageRequestDTO;
        this.result = response.data.result;
      } catch (error) {
        console.log(error)
        alert(error.response.data.error || "데이터를 가져오는 중 문제가 발생했습니다.");
      }
    },
    clear() {
      if(!this.searchForm.keyword){
        return null;
      }else {
        const updatedSearchForm = {type: 't', keyword: '', page : this.$route.query.page };
        this.searchForm = updatedSearchForm;
        this.getMainData(updatedSearchForm);
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ko-KR');
    },
  }
}
</script>

<style scoped>
.pagination a {
  cursor: pointer;
}
</style>