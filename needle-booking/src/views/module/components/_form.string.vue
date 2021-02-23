<template>
  <el-input placeholder="输入" autocomplete="off"
    v-model="content" 
    @blur="handleChange($event.target.value)"  />
</template>
<script>
export default {
  name: "FormString",
  components: {},
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
    },
    readonly: {
      type: Boolean
    }
  },
  data () {
    return {
      
    };
  },
  methods: {
    handleChange(val) {
      this.$emit('input', val)
    },
    clearForm() {
      this.content = '';
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
