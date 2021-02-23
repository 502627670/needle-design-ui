<template>
  <el-form-item :label="moduleProp.name" :prop="moduleProp.prop">
    <el-select v-model="content" clearable placeholder="请选择" style="width:100%;"
      @change="handleChange">
      <el-option v-for="(label,value) in moduleProp.values || {}" 
        :key="value" 
        :label="label" 
        :value="value">
      </el-option>
    </el-select>
  </el-form-item>
</template>
<script>
export default {
  name: "FormSelect",
  components: {},
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    moduleProp: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      content: '',
    };
  },
  created() {
  },
  computed: {
    valueKeyMap: function() {}
  },
  methods: {
    handleChange(val) {
      this.$emit('input', val);
    },
    clearForm() {
    },
  }
};
</script>
<style lang="scss" scoped>
</style>
