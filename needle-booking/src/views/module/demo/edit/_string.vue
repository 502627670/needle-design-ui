<template>
  <el-input placeholder="输入" 
    v-model="content" 
    @blur="handleChange($event.target.value)"  />
</template>
<script>
export default {
  name: "FormString",
  components: {},
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
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
      content:'',
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
