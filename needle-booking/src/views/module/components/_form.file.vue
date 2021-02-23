<template>
<div>
  <el-upload ref="upload" v-model="showUri"
    :key="uploadKey"
    :action="uploadAction"
    :list-type="listType"
    :on-success="successUpload"
    :on-preview="handlePreview"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :file-list="fileList"
    :with-credentials="true"
    :multiple="multiple" 
    :limit="limitSize"
    :disabled="readonly"
    :auto-upload="true">
    <i v-if="listType === 'picture-card'" class="el-icon-plus" />
    <el-button v-else slot="trigger" type="primary">上传文件</el-button>
    <!-- <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button> -->
    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
  </el-upload>
  <!-- :::{{showUri}} -->
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import openWindow from '@/utils/open-window'
import  { removeFile, getFileUploadAction, isAbsoluteFile } from '@/api/example'
export default {
  name: "formText",
  components: {},
  model: {
    prop: 'content',
    event: 'input'
  },
  props: {
    readonly: {
      type: Boolean
    },
    showUri: {
      type: String
    },
    isImage: {
      type: Boolean
    },
    moduleProp: {
      type: Object,
      default: {}
    },
    limitSize: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      // uploadAction: 'http://localhost:8080/file/upload.json?module=' + this.$route.path.split('/')[1],
      uploadAction: '',
      listType: this.isImage || this.moduleProp.feature === 'IMAGE' ? 'picture-card' : 'text',
      fileList: [],
      multiple: false,
      content: this.showUri,
      uploadKey: 0
    };
  },
  created() {
    this.uploadAction = this.getUploadUrl()
    this.fileList = this.getFileList()
  },
  watch: {
    showUri: function(val) {
      this.content = val
      if(val) {
        this.fileList = this.getFileList()
      }
      else {
        this.fileList = []
      }
      this.uploadKey++
    }
  },
  computed: {
    ...mapGetters([
      'fileHttpServer'
    ]),
  },
  methods: {
    getUploadUrl() {
      let url = getFileUploadAction() + '?module='
      url += this.$route.path.split('/')[1]
      return url
    },
    getFileList() {
      this.fileList = []
      if(this.content) {
        let contentArray = this.content.split(",")
        for(var i = 0; i < contentArray.length; i++) {
          let item = contentArray[i]
          
          let pathArray = item.split("/")
          let name = pathArray[pathArray.length - 1]
          let url = item
          if(!this.isAbsoluteFile(this.moduleProp.ruleType)) {
            url = this.fileHttpServer + 
              (item.startsWith("/") ? item.substring(1) : item)
          }

          if(this.moduleProp.feature === 'IMAGE') {
            this.fileList.push({ name: name, url: url, uri: item })
          }
          else {
            this.fileList.push({ name: name, uri: item, url: item })
          }
          console.log('###name=' + name + ', URL=' + item)
        }
      }
      return this.fileList
    },
    setFileList(files) {
      files.forEach(url => {
        this.fileList.push({ name: url, uri: url, url: url })
      })

      this.limitSize = 10
      this.multiple = true
    },
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
      if(this.fileList.length > 0) {
        url = this.fileList.map(f => f.url).join(',') + ',' + url
        uri = this.fileList.map(f => f.uri).join(',') + ',' + uri
      }
      if(this.moduleProp.ruleType && this.isAbsoluteFile(this.moduleProp.ruleType)) {
        this.$emit('input', url)
      }
      else {
        this.$emit('input', uri)
      }
    },
    handleExceed(files, fileList) {
      this.$message({ type: 'success', message: '文件超过上传限制' });
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.content = this.fileList.map(f => f.uri).join(',')
      this.$emit('input', this.content)

      // let params = {uri: ''}
      // if(file && file.uri) {
      //   params.uri = file.uri
        // removeFile(params).then(response => {
        //   this.$emit('input', '')
          // this.content = ''
          // this.$emit('input', '')
        // })
      // }
    },
    isAbsoluteFile,
  }
};
</script>
<style lang="scss" scoped>
</style>
