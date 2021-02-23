<template>
  <div class="example-info-container">
   
    <div class="example-info-body" style="border:0px solid #d2d6de;">
      <div>
        <el-form ref="ruleForm" :model="dataForm" :key="dataFormKey" :rules="rules" label-width="160px">
          <el-row :gutter="0">
            <el-col v-for="prop in moduleProps" :key="prop.prop" style="padding-right:10%;"
              :xs="24" :sm="isShowInRow(prop)?24:12" class="form-item-col">
              <template v-if="!isHideInEdit(prop.ruleType)">
                <el-form-item :label="prop.name" :prop="prop.prop">
                  <el-input v-if="prop.feature==='PASSWORD'" type="password" :moduleProp="prop" v-model="dataForm[prop.prop]" :disabled="isNoUpdate(prop.ruleType)" autocomplete="off"></el-input>
                  <el-input v-else-if="prop.feature==='NUMBER'" type="number" :moduleProp="prop" v-model="dataForm[prop.prop]" :disabled="isNoUpdate(prop.ruleType)" autocomplete="off"></el-input>
                  <FormText v-else-if="prop.feature==='TEXT'" :moduleProp="prop" v-model="dataForm[prop.prop]" :readonly="isNoUpdate(prop.ruleType)"></FormText>
                  <FormDate v-else-if="prop.feature==='DATE'" :moduleProp="prop" v-model="dataForm[prop.prop]" :readonly="isNoUpdate(prop.ruleType)"></FormDate>
                  <FormDateTime v-else-if="prop.feature==='DATETIME'" :moduleProp="prop" v-model="dataForm[prop.prop]" :readonly="isNoUpdate(prop.ruleType)"></FormDateTime>
                  <FormTime v-else-if="prop.feature==='TIME'" :moduleProp="prop" v-model="dataForm[prop.prop]" :readonly="isNoUpdate(prop.ruleType)"></FormTime>
                  <FormSelect v-else-if="prop.feature==='SELECT'" :moduleProp="prop" v-model="dataForm[prop.prop]" :showValue="dataForm[prop.prop]" :readonly="isNoUpdate(prop.ruleType)"></FormSelect>
                  <FormFK v-else-if="prop.feature==='FK'" :moduleProp="prop" v-model="dataForm[prop.prop]" :showValue="dataForm[prop.showPath]" :readonly="isNoUpdate(prop.ruleType)" @handleBack="(mappings, data)=>{Object.keys(mappings).forEach(refProp => {let prop=mappings[refProp]; $set(dataForm, prop, data[refProp]); })}"></FormFK> 
                  <FormFile v-else-if="prop.feature==='FILE'" :moduleProp="prop" v-model="dataForm[prop.prop]" :showUri="dataForm[prop.prop]" :readonly="isNoUpdate(prop.ruleType)"></FormFile>
                  <FormFile v-else-if="prop.feature==='IMAGE'" :moduleProp="prop" v-model="dataForm[prop.prop]" :showUri="dataForm[prop.prop]" :readonly="isNoUpdate(prop.ruleType)"></FormFile>
                  <FormEditor v-else-if="prop.feature==='EDITOR'" :moduleProp="prop" v-model="dataForm[prop.prop]" :readonly="isNoUpdate(prop.ruleType)"></FormEditor>
                  <el-input v-else :moduleProp="prop" v-model="dataForm[prop.prop]" autocomplete="off" :disabled="isNoUpdate(prop.ruleType)"></el-input>
                </el-form-item>
              </template>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    
    <section v-for="child in children" :key="'_edit_children_' + child.name">
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

import Children from '@/views/module/components/_view.childrenEdit'
import { mapGetters } from "vuex";
import  { getEntity, update,remove, isShowInRow,
  isNoUpdate, isRequired, isID, isHideInEdit } from '@/api/example'

export default {
  name: "Edit",
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
  data() {
    return {
      dataFormKey: 0,
      dataForm: {},
      moduleProps: this.module.props || [],
      rules: this.getFormRules(),
      pk: this.module.pk,
      children: this.getChildren() || [],
      action: {}
    };
  },
  created () {},
  computed: {
    ...mapGetters(["permission"]),
  },
  methods: {
    initialize(data) {
      this.getInfo(data)
      this.getChildrenData(data)
    },
    setAction(action) {
      this.action = action || {}
      let mps = []
      if(!this.action.props || this.action.props.length <= 0) {
        mps = this.module.props
      }
      else {
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
      }
      this.rules = this.getFormRules(mps)
      this.moduleProps = mps
    },
    getFormRules(moduleProps) {
      let rules = {}
      let mps = moduleProps || this.moduleProps || []
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
          let params = {}
          this.moduleProps.forEach(mp => {
            if(!this.isHideInEdit(mp.ruleType) || this.isID(mp.ruleType)) {
              params[mp.prop] = this.dataForm[mp.prop]
            }
          })
          update(this.module.name, params).then(response => {
            this.$emit('handleUpdateSuccess')
          }).catch(() => {})
        } 
        else {
          this.$message({ type: 'error', message: '数据验证失败，请检查输入项' });
          console.log('error submit!!');
          return false;
        }
      })
    },
    isHideInEdit(ruleType) {
      return isHideInEdit(ruleType)
    },
    getInfo(data) {
      getEntity(this.module.name, data[this.module.pk]).then(response => {
        this.dataForm = response.data
      }).catch(() => {})
    },
    getChildren() {
      let children = this.module.children || []
      children = children.filter(element => {
        let childProp = element.props || []
        let propSize = childProp.filter(mp => !mp.refModuleName && !this.isHideInEdit(mp.prop)).length
        if(propSize > 1) return false
        return element.otherRefProps && element.otherRefProps.length == 1
      })
      return children
    },
    getChildrenData(data) {
      let childrenList = this.$refs.childrenList
      if(childrenList) {
        this.children.forEach((child, index) => {
          let refProp = child.refProp
          childrenList[index].initialize(data, refProp)
        })
      }
    },
    deleteData () {
      this.$confirm('确认要删除当前数据吗？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        let params = {}
        params[this.module.pk] = this.dataForm[this.module.pk]
        remove(this.module.name, params).then(response => {
          this.$emit('handleDeleteSuccess')
          this.$message({ type: 'success', message: '删除操作执行完成' });
        }).catch(() => {})
      }).catch((e) => {
        this.$message({ type: 'info', message: '删除已取消' });
      })
    },
    isNoUpdate,
    isShowInRow,
    isID,
  }
};
</script>
<style lang="scss" scoped>
.from-container {
  padding: 8px 10px;
}
// .example-info-body .form-item-col {
//   height: 52px;
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