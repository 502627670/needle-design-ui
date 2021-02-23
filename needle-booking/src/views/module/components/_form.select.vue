<template>
<div>
  <el-select ref="select" v-model="value" :disabled="readonly"
    clearable placeholder="请选择" style="width:100%;"
    @change="handleChange">
    <el-option v-for="item in moduleProp.values || {}" 
      :key="item.value"
      :label="item.label" 
      :value="item.value">
    </el-option>
  </el-select>
</div>  
</template>
<script>
export default {
  name: "FormSelect",
  components: {},
  model: {
    prop: 'content',
    event: 'input'
  },
  props: {
    readonly: {
      type: Boolean
    },
    moduleProp: {
      type: Object,
      default: {}
    },
    showValue: {}
  },
  data () {
    return {
      value: this.showValue,
    }
  },
  created() {
    if(this.showValue) {
      this.value = this.getValue(this.showValue)
      this.$emit('input', this.value)
    }
  },
  watch: {
    showValue: function(val) {
      this.value = this.getValue(val)
      this.$emit('input', this.value)
      console.log('value=' + this.value)
    }
  },
  computed: {
  },
  methods: {
    getValue(val) {
      val = val ? val : ''
      let option = this.moduleProp.values.find(item => {
        let label = item.label.toString()
        let value = item.value.toString()
        return value === val || label === val
      })
      let value = option ? option.value : this.moduleProp.defaultValue
      return value
    },
    handleChange(val) {
      this.$emit('input', val);
    },
  }
};
</script>
<style lang="scss" scoped>
</style>
