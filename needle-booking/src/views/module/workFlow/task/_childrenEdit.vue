<template>
<div class="example-list-body" style="border-top:3px solid #d2d6de; border-bottom:1px solid #d2d6de;">
  <div class="box">
    <div class="left">
      <h3 style="margin:0px;padding-top:5px;">{{ childrenModule.showName }}</h3>
    </div>
    <div class="right">
      <el-button type="primary" plain v-if="isModuleEditable()" @click="handleChildrenCreate()"><span>新增</span></el-button>
      <el-button type="primary" plain v-if="isModuleEditable()" @click="handleChildrenUpdate()"><span>修改</span></el-button>
      <el-button type="danger" plain v-if="isModuleEditable()" @click="handleChildrenRemove()"><span>删除</span></el-button>
    </div>
  </div>
  <el-table v-loading="loading" :data="dataList" 
    @selection-change="handleSelectionChange" style="width: 100%">
    <el-table-column type="expand" width="30">
      <template slot-scope="scope">
        <el-form ref="ruleForm" label-width="150px">
          <el-row :gutter="0">
            <template v-for="prop in childrenModule.viewProps">
              <el-col v-if="!isHideInInfo(prop.ruleType)" 
                :key="prop.prop + '_extend'" 
                :xs="24" :sm="12">
                <el-form-item :label="prop.name">
                  <div style="margin-right:15px;">
                    {{ scope.row[prop.prop] }}
                  </div>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column type="selection" width="38"></el-table-column>
    <template v-for="(prop,index) in childrenModule.viewProps">
      <el-table-column 
        v-if="!isHideInList(prop.ruleType)" 
        :key="prop.prop + '_children_column'+index" 
        :label="prop.name" 
        :prop="prop.prop"
        :min-width="columnMinWidth(prop.maxLength)"
        sortable>
        <template slot-scope="scope">
        <el-tag v-if="prop.prop==='taskStatus'">
          {{ scope.row[prop.prop] }}
        </el-tag>
        <div v-else>{{ scope.row[prop.prop] }}</div>
        </template> 
      </el-table-column>
    </template>
  </el-table>
  <div class="crud-pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageRequest.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageRequest.size" background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageRequest.total">
    </el-pagination>
  </div>

  <el-dialog :visible.sync="dialogOtherFormVisible" append-to-body @open="openChildrenCreateDialog"
    :close-on-click-modal="false"
    class="edit-dialog" width="80%" :title="'新建'+childrenModule.showName">
    <div class="edit-dialog-content">
      <task-form ref="taskForm" :module="childrenModule" @handleSuccess="handleCreateTaskSuccess" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleChildrenSave">保存</el-button>
      <el-button type="success" @click="dialogOtherFormVisible=false">取消</el-button>
    </span>
  </el-dialog>

  <el-dialog :visible.sync="dialogOtherEditVisible" append-to-body :close-on-click-modal="false"
    class="edit-dialog" width="80%" :title="'修改'+childrenModule.showName">
    <div class="edit-dialog-content">
      <task-Edit ref="taskEdit" :module="childrenModule" @handleSuccess="handleUpdateTaskSuccess" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleChildrenEditSave">保存</el-button>
      <el-button type="success" @click="dialogOtherEditVisible=false">取消</el-button>
    </span>
  </el-dialog>

  <el-dialog :visible.sync="dialogOtherVisible" append-to-body :close-on-click-modal="false"
    class="edit-dialog" width="80%" :title="'新增'+otherModule.showName">
      <div class="edit-dialog-search">
        <el-form :inline="true">
          <template v-for="filterProp in otherModule.filterProps">
            <el-form-item 
              :label="filterProp.name"  
              :key="filterProp.prop">
              <FilterItem :filterProp="filterProp" v-model="filterProp.value"></FilterItem>
            </el-form-item>
            <el-form-item :key="'search-btn_'+filterProp.prop">
              <el-button type="primary" plain @click="handleOtherSearch">查询</el-button>
            </el-form-item>
          </template>
        </el-form>
      </div>  
      <div class="edit-dialog-content" 
        style="border-top:3px solid #d2d6de; border-bottom:1px solid #d2d6de;">
        <el-table v-loading="otherListLoading" ref="refOtherModuleTable"
          :data="otherDataList" 
          highlight-current-row
          @selection-change="handleOtherListSelectionChange"
          style="width: 100%">
          <el-table-column type="expand" width="30">
            <template slot-scope="scope">
              <el-form ref="ruleForm" label-width="150px" style="max-width:800px;">
                <el-row :gutter="0">
                  <el-col v-for="prop in otherModule.viewProps" 
                    :key="prop.prop + '_dialog'" :xs="24" :sm="12">
                    <el-form-item :label="prop.name">
                      <div style="margin-right:15px;">
                        {{ scope.row[prop.prop] }}
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="38"></el-table-column>
          <template v-for="prop in otherModule.viewProps">
            <el-table-column 
              v-show="!isHideInList(prop.ruleType)" 
              :key="prop.prop + '_childrenEdit_column'" 
              :label="prop.name" 
              :prop="prop.prop"
              :min-width="columnMinWidth(prop.maxLength)"
              sortable>
              <template slot-scope="scope">
              {{ scope.row[prop.prop] }}
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div class="crud-pagination">
          <el-pagination
            @size-change="handleOtherSizeChange"
            @current-change="handleOtherCurrentChange"
            :current-page="otherPageRequest.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="otherPageRequest.size" background
            layout="total, sizes, prev, pager, next, jumper"
            :total="otherPageRequest.total">
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOtherListSave">保存</el-button>
        <el-button type="danger" @click="handleOtherListRefresh">刷新</el-button>
        <el-button type="success" @click="dialogOtherVisible=false">取消</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
import { mapGetters } from "vuex"
import FormString from '../components/_form.string'
import FormText from '../components/_form.text'
import FormDate from '../components/_form.date'
import FormEditor from '../components/_form.editor'
import FormDateTime from '../components/_form.datetime'
import FormTime from '../components/_form.time'
import FormSelect from '../components/_form.select'
import FormFK from '../components/_form.fk'
import FormFile from '../components/_form.file'
import FilterItem from '../components/_view.filter'

import TaskForm from './_task.form'
import TaskEdit from './_task.edit'

import  { findList, getEntity, create, update, remove, isRequired, 
  isHideInList, isHideInForm, isHideInEdit, columnMinWidth, isHideInInfo } from '@/api/example'
export default {
  name: "Children",
  components: { 
    FilterItem,
    FormString, 
    FormText, 
    FormDate,
    FormFK, 
    FormDateTime,
    FormTime, 
    FormSelect,
    FormFile, 
    FormEditor,
    TaskForm,
    TaskEdit
  },
  props: {
    parent: {
      type: Object,
      default: () => {}
    },
    module: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      data: {},           // initialize
      refModuleProp: {},

      rules: this.getFormRules(),
      dataForm: {},
      dataList: [],
      pageRequest: {page:0, size: 10, total:0},
      loading: false,
      
      childrenModule: { viewProps: [] },
      dataListSelection: [],

      dialogOtherFormVisible: false,
      childrenModuleProps: [],
      
      dialogOtherEditVisible: false,
      dataEditForm: {},
      childrenDataEditFormKey: 0,

      dialogOtherVisible: false,
      otherModule: {},
      otherDataList: [],
      otherListSelection: [],
      otherListLoading: false,
      otherPageRequest: {page:0, size: 10, total:0}
    };
  },
  watch: {
  },
  created () {},
  computed: {
    ...mapGetters(["permission"]),
  },
  methods: {
    initialize(data, refProp) {
      this.data = data
      this.refModuleProp = this.module.props.filter(mp => mp.prop === refProp)[0]
      this.getChildrenData(data)
    },
    isModuleEditable() {
      let actions = this.parent ? this.parent.actions || [] : []
      let size = actions.filter(action => action.act === 'UPDATE').length
      return size > 0
    },
    getChildrenData(data) {
      if(!this.loading) {
        data = data || this.data
        this.loading = true
        let params = {}
        params[this.refModuleProp.prop] = data[this.refModuleProp.refProp]
        params._page = this.pageRequest.page ? this.pageRequest.page - 1 : 0
        params._size = this.pageRequest.size || 10
        findList(this.module.name, params).then(response => {
          let data = response.data
          this.dataList = data.content
          this.pageRequest = Object.assign(data.pageable, 
            {total:data.totalElements, page:data.number+1, size: data.size})
          
          let refProp = this.refModuleProp.prop
          let path = refProp + '.' + this.refModuleProp.refProp
          let showPath = refProp + '.' + this.refModuleProp.showProp
          this.dataForm[refProp] = this.data[this.refModuleProp.refProp]
          this.dataForm[showPath] = this.data[this.refModuleProp.showProp]

          this.childrenModule = response.module
          this.childrenModuleProps = response.module.props || []
          
          setTimeout(() => {
            this.loading = false
          }, 200)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    handleSelectionChange(val) {
      this.dataListSelection = val
    },
    handleSizeChange(val) {
      this.pageRequest.size = val;
      this.getChildrenData(this.data);
    },
    handleCurrentChange(val) {
      this.pageRequest.page = val;
      this.getChildrenData(this.data);
    },
    handleOtherSearch() {
      this.getOtherList()
    },
    handleOtherListSelectionChange(val) {
      this.otherListSelection = val 
    },
    getViewFilters() {
      let viewFilters = []
      if(this.otherModule.name && this.otherModule.filterProps) {
        this.otherModule.filterProps.forEach(fp => {
          let viewFilter = {prop:fp.prop, op:fp.op?fp.op:'=', value:fp.value}
          viewFilters.push(viewFilter)
        })
      }
      return viewFilters
    },
    getSubFilters(refProp, otherRefProp, otherRefMp) {
      let subFilter = {
        prop: otherRefMp.refProp, op:"not in",
        subQuery:{
          module: this.childrenModule.name,
          prop: otherRefProp,
          filters:[{
              prop:refProp,
              op:"=",
              value: this.data[this.refModuleProp.refProp]
            }
          ]
        }
      }
      return [ subFilter ]
    },
    handleChildrenCreate() {
      let otherRefProps = this.module.otherRefProps || []
      if(otherRefProps.length !== 1) {
        this.dialogOtherFormVisible = true
      }
      else {
        let childProp = this.module.props || []
        let propSize = childProp.filter(mp => !mp.refModuleName && !this.isHideInEdit(mp.prop)).length
        if(propSize > 1) {
          this.dialogOtherFormVisible = true
        } 
        else {
          this.dialogOtherVisible = true
          this.getOtherList()
        }
      }
    },
    openChildrenCreateDialog() {
      this.$nextTick(_ => {
        let params = {}
        params[this.refModuleProp.prop] = this.data[this.refModuleProp.refProp]
        this.$refs.taskForm.initialize(params)
      })
    },
    handleCreateTaskSuccess() {
      this.dialogOtherFormVisible = false
      this.getChildrenData(this.data)
      this.$emit('handleTaskSteps')
    },
    getFormRules() {
      let rules = {}
      this.module.props.forEach(mp => {
        if(isRequired(mp.ruleType)) {
          rules[mp.prop] = [{ 
            required: true, 
            message: '必输项', 
            trigger: 'change',
          }]
        }
      })
      return rules
    },
    handleChildrenUpdate() {
      if(this.dataListSelection.length <= 0) {
        this.$alert('请选择一行待修改的记录', '警告', { 
          confirmButtonText: '确认'
        })
        return
      }
      this.dialogOtherEditVisible = true
      this.dataEditForm = this.dataListSelection[0]
      this.$nextTick(_ => {
        this.$refs.taskEdit.initialize(this.dataEditForm)
      })
    },
    handleUpdateTaskSuccess() {
      this.dialogOtherEditVisible = false
      this.getChildrenData(this.data)
      this.$emit('handleTaskSteps')
    },
    handleChildrenSave() {
      this.$refs.taskForm.submitForm()
    },
    handleChildrenEditSave() {
      this.$refs.taskEdit.submitForm()
    },
    handleChildrenReset() {
      this.$refs['childrenDataForm'].resetFields()
    },
    getOtherList() {
      if(!this.otherListLoading) {
        if(this.module.otherRefProps && this.module.otherRefProps.length > 0) {
          this.otherListLoading = true
          let refProp = this.module.refProp
          let params = {"_vf": JSON.stringify(this.getViewFilters())}
          let otherRefProp = this.module.otherRefProps[0]
          let mp = this.childrenModule.props.find(mp => mp.prop === otherRefProp)
          params['_sf'] = JSON.stringify(this.getSubFilters(refProp, otherRefProp, mp))
          params = Object.assign(params, this.otherPageRequest)
          params.page = params.page ? params.page - 1 : 0
          findList(mp.refModuleName, params).then(response => {
            let data = response.data
            this.otherDataList = data.content
            this.otherPageRequest = Object.assign(data.pageable, 
              {total:data.totalElements, page:data.number+1, size: data.size})
            let filterProps = this.otherModule.filterProps
            this.otherModule = response.module
            if(filterProps && filterProps.length > 0) {
              this.otherModule.filterProps = filterProps
            }
            setTimeout(() => {
              this.otherListLoading = false
            }, 200)
          }).catch(() => {
            this.otherListLoading = false
          })
        }
      }
    },
    handleOtherListSave() {
      if(this.otherListSelection.length <= 0) {
        this.$alert('请先勾选要保存的记录', '警告', { confirmButtonText: '确认' })
        return
      }
      let refProp = this.module.refProp
      let otherRefProp = this.module.otherRefProps[0]
      let otherMp = this.childrenModule.props.find(mp => mp.prop === otherRefProp)
      let actionDataList = []
      let actionData = { module: this.childrenModule.name, data: [] }
      this.otherListSelection.forEach(row => {
        let map = {}
        map[refProp] = this.data[this.refModuleProp.refProp]
        map[otherRefProp] = row[otherMp.refProp]
        actionData.data.push(map) 
      })
      actionDataList.push(actionData)
      let params = { _data: JSON.stringify(actionDataList) }
      create(this.module.name, params).then(response => {
        this.getChildrenData(this.data)
        this.dialogOtherVisible = false
      }).catch(() => {})
    },
    handleOtherListRefresh() {
      this.getOtherList()
    },  
    handleChildrenRemove() {
      if(this.dataListSelection.length <= 0) {
        this.$alert('请选择待删除的记录', '警告', { confirmButtonText: '确认' })
        return
      }
      this.$confirm('确认要删除吗？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消', type: '警告'
      }).then(() => {
        const params = { id: this.dataListSelection.map(d => d[this.childrenModule.pk]) }
        remove(this.childrenModule.name, params).then(response => {
          this.getChildrenData(this.data)
          this.$emit('handleTaskSteps')
          this.$message({ type: 'success', message: '删除操作执行完成' })
        }).catch((error) => {})
      }).catch(() => {
        this.$message({ type: 'info', message: '删除已取消' });
      })
    },
    getDataListSelection() {
      return this.dataListSelection
    },
    handleOtherSizeChange(val) {
      this.otherPageRequest.size = val;
      this.getOtherList();
    },
    handleOtherCurrentChange(val) {
      this.otherPageRequest.page = val;
      this.getOtherList();
    },
    isHideInList(ruleType) {
      return isHideInList(ruleType)
    },
    columnMinWidth,
    isHideInForm,
    isHideInEdit,
    isHideInInfo
  }
};
</script>
<style lang="scss" scoped>
.from-container {
  padding: 8px 10px;
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
    margin-bottom: 5px;
  }
  .right {
    width: 400px;
    text-align:right;
  }
  .crud-pagination {
    margin-top:4px;
    padding:2px 10px;
    text-align:right;
  }
}
</style>
<style>
/* .example-list-container .el-table-column--selection .cell {
  padding:0px 10px!important;
}
.edit-dialog-search .el-form-item {
  margin-bottom: 10px;
}
.edit-dialog .el-table-column--selection .cell {
  padding:0px 10px!important;
}
.example-list-container .el-dialog{
  display: flex;
  flex-direction: column;
  min-width: 600px;
  margin:0 !important;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  max-height:calc(100% - 30px);
  max-width:calc(100% - 30px);
}
.example-list-container .el-dialog .el-dialog__body{
  flex:1;
  overflow: auto;
}
.example-list-container .el-dialog .el-dialog__footer {
  text-align: center;
}
.edit-dialog .el-dialog .el-dialog__footer {
  text-align: center;
}
.edit-dialog .crud-pagination {
  margin-top:2px;
  padding:2px 10px;
  text-align:right;
} */
</style>