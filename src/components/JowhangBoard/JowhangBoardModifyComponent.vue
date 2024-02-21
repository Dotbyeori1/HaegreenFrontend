<template>
  <section class="blog-details-area pat-100 pab-100">
    <div class="container">
      <div class="row gy-5">
        <div class="col-xl-12 col-lg-12">
          <div class="blog-details-wrapper">

            <h3 class="mt-4">게시물 수정</h3>

            <form @submit.prevent="modifyJowhangBoard()" method="post">
              <table class="table table-bordered">
                <tr>
                  <th>글번호</th>
                  <td>
                    <input type="text" class="form-control" :value="dto.jbno" readonly>
                  </td>
                </tr>
                <tr>
                  <th>제목</th>
                  <td>
                    <input type="text" class="form-control" v-model="dto.title"
                           placeholder="제목을 입력하세요" required>
                  </td>
                </tr>
                <tr>
                  <th>내용</th>
                  <td>
                    <Editor api-key="3sfksqzu5vmtem6z88d0gi61nmmvqmyx39n9tokdq3jkwkkj" :init="editorConfig"
                            v-model="dto.content"></Editor>
                  </td>
                </tr>
                <tr>
                  <th>작성자</th>
                  <td>
                    <input type="text" class="form-control" v-model="dto.writerName" readonly>
                  </td>
                </tr>
                <tr>
                  <th>등록일</th>
                  <td>
                    <input type="text" class="form-control" :value="formatDate(dto.regTime)" readonly>
                  </td>
                </tr>
                <tr>
                  <th>수정일</th>
                  <td>
                    <input type="text" class="form-control" :value="formatDate(dto.modTime)" readonly>
                  </td>
                </tr>
                <tr>
                  <th>업로드</th>
                  <td>
                    <template v-if="jowhangBoardImgs.length > 0">
                      <div v-for="(img, index) in jowhangBoardImgs" :key="img.ino">
                        <div class="col-12 col-md-6">
                          <label class="form-label">이미지</label>
                          <input class="form-control" type="file"
                                 @change="onFileSelected($event, 'file'+(index+1))">
                          <img :src="`/haegreen/${img.uuidfileName}`"
                               alt="Uploaded Image Preview" width="100px" height="100px"/>
                          <input type="checkbox"
                                 @change="onImageDeleteCheckboxChanged(img.ino, $event.target.checked)"/>
                          삭제
                        </div>
                      </div>
                    </template>

                    <template v-else>
                      <div class="col-12 col-md-6">
                        <label class="form-label">이미지</label>
                        <input class="form-control" type="file" @change="onFileSelected($event, 'file1')">
                      </div>
                      <div class="col-12 col-md-6">
                        <label class="form-label">이미지</label>
                        <input class="form-control" type="file" @change="onFileSelected($event, 'file2')">
                      </div>
                    </template>
                  </td>
                </tr>
              </table>

              <div class="mat-25" style="text-align: center">
                <button type="button" class="btn btn-info" @click="moveToList()">목록으로</button>

                <button type="submit" class="btn btn-primary">수정하기</button>

                <button type="button" class="btn btn-danger" @click="removeNoticeBoard()">삭제하기</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment/moment";
import frontSideApiService from "@/services/FrontSideApiService";
import Editor from '@tinymce/tinymce-vue';

export default {
  name: "JowhangBoardModifyComponent",
  components: {Editor},
  data() {
    return {
      jbno: this.$route.query.jbno,
      page: this.$route.query.page,
      type: this.$route.query.type,
      keyword: this.$route.query.keyword,
      dto: {title: '', writerName: '', content: '', regTime: '', modTime: ''},
      jowhangBoardImgs: [{ino: '', uuidfileName: '', realfileName: ''}],
      file1: "",
      file2: "",
      deleteImages: [],
      editorConfig: {
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | bold italic forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | help'
      }
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
    moveToList() {
      this.$router.push({
        path: '/jowhangboard/list',
        query: {
          page: this.page,
          type: this.type,
          keyword: this.keyword
        }
      });
    },
    async removeNoticeBoard() {
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
    },
    onImageDeleteCheckboxChanged(inos, isChecked) {
      if (isChecked) {
        // 이미지 식별자를 삭제 목록에 추가
        this.deleteImages.push(inos);
      } else {
        // 이미지 식별자를 삭제 목록에서 제거
        this.deleteImages = this.deleteImages.filter(id => id !== inos);
      }
    },
    async modifyJowhangBoard() {
      let formData = new FormData();
      formData.append('jbno', this.dto.jbno);
      formData.append('title', this.dto.title);
      formData.append('content', this.dto.content);

      // 기존 이미지 존재시
      this.jowhangBoardImgs.forEach((img, index) => {
        // 새로운 파일이 선택되었는지 확인
        if (this[`file${index + 1}`]) {
          // 새 파일을 FormData에 추가
          formData.append('images', this[`file${index + 1}`]);
          // 식별자를 FormData에 추가
          formData.append('inos', img.ino);
        }
      });

      // 파일 추가
      if (this.file1) {
        formData.append('images', this.file1);
      }
      if (this.file2) {
        formData.append('images', this.file2);
      }

      // 삭제 선택시
      if (this.deleteImages.length > 0) {
        this.deleteImages.forEach((inos) => {
          formData.append('deleteImages', inos);
        });
      }

      try {
        const response = await frontSideApiService.jowhangBoardModfiy(formData);
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
        alert("게시물 수정 실패");
      }
    },
    // 파일 선택 이벤트 핸들러
    onFileSelected(event, fileKey) {
      this[fileKey] = event.target.files[0];
    }
  },
  mounted() {
    this.getBoardDTO();
  }
}

</script>>



<style scoped>

</style>