<template>
  <div class="dashboard-area section-bg-2 pat-100 pab-100">
    <div class="container">
      <div class="dashboard-contents-wrapper">
        <div class="dashboard-right-contents mt-4 mt-lg-0">
          <div class="dashboard-reservation">
            <div class="single-reservation bg-white base-padding">
              <form @submit.prevent="boardRegister" method="post">
                <table class="table table-bordered">
                  <tr>
                    <th>제목</th>
                    <td>
                      <input type="text" class="form-control" v-model="writeForm.title" placeholder="제목을 입력하세요"
                             required>
                    </td>
                  </tr>
                  <tr>
                    <th>내용</th>
                    <td>
                      <Editor api-key="3sfksqzu5vmtem6z88d0gi61nmmvqmyx39n9tokdq3jkwkkj" :init="editorConfig"
                              v-model="writeForm.content"></Editor>
                    </td>
                  </tr>
                  <tr>
                    <th>업로드</th>
                    <td>
                      <div class="col-12 col-md-6">
                        <label class="form-label">이미지</label>
                        <input class="form-control" type="file" @change="onFileSelected($event, 'file1')">
                      </div>

                      <div class="col-12 col-md-6">
                        <label class="form-label">이미지</label>
                        <input class="form-control" type="file" @change="onFileSelected($event, 'file2')">
                      </div>
                    </td>
                  </tr>
                </table>
                <div style="margin: 0px auto; text-align: center">
                  <button type="submit" class="btn btn-dark">등록</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import frontSideApiService from "@/services/FrontSideApiService";

export default {
  name: "NoticeBoardRegisterComponent",
  components: { Editor },
  data() {
    return {
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
      },
      writeForm: {title: "", content: ""},
      file1: '',
      file2: '',
    };
  }, methods: {

    async boardRegister() {
      let formData = new FormData();
      formData.append('title', this.writeForm.title);
      formData.append('content', this.writeForm.content);

      // 파일 추가
      if (this.file1) {
        formData.append('images', this.file1);
      }
      if (this.file2) {
        formData.append('images', this.file2);
      }

      try {
        const response = await frontSideApiService.noticeBoardRegister(formData);

        alert(response.data.success);
        this.$router.push('/noticeboard/list');
      } catch (error) {
        alert("글 등록 중 오류가 발생하였습니다.");
      }
    },
    // 파일 선택 이벤트 핸들러
    onFileSelected(event, fileNumber) {
      this[fileNumber] = event.target.files[0];
    }
  }
}
</script>

<style scoped>

</style>