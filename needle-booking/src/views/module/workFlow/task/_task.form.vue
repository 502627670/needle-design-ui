<template>
  <div class="example-info-container">
   
    <div  class="example-info-body" style="border:0px solid #d2d6de;">
      <div>
        <el-form ref="ruleForm" :model="dataForm" :key="dataFormKey" :rules="rules" label-width="160px">
          <el-row :gutter="0">
            <el-col :sm="24">
              <el-form-item label="标题" prop="subtitle">
                <el-input v-model="dataForm.subtitle" autocomplete="off" :maxlength="120"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="关联业务" prop="module">
                <el-select v-model="dataForm.module" style="width:100%;" clearable
                  @change="handleTaskModuleChange">
                  <template v-for="(mdx, index) in taskModules">
                    <el-option :key="'mdx_' + index" :label="mdx.showName" :value="mdx.name"></el-option>
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="关联数据" prop="instanceId">
                <FormFK ref="instanceId" :moduleProp="instanceModuleProp" 
                  v-model="dataForm['instanceId']" 
                  :showValue="dataForm['instanceTitle']" 
                  :readonly="Object.keys(instanceModuleProp).length<=0"></FormFK> 
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="报告人" prop="reporter">
                <el-input v-model="username" :value="username" readonly />
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="接收人" prop="assignee">
                <FormFK ref="assignee" v-model="dataForm['assigneeUser']" 
                  :moduleProp="getAssigneeUserProp()" 
                  :showValue="dataForm['assignee']">
                </FormFK> 
              </el-form-item>
            </el-col>
            <!-- <el-col :sm="12">
              <el-form-item label="发送消息通知">
                <el-radio-group v-model="messageNotice">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col> -->
            
            <!-- <el-col v-for="prop in moduleProps" :key="prop.prop" :xs="24" 
              :sm="isShowInRow(prop)?24:12" class="form-item-col">
              <template v-if="!isHideInForm(prop.ruleType)">
                <el-form-item :label="prop.name" :prop="prop.prop" style="margin-right:10%;">
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
            </el-col> -->
          </el-row>
        </el-form>
      </div>
    </div>
    
    <!-- <section v-for="child in childrenModules" :key="'children_section_' + child.name">
      <Children ref="childrenList" :module="child"></Children>
    </section> -->
    
  </div>
</template>

<script>
import FormString from '../components/_form.string'
import FormText from '../components/_form.text'
import FormDate from '../components/_form.date'
import FormEditor from '../components/_form.editor'
import FormDateTime from '../components/_form.datetime'
import FormTime from '../components/_form.time'
import FormSelect from '../components/_form.select'
import FormFK from '../components/_form.fk'
import FormFile from '../components/_form.file'
import Children from '../components/_view.children'
import { mapGetters } from "vuex";
import  { findTaskModules, getTaskModule, create, isRequired,
  isHideInForm, isShowInRow } from '@/api/example'
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
      // rules: this.getFormRules(),
      rules: {
        subtitle: [{ required: true, message: '必输项', trigger: 'blur' }],
        // module: [{ required: true, message: '必输项', trigger: 'blur' }],
        // instanceId: [{ required: true, message: '必输项', trigger: 'blur' }],
        // assignee: [{ required: true, message: '必输项', trigger: 'blur' }],
      },
      pk: this.module.pk,
      moduleProps: this.module.props || [],

      action: {},
      taskModules: [],
      instanceModuleProp: {},
      messageNotice: true
    };
  },
  created () {
    // this.getChildrenModules()
  },
  watch: {
    
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["username"]),
  },
  methods: {
    initialize(data) {
      this.dataForm = Object.assign({}, data)
      this.module.props.filter(mp => mp.defaultValue).forEach(mp => {
        this.dataForm[mp.prop] = mp.defaultValue.toString()
      })
      findTaskModules(this.module.name, {}).then(response => {
        this.taskModules = response.data
      }).catch(() => {})
    },
    handleTaskModuleChange(val) {
      if(val) {
        getTaskModule(val, {module: val}).then(response => {
          let taskModule = response.data
          let mp = {}
          mp.refModuleName = taskModule.name 
          mp.refProp = taskModule.pk
          mp.showProp = taskModule.taskProp
          this.instanceModuleProp = mp
          this.dataForm.instancePk = taskModule.pk
          this.$refs.instanceId.setModuleProp(this.instanceModuleProp)
          this.$refs.instanceId.handleSearch()
        }).catch(() => {})
      }
      else {
        this.instanceModuleProp = {}
        this.dataForm.instanceId = ''
        this.dataForm.instancePk = ''
      }
    },
    getAssigneeUserProp() {
      return this.module.props.find(mp => mp.prop === 'assigneeUser')
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

      rules = {
        subtitle: [{ required: true, message: '必输项', trigger: 'blur' }],
        // module: [{ required: true, message: '必输项', trigger: 'blur' }],
        // instanceId: [{ required: true, message: '必输项', trigger: 'blur' }],
        // assignee: [{ required: true, message: '必输项', trigger: 'blur' }],
      }
      this.dataFormKey++
      return rules
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.dataForm.instanceTitle = this.$refs.instanceId.content
          this.dataForm.assignee = this.$refs.assignee.content
          this.dataForm.reporter = this.username
          this.dataForm.taskStatus = 'TODO'
          let params = { ...this.dataForm }
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
    isHideInForm,
    isShowInRow
  }
};
</script>
<style lang="scss" scoped>
.example-info-body {
  .el-col {
    padding-right: 8%;
  }
}
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