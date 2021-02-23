<template>
  <el-time-picker v-model="content" style="width:100%;"
    placeholder="输入时间" :disabled="readonly"
    @change="handleChanged" 
    value-format="HH:mm:ss" 
  />
</template>
<script>
export default {
  name: "FormTime",
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

    };
  },
  methods: {
    handleChanged(val) {
      this.$emit('input', val)
    },
    clearForm() {
    },
  }
};
</script>
<style lang="scss" scoped>
</style>
