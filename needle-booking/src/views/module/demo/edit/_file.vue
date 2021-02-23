<template>
<div>
  <el-form-item :label="moduleProp.name" :prop="moduleProp.prop">
    <el-upload ref="upload" v-model="content"
      :action="uploadAction"
      :list-type="listType"
      :on-success="successUpload"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="true">
      <i v-if="listType === 'picture-card'" class="el-icon-plus" />
      <el-button v-else slot="trigger" type="primary">上传文件</el-button>
      <!-- <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button> -->
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
  </el-form-item>
</div>
</template>

<script>
 import openWindow from '@/utils/open-window'

export default {
  name: "formText",
  components: {},
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    fileHttpServer: {
      type: String
    },
    moduleProp: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      module: '',
      content: '',
      uploadAction: 'http://localhost:8080/file/upload.json?module=' + this.$route.path.split('/')[1],
      listType: this.moduleProp.feature === 'IMAGE' ? 'picture-card' : 'text',
      // listType: 'picture-card',
      fileList: []
    };
  },
  created() {
    // if(this.moduleProp.feature === 'IMAGE') {
    //   this.fileList.push({ name: 'name', url: 'url' })
    // }
    // else {
    //   this.fileList.push({ name: 'name' })
    // }
  },
  methods: {
    handlePreview(file) {
      let url = file.url
      if(url) {
        openWindow(url, "图片预览", 600, 600)
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    successUpload(response, file, fileList) {
      let uri = response.map(item => item.uri).join(',')
      let url = response.map(item => item.url).join(',')
      this.$emit('input', uri);
      this.content = url;
    },
    handleExceed(files, fileList) {
      this.$message({ type: 'success', message: '文件大小超过上传限制' });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      let params = {uri: ''}
      if(file.response && file.response.length > 0) {
        params.uri = file.response[0].uri

        // removeUploadFile(params).then(response => {
        //   this.itemForm.content = '';
        //   this.$emit('input', '');
        // })
      }
    },
    clearForm() {
      // this.value = '';
      // this.itemForm.content = '';
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
