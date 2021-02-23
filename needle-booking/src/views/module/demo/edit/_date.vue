<template>
  <el-date-picker placeholder="日期" :value="value" style="width:100%;"
    v-model="itemForm.content" 
    type="date"
    :format="formatPattern()" 
    :value-format="formatPattern()"  
    @change="handleChanged">
  </el-date-picker>
</template>
<script>
import { parseTime, formatTime } from '@/utils/index'
// import { i18nName } from '@/utils/i18n'

export default {
  name: "FormDate",
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
  },
  data () {
    return {
      originalValue: this.value,
      itemForm: {
        content: '',
      },
      aRules: {
        // content: this.getValidateRules()
      },
    };
  },
  methods: {
    // getContentValue() {
    //   let val = this.value || this.moduleActionProperties[this.moduleProperty.propertyPath].value || '';
    //   if(val) {
    //     val = parseTime(new Date(val), '{y}-{m}-{d}');
    //     this.$emit('input', val);
    //   }
    //   return val;
    // },
    // getValidateRules() {
    //   let rules = []
    //   let min = 0;
    //   let max = this.moduleProperty.length;
    //   if(this.moduleProperty.required) {
    //     min = 1;
    //     rules.push({ required: true, message: this.i18nName('module.validate.required'), trigger: 'blur' })
    //   }
    //   return rules;
    // },
    formatPattern() {
      let pattern = this.moduleProp.pattern || 'yyyy-MM-dd';
      return pattern;
    },
    // isDefaultValue() {
    //   let actionValue = this.moduleActionProperties[this.moduleProperty.propertyPath].value;
    //   const isDefault = !this.originalValue && actionValue && actionValue == this.itemForm.content;
    //   return isDefault;
    // },
    handleChanged(val) {
      this.$emit('input', val)
    },
    validateForm() {
      let flag = false
      this.$refs['itemForm'].validate((valid) => {
        flag = valid
      })
      return flag
    },
    clearForm() {
      // this.value = '';
      this.itemForm.content = '';
    },
    i18nName(s) {
      return s
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
