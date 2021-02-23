<template>
<div>
  <el-date-picker placeholder="请选择日期时间" style="width:100%;"
    v-model="content" type="datetime" :disabled="readonly"
    :format="formatPattern()" 
    :value-format="formatPattern()" 
    @change="handleChanged">
  </el-date-picker>
</div>
</template>
<script>
import { parseTime, formatTime } from '@/utils/index'

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
