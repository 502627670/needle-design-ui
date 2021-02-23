<template>
  <div>
    <el-input type="textarea" :rows="8" autosize autocomplete="off"
      v-model="content" style="width:100%;" 
      :disabled="readonly"
      :maxlength="moduleProp.length>0?moduleProp.length:200"
      @blur="$emit('input', $event.target.value)"/>
    <!-- <span class="word-counter" v-show="contentShortLength">{{ contentShortLength }}字数</span> -->
  </div>
</template>
<script>
export default {
  name: "FormText",
  components: {},
  model: {
    prop: 'content',
    event: 'input'
  },
  props: {
    readonly: {
      type: Boolean
    },
    content: {
      type: String
    },
    moduleProp: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      contentText: this.content
    };
  },
  computed: {
    contentShortLength() {
      if(this.content) {
        return this.content.length || 0
      }
      return 0
    }
  },
  methods: {
    clearForm() {
      this.content = '';
    }
  }
};
</script>
<style lang="scss" scoped>
.word-counter {
  display: block;
  line-height: 20px;
  font-size:12px;
}
</style>
