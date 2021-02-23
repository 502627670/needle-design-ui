<template>
  <el-date-picker placeholder="请选择日期时间" style="width:100%;"
    v-model="content" type="datetime"
    :format="formatPattern()" 
    :value-format="formatPattern()" 
    @change="handleChanged">
  </el-date-picker>
</template>
<script>
import { parseTime, formatTime } from '@/utils/index'

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
  methods: {
    formatPattern() {
      let pattern = this.moduleProp.pattern || 'yyyy-MM-dd HH:mm:ss';
      return pattern;
    },
    handleChanged(val) {
      this.$emit('input', val)
    },
    clearForm() {},
  }
};
</script>
<style lang="scss" scoped>
</style>
