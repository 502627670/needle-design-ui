<template>
  <el-date-picker placeholder="日期" style="width:100%;"
    v-model="content" 
    type="date" :disabled="readonly"
    :format="formatPattern()" 
    :value-format="formatPattern()"  
    @change="handleChanged">
  </el-date-picker>
</template>
<script>
import { parseTime, formatTime } from '@/utils/index'
export default {
  name: "FormDate",
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
    },
  },
  data () {
    return {
      
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
