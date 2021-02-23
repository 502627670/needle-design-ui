<template>
  <el-form-item :label="moduleProp.name" :prop="moduleProp.prop">
    <el-time-picker v-model="content" style="width:100%;"
      placeholder="输入时间" 
      @change="handleChanged" 
      value-format="HH:mm:ss" 
    />
  </el-form-item>
</template>
<script>
export default {
  name: "FormTime",
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
