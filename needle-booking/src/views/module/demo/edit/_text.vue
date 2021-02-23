<template>
  <div>
    <el-input type="textarea" :rows="5" autosize placeholder="输入" 
      v-model="content" 
      @blur="$emit('input', $event.target.value)"/>
    <span class="word-counter" v-show="contentShortLength">{{ contentShortLength }}字数</span>
  </div>
</template>
<script>
export default {
  name: "FormText",
  components: {},
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    moduleProp: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      content: '',
    };
  },
  computed: {
    contentShortLength() {
      return this.content.length
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
