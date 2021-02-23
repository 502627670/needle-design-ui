<template>
  <div class="example-info-container">
   
    <div  class="example-info-body" style="border:0px solid #d2d6de;">
      <div>
        <el-form ref="ruleForm" :model="dataForm" :key="dataFormKey" :rules="rules" label-width="160px">
          <el-row :gutter="0">
            <el-col v-for="prop in moduleProps" :key="prop.prop" :xs="24" 
              :sm="isShowInRow(prop)?24:12" class="form-item-col" style="padding-right:8%;">
              <template v-if="!isHideInForm(prop.ruleType)">
                <el-form-item :label="prop.name" :prop="prop.prop">
                  <el-input v-if="prop.feature==='STRING'" :moduleProp="prop" v-model="dataForm[prop.prop]" autocomplete="off" :maxlength="prop.length>0?prop.length:60"></el-input>
                  <el-input v-else-if="prop.feature==='PASSWORD'" :moduleProp="prop" v-model="dataForm[prop.prop]" show-password  autocomplete="off" :maxlength="prop.length>0?prop.length:60"></el-input>
                  <el-input v-else-if="prop.feature==='NUMBER'" type="number" :moduleProp="prop" v-model="dataForm[prop.prop]" autocomplete="off"></el-input>
                  <FormText v-else-if="prop.feature==='TEXT'" :moduleProp="prop" v-model="dataForm[prop.prop]"></FormText>
                  <FormDate v-else-if="prop.feature==='DATE'" :moduleProp="prop" v-model="dataForm[prop.prop]"></FormDate>
                  <FormDateTime v-else-if="prop.feature==='DATETIME'" :moduleProp="prop" v-model="dataForm[prop.prop]"></FormDateTime>
                  <FormTime v-else-if="prop.feature==='TIME'" :moduleProp="prop" v-model="dataForm[prop.prop]"></FormTime>
                  <FormSelect v-else-if="prop.feature==='SELECT'" :moduleProp="prop" v-model="dataForm[prop.prop]"></FormSelect>
                  <FormFK v-else-if="prop.feature==='FK'" :moduleProp="prop" v-model="dataForm[prop.prop]" :showValue="dataForm[prop.showPath]"></FormFK> 
                  <FormFile v-else-if="prop.feature==='FILE'" :moduleProp="prop" v-model="dataForm[prop.prop]"></FormFile>
                  <FormFile v-else-if="prop.feature==='IMAGE'" :moduleProp="prop" v-model="dataForm[prop.prop]"></FormFile>
                  <FormEditor v-else-if="prop.feature==='EDITOR'" :moduleProp="prop" v-model="dataForm[prop.prop]"></FormEditor>
                </el-form-item>
              </template>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    
    <section v-for="child in childrenModules" :key="'children_section_' + child.name">
      <Children ref="childrenList" :module="child"></Children>
    </section>
    
  </div>
</template>

