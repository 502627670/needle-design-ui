<template>
  <div class="example-info-container">
   
    <div  class="example-info-body" style="border:0px solid #d2d6de;">
      <div>
        <el-form ref="ruleForm" :model="dataForm" :key="dataFormKey" :rules="rules" label-width="160px">
          <el-row :gutter="0">
            <el-col :sm="12">
              <el-form-item label="接收人" prop="assigneeUser">
                <FormFK ref="assignee" 
                  v-model="dataForm['assigneeUser']" 
                  :moduleProp="getAssigneeUserProp()" 
                  :showValue="dataForm['assigneeUser.username']">
                </FormFK> 
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="0">
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
import FormDatetime from '../components/_form.datetime'
import FormTime from '../components/_form.time'
import FormSelect from '../components/_form.select'
import FormFK from '../components/_form.fk'
import FormFile from '../components/_form.file'
import Children from '../components/_view.children'
import { mapGetters } from "vuex";
import  { findTaskModules, getTaskModule, create, update, isRequired,
  isHideInForm, isShowInRow } from '@/api/example'
export default {
  name: "froms",
  components: {
    FormString, 
    FormText, 
    FormDate,
    FormFK, 
    FormDatetime,
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
        // subtitle: [{ required: true, message: '必输项', trigger: 'blur' }],
        // module: [{ required: true, message: '必输项', trigger: 'blur' }],
        // instanceId: [{ required: true, message: '必输项', trigger: 'blur' }],
        assigneeUser: [{ required: true, message: '必输项', trigger: 'blur' }],
      },
      pk: this.module.pk,
      moduleProps: this.module.props || [],

      assignee: null,

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
    ...mapGetters(["permission"]),
  },
  methods: {
    initialize(data) {
      this.dataForm = data || {}
      findTaskModules('task', {}).then(response => {
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
    setAction(action) {},
    submitForm() {
      this.dataForm.assignee = this.$refs.assignee.getContent()
      this.dataForm.instanceTitle = this.$refs.instanceId.getContent()
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = { ...this.dataForm }
          create('userProcess', params).then(response => {
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
    getActionDataList() {
      this.dataForm.instanceTitle = this.$refs.instanceId.content
      this.dataForm.messageNotice = this.messageNotice
      this.dataForm.taskStatus = 'ASSIGN'
      let actionDataList = [{ module: this.module.name, data: this.dataForm }]
      return actionDataList
    },
    isShowInRow(mp) {
      return isShowInRow(mp)
    }
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