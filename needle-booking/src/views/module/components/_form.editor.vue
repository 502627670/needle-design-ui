<template>
  <div class="editor-container">
    <Tinymce ref="tinymce" :height="200" v-model="content" 
      :action="uploadAction"
    />
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { mapGetters } from "vuex";
import { getDataInfo, getEditorUploadAction, isAbsoluteFile } from '@/api/example'

export default {
  name: "FormEditor",
  components: { Tinymce },
  model: {
    prop: 'content',
    event: 'input'
  },
  props: {
    content: {
      type: String
    },
    moduleProp: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      uploadAction: 'http://localhost:8080/editor/image.json?module=' + this.$route.path.split('/')[1],
    };
  },
  created() {
    this.uploadAction = this.getUploadUrl()
  },
  computed: {
    newValue() {
      return this.content;
    }
  },
  watch: {
    newValue(val, oldVal) {
      this.$emit('input', val)
    },
  },
  methods: {
    getUploadUrl() {
      let url = getEditorUploadAction() + '?module='
      url += this.$route.path.split('/')[1]
      return url
    },
    // validateForm(value) {
    //   let flag = false
    //   this.$refs['itemForm'].validate((valid) => {
    //     flag = valid
    //   })
    //   return flag
    // },
    clearForm() {
      this.content = '';
      const tinymceId = this.$refs.tinymce.tinymceId;
      window.tinymce.get(tinymceId).setContent('');
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