<script>
import FormString from '@/views/module/components/_form.string'
import FormText from '@/views/module/components/_form.text'
import FormDate from '@/views/module/components/_form.date'
import FormEditor from '@/views/module/components/_form.editor'
import FormDateTime from '@/views/module/components/_form.datetime'
import FormTime from '@/views/module/components/_form.time'
import FormSelect from '@/views/module/components/_form.select'
import FormFK from '@/views/module/components/_form.fk'
import FormFile from '@/views/module/components/_form.file'
import Children from '@/views/module/components/_view.children'
import { mapGetters } from "vuex";
import  { create, isRequired, isID, isHideInForm, isShowInRow } from '@/api/example'
export default {
  name: "froms",
  components: {
    FormString, 
    FormText, 
    FormDate,
    FormFK, 
    FormDateTime,
    FormTime, 
    FormSelect,
    FormFile, 
    FormEditor,
    Children
  },
  props: {
    module: {
      type: Object,
      required: true,
      default: {}
    }
  },
  data () {
    return {
      dataFormKey:0,
      dataForm: {},
      rules: this.getFormRules(),
      pk: this.module.pk,
      moduleProps: this.module.props || [],
      children: this.getChildren() || [],
      childrenModules: [],
      action: {},
    };
  },
  created () {
    this.getChildrenModules()
  },
  mounted() {
    this.initialize()
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  methods: {
    initialize() {
      this.dataForm = {}
      this.module.props.filter(mp => mp.defaultValue).forEach(mp => {
        this.dataForm[mp.prop] = mp.defaultValue
      })
      if(this.$refs.childrenList) {
        this.$refs.childrenList.forEach(child => child.getChildrenData())
      }
    },
    setAction(action) {
      this.action = action || {}
      if(!this.action.props || this.action.props.length <= 0) {
        this.moduleProps = this.module.props
      }
      else {
        let mps = []
        this.moduleProps.forEach(mp => {
          let actionProp = this.action.props.find(ap => mp.prop === ap.prop)
          if(actionProp) {
            let tmp = { ...mp }
            tmp.defaultValue = actionProp.value
            tmp.values = actionProp.values
            tmp.ruleType |= actionProp.ruleType
            mps.push(tmp)
          }
        })
        this.moduleProps = mps
      }
      this.rules = this.getFormRules()
    },
    getFormRules() {
      let rules = {}
      let mps = this.moduleProps || []
      mps.forEach(mp => {
        if(isRequired(mp.ruleType)) {
          rules[mp.prop] = [{ required: true, message: '必输项', trigger: 'blur' }]
        }
      })
      this.dataFormKey++
      return rules
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let actionDataList = this.getActionDataList()
          let params = { _data: JSON.stringify(actionDataList) }
          params._action = this.action.id
          create(this.module.name, params).then(response => {
            this.initialize()
            this.$emit('handleSuccess')
          }).catch(() => {})
        } 
        else {
          this.$message({ type: 'error', message: '数据验证失败，请检查输入项' });
          console.log('error submit!!');
          return false;
        }
      })
    },
    isHideInForm(ruleType) {
      return isHideInForm(ruleType)
    },
    getChildren() {
      let children = this.module.children || []
      children = children.filter(element => {
        let childProp = element.props || []
        let propSize = childProp.filter(mp => !mp.refModuleName && !this.isHideInForm(mp.prop)).length
        if(propSize > 1) return false
        return element.otherRefProps && element.otherRefProps.length == 1
      })
      return children
    },
    getChildrenModules() {
      this.children.forEach(child => { // { pk:, name:, ... }
        child.otherRefProps.forEach(otherRefProp => {
          let refModuleProp = child.props.filter(prop => prop.prop === otherRefProp)[0]
          let pk = refModuleProp.refProp
          let refModuleName = refModuleProp.refModuleName
          this.childrenModules.push({ name: refModuleName, pk: pk })
        })
      })
    },
    getActionDataList() {
      let actionDataList = [{ module: this.module.name, data: this.dataForm }]
      let childrenPageList = this.$refs.childrenList
      this.children.forEach((child, index) => {
        let actionData = { module: child.name }
        let pkName = this.childrenModules[index].pk
        let propName = child.otherRefProps[0]
        let result = []
        let selectionData = childrenPageList[index].dataListSelection
        selectionData.forEach(data => {
          let map = {}
          map[propName] = data[pkName]
          result.push(map)
        })
        actionData.data = result
        actionDataList.push(actionData)
      })
      return actionDataList
    },
    isShowInRow(mp) {
      return isShowInRow(mp)
    }
  }
};
</script>
<style lang="scss" scoped>
.from-container {
  padding: 8px 10px;
}
// .example-info-body .form-item-col {
  // height: 52px;
// }
.example-info-body >>> .el-card__body {
  padding:0px!important;
}
.example-info-body >>> .el-form-item__label {
  font-weight: 600;
  line-height:30px;
}
.example-info-body >>> .el-form-item__content label {
  font-weight: normal;
}
.example-info-body .el-tag {
  margin-right:10px;
}
.example-info-body .el-form >>> .el-form-item {
  margin-right:24px;
}
.example-info-body >>> .el-pagination {
  padding:0px 5px;
}
.example-info-body .el-collapse >>> .el-collapse-item__header {
  height:30px;
  line-height:30px;
  border-top:1px solid #e2e2e2;
  border-bottom:0px;
  padding-left:15px;
  font-weight: 600;
  background:#fafafa;
}
.el-collapse >>> .el-collapse-item__arrow {
  height:30px;
  line-height:30px;
  font-weight: 600;
}
.el-collapse >>> .el-collapse-item__wrap:last-child {
    border-bottom: 0px;
}
.margin-bottom-0 {
  margin-bottom:0px!important;
}
.el-radio-button >>> .el-radio-button__inner {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 120px;
  padding:6px 8px;
}

.example-info-container {
  .box{
    display: flex;
    justify-content: space-between;
    width:100%;
    background:#fafafa;
    padding:4px 10px 5px 10px;
  }
  .left {
    display: flex;
    flex: 1;
    height: 100%;
  }
  .right {
    width: 400px;
    text-align:right;
  }

  .child-filter-container .el-form-item { margin-bottom: 0px; }

  .example-list-body {
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
  .crud-pagination {
    margin-top:4px;
    padding:2px 10px;
    text-align:right;
  }
}
</style>