<template>
  <div class="example-list-container">
    <div style="padding:15px 15px 5px 15px;">
      <div style="margin:0 10px;position:relative;">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="全部商品" name="ALL"></el-tab-pane>
          <el-tab-pane label="出售中" name="ON_SALE"></el-tab-pane>
          <el-tab-pane label="已售完" name="SALE_OUT"></el-tab-pane>
          <el-tab-pane label="已下架" name="OFF_SALE"></el-tab-pane>
        </el-tabs>

        <div style="position:absolute;right:0px;top:0px;">
          <el-button type="primary" plain @click="handleSort('sellVolume')">按销量排序</el-button>
          <el-button type="primary" plain @click="handleSort('retailPrice')">按售价排序</el-button>
          <el-button type="primary" plain @click="handleSort('goodsNumber')">按库存排序</el-button>
        </div>
      </div>

      <el-form :inline="true">
        <template v-for="(filterProp, index) in (filterProps || [])">
        <el-form-item :label="filterProp.name" label-width="88px" style="text-align:right;"  
          :key="'home-filter-'+filterProp.prop + '_' + index">
          <FilterItem :filterProp="filterProp" 
            v-model="filterProp.value" @handleOp="function(op) {$set(filterProp, 'op', op)}">
          </FilterItem>
        </el-form-item>
        </template>
        <el-form-item :key="'home-search-btn'">
          <el-button type="primary" plain @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="example-list-body" 
      style="margin:0px 20px 20px 20px;border-top:3px solid #d2d6de; border-bottom:1px solid #d2d6de;">
      <div class="box">
        <div class="left">
          <template v-for="action in (module.actions || [])" >
            <el-button v-if="action.act === 'CREATE'" type="default" icon="el-icon-edit-outline"
              @click="handleCreate(action)" 
              :key="'tool_action_' + action.id"><span>{{ action.name }}</span>
            </el-button>
            <el-button v-else-if="action.act === 'UPDATE'" type="default" icon="el-icon-edit" 
              @click="handleUpdate(action)" 
              :key="'tool_action_' + action.id"><span>{{ action.name }}</span>
            </el-button>
            <el-button v-else-if="action.act === 'DELETE'" type="default" icon="el-icon-delete"  
              @click="handleDelete(action)" 
              :key="'tool_action_' + action.id"><span>{{ action.name }}</span>
            </el-button>
            <el-button v-else-if="action.act === 'IMPORT'" type="default" icon="el-icon-upload2" 
              @click="handleImport" :key="'tool_action_' + action.id">
              <span>{{action.name}}</span>
            </el-button>
            <el-button v-else-if="action.act==='EXPORT'" type="default" icon="el-icon-download" 
              @click="handleExport" :key="'tool_action_' + action.id">
              <span>{{action.name}}</span>
            </el-button>
          </template>
        </div>
        <div class="right">
          <el-button type="default" icon="el-icon-refresh" @click="getList"></el-button>
          <el-button type="default" icon="el-icon-menu" @click="dialogViewPropertyVisible = true"></el-button>
        </div>
      </div>
      <section v-cloak class="table-list">
        <el-table v-loading="loading" @selection-change="handleSelectionChange" 
          :data="dataList"  highlight-current-row :key="dataListKey" 
          style="width:100%;">
          <el-table-column type="expand" width="30">
            <template slot-scope="scope">
              <el-form ref="ruleForm" label-width="120px" 
                style="max-width:1264px;">
                <el-row :gutter="0">
                  <template v-for="(prop) in module.viewProps">
                  <el-col v-if="!isHideInInfo(prop.ruleType) && !isAuditProp(prop.ruleType)"
                    :key="prop.prop + '_expand'" :xs="24" 
                    :sm="isShowInRow(prop)?24:12">
                    <el-form-item :label="prop.name">
                      <div v-if="prop.feature==='IMAGE' && scope.row[prop.prop]">
                        <a href="#" @click="handlePreview(getFileUrl(scope.row[prop.prop], prop.ruleType))">
                          <img :src="getFileUrl(scope.row[prop.prop], prop.ruleType)" class="max_20_20" />
                        </a>
                      </div>
                      <div v-else-if="prop.feature==='FILE' && scope.row[prop.prop]">
                        <a :href="getFileUrl(scope.row[prop.prop], prop.ruleType)" target="_blank">
                          <i class="el-icon-document" />
                        </a>
                      </div>
                      <div v-else-if="prop.feature==='EDITOR' && scope.row[prop.prop]">
                        <div v-html="scope.row[prop.prop]"></div>
                      </div>
                      <div v-else>{{ scope.row[prop.prop] }}</div>
                    </el-form-item>
                  </el-col>
                  </template>
                </el-row>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="38" style="padding:0px!important;"></el-table-column>
          <el-table-column label="操作" width="78">
            <template slot-scope="scope">
              <el-button type="default" icon="el-icon-document" style="padding:4px;margin-right:4px;" 
                title="详情" @click="handleInfo(scope.row)">
              </el-button>
              <!-- <el-dropdown v-if="module.actions && module.actions.filter(a=>a.act==='UPDATE'||a.act==='DELETE'||a.execute).length>0"  -->
              <el-dropdown v-if="module.actions" 
                  placement="bottom" trigger="click" :hide-on-click="false">
                <el-button type="default" icon="el-icon-arrow-right" style="padding:4px;" title="更多"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <template v-for="action in module.actions" >
                    <el-dropdown-item v-if="action.act === 'UPDATE'" style="min-width:100px;" 
                      :disabled="action.disableProp && action.disableValues.find(dv=>dv===scope.row[action.disableProp])"
                      :key="'list_update_'+action.name" @click.native="handleUpdateRow(scope.row, action)"> 
                      <i class="el-icon-edit"></i>&nbsp;&nbsp;{{action.name}}
                    </el-dropdown-item>
                    <el-dropdown-item v-else-if="action.act === 'DELETE'" 
                      :disabled="action.disableProp && action.disableValues.find(dv=>dv===scope.row[action.disableProp])"
                      :key="'list_delete_'+action.name" @click.native="handleDeleteRow(scope.row, action)">
                      <i class="el-icon-delete"></i>&nbsp;&nbsp;{{action.name}}
                    </el-dropdown-item>
                    <el-dropdown-item v-else-if="!action.act && !!action.uri" 
                      :disabled="action.disableProp && action.disableValues.find(dv=>dv===scope.row[action.disableProp])"
                      :key="'list_execute_'+action.name" @click.native="handleExecuteRow(scope.row, action)">
                      <i class="el-icon-video-play"></i>&nbsp;&nbsp;
                      {{action.name}}
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <template v-for="(prop) in viewProps">
            <el-table-column 
              v-if="!isHideInList(prop.ruleType)"
              :key='prop.prop' 
              :label="prop.name" 
              :prop="prop.prop"
              :min-width="columnMinWidth(prop.maxLength)"
              sortable>
              <template slot-scope="scope">
                <div v-if="prop.feature==='IMAGE' && scope.row[prop.prop]">
                  <a href="#" @click="handlePreview(getFileUrl(scope.row[prop.prop], prop.ruleType))">
                    <img :src="getFileUrl(scope.row[prop.prop], prop.ruleType)" class="max_20_20" />
                  </a>
                </div>
                <div v-else-if="prop.feature==='FILE' && scope.row[prop.prop]">
                  <a :href="getFileUrl(scope.row[prop.prop], prop.ruleType)" target="_blank">
                    <i class="el-icon-document" />
                  </a>
                </div>
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
            :page-sizes="[10, 20, 50, 100, 1000]"
            :page-size="pageRequest.size" background
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageRequest.total">
          </el-pagination>
        </div> 
      </section>
    </div>

    <el-dialog :visible.sync="dialogViewPropertyVisible" left 
      :close-on-click-modal="true">
      <div slot="title">选择可显示列</div>
      <div style="margin-top:-25px;">
        <div style="padding:0px;margin:0px;">
          <div style="margin-top:0px;padding:20px 15px;border-top:1px solid #d2d6de;line-height:28px;">
            <el-checkbox-group v-model="viewPropArray">
              <el-row>
                <template v-for="(prop, index) in module.viewProps">
                  <el-col :xs="12" :sm="8" v-if="isListProp(prop.ruleType)"
                    :key="'dialog_'+prop.prop + index">
                    <el-checkbox :label="prop.prop">{{prop.name}}</el-checkbox>
                  </el-col>
                </template>
              </el-row>
            </el-checkbox-group>
          </div>
          <div style="text-align:center;margin-top:0px;border-top:0px solid #d2d6de;border-top:1px solid #f2f2f2;padding:10px 10px 0px 10px;margin-bottom:-15px;">
            <el-button type="primary" @click="selectedViewPropArray=viewPropArray;dialogViewPropertyVisible=false">确定</el-button>
            <el-button type="success" @click="dialogViewPropertyVisible=false">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisible" @open="openFormDialog" 
      :close-on-click-modal="false" 
      width="86%" :title="'新建' + module.showName">
      <Form ref="dialogForm" :module="module" @handleSuccess="handleCreateSuccess"></Form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFormSave">保存</el-button>
        <el-button type="danger" @click="handleFormReset">重置</el-button>
        <el-button type="success" @click="dialogFormVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogEditVisible" @open="openEditDialog" 
      :close-on-click-modal="false" :fullscreen="fullscreen"
      width="86%" :title="'修改' + module.showName">
      <Edit ref="dialogEdit" :module="module" 
        @handleUpdateSuccess="handleEditUpdateSuccess"
        @handleDeleteSuccess="handleEditDeleteSuccess"></Edit>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditSave">保存</el-button>
        <template v-for="action in (module.actions || [])">
          <el-button type="danger" v-if="action.act === 'DELETE'" @click="handleEditDelete"
             :key="'edit_footer_act_' + action.id">
            {{action.name}}
          </el-button>
        </template>
        <!-- <el-button type="danger" @click="handleEditRefresh">刷新</el-button> -->
        <el-button type="success" @click="dialogEditVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogInfoVisible" @open="openInfoDialog" 
      :close-on-click-modal="false" width="86%" :title="module.showName + '详情'">
      <Info ref="dialogInfo" :module="module" @handleDeleteSuccess="handleInfoDeleteSuccess"></Info>
      <span slot="footer" class="dialog-footer">
        <template v-for="action in (module.actions || [])">
          <el-button type="danger" v-if="action.act === 'UPDATE'" @click="handleInfoUpdate"
            :disabled="action.disableProp && action.disableValues.find(dv=>dv===dataSelection[action.disableProp])"
            :key="'info_footer_act_' + action.id">
            {{action.name}}
          </el-button>
          <el-button type="danger" v-if="action.act === 'DELETE'" @click="handleInfoDelete"
            :disabled="action.disableProp && action.disableValues.find(dv=>dv===dataSelection[action.disableProp])"
            :key="'info_footer_act_' + action.id">
            {{action.name}}
          </el-button>
        </template>
        <el-button type="danger" @click="handleInfoRefresh">刷新</el-button>
        <el-button type="success" @click="dialogInfoVisible=false">退出</el-button>
      </span>
    </el-dialog>

    <import-list ref="importList" :module="module" @import="handleImportComplete"></import-list>

    <export-list ref="exportList" :module="module" 
      :selectedPropArray="viewPropArray"
      :dataList="dataList" 
      :dataListSelection="dataListSelection"></export-list>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Loading } from 'element-ui'
  import openWindow from '@/utils/open-window'
  import FilterItem from '@/views/module/components/_view.filter'
  import Info from '@/views/module/components/_view.info'
  import Form from './_view.form'
  import Edit from './_view.edit'
  import ImportList from '@/views/module/components/_data.import'
  import ExportList from '@/views/module/components/_data.export'
  import  { findList, remove, execute, isHideInList, isHideInInfo, isAuditProp, HIDE_LIST,
    columnMinWidth, isListProp, isShowInRow, isAbsoluteFile } from '@/api/example'

  let id = 0;
  export default {
    components: { 
      FilterItem,
      Info,
      Form,
      Edit,
      ImportList,
      ExportList
    },
    directives: {},
    
    data() {
      return {
        activeName: 'ALL',
        tabViewFilters: null,
        _sort: 'sortOrder',
        _direction: 'ASC',

        fullscreen: false,
        id: '',
        filterProps: [],
        viewFilters: [],
        module: { name: this.$route.path.split('/')[1] },
        currentAction: {},

        viewProps: [],
        dialogViewPropertyVisible: false,
        viewPropArray: [],
        selectedViewPropArray: [],  // ['id', 'name']
        dataListKey: 0,

        loading: false,
        dataList: [],
        dataListSelection: [],
        dataSelection: {},
        pageRequest: {},

        dialogInfoVisible: false,
        dialogFormVisible: false,
        dialogEditVisible: false,
      }
    },
    watch: {
      $route(to) {},
      selectedViewPropArray(valArr) {
        let viewProps = []
        this.module.viewProps.forEach(vp => {
          if(valArr.indexOf(vp.prop) > -1) {
            if((vp.ruleType & HIDE_LIST) === HIDE_LIST) {
              vp.ruleType ^= HIDE_LIST
            }
            viewProps.push(vp)
          }
        })
        this.viewProps = viewProps
      },
    },
    created() {
      this.id = this.$route.query.id
      this.getList()
    },
    computed: {
      ...mapGetters([ 'fileHttpServer' ]),
    },
    mounted() {
      if(this.id) {
        let pk = this.$route.query._pk || 'id'
        let params = {}
        params[pk] = this.id
        this.module.pk = pk
        if(this.id) {
          this.handleInfo(params)
        }
      }
    },
    methods: {
      handleTabClick(tab, event) {
        console.log('tab=' + tab.name + ', event=' + event)
        if(tab.name === 'ALL') {
          this.tabViewFilters = null
        }
        else if(tab.name === 'ON_SALE') {
          this.tabViewFilters = {prop:'isOnSale',value:true}
        }
        else if(tab.name === 'SALE_OUT') {
          this.tabViewFilters = {prop:'goodsNumber', op: '<=', value:0}
        }
        else if(tab.name === 'OFF_SALE') {
          this.tabViewFilters = {prop:'isOnSale',value:false}
        }
        this.handleSearch()
      },
      handleSort(sortProp) {
        this._sort = sortProp
        this._direction = "DESC"

        this.viewFilters = this.getViewFilters()
        this.pageRequest.page = 0;
        this.getList();
      },
      getViewFilters() {
        let viewFilters = []
        if(this.tabViewFilters) {
          viewFilters.push(this.tabViewFilters)
        }
        this.filterProps.forEach(fp => {
          let value = fp.value
          if(typeof(value) === Array) {
            value = value[value.length - 1]
          }
          fp.op = fp.op || fp.ops.length>0?fp.ops[0].value : '='
          let viewFilter = {
            prop: fp.prop, 
            op: fp.op,
            value: value
          }
          viewFilters.push(viewFilter)
        })
        return viewFilters
      },
      handleSearch() {
        this.viewFilters = this.getViewFilters()
        this.pageRequest.page = 0;
        this._sort = "sortOrder"
        this._direction = "ASC"
        this.getList();
      },
      getList() {
        if(!this.loading) {
          this.loading = true
          let params = { _vf: JSON.stringify(this.viewFilters) }
          params._page = this.pageRequest.page ? this.pageRequest.page - 1 : 0
          params._size = this.pageRequest.size || 10
          params._sort = this._sort
          params._direction = this._direction
          findList(this.module.name, params).then(response => {
            let data = response.data
            this.dataList = data.content || []
            this.pageRequest = Object.assign(data.pageable, 
              {total:data.totalElements, page:data.number+1, size:data.size})
            this.module = response.module
            if(this.filterProps.length === 0) {
              this.filterProps = this.module.filterProps
            }
            if(this.viewProps.length === 0) {
              this.module.viewProps.filter(vp => !isHideInList(vp.ruleType)).forEach(vp => {
                this.viewProps.push(vp)
                this.viewPropArray.push(vp.prop)
              })
            }
            setTimeout(() => {
              this.loading = false
            }, 200)
          }).catch(() => {
            this.loading = false;
          })
        }
      },
      handleSelectionChange(val) {
        this.dataListSelection = val
      },
      handleCreate(action) {
        this.dialogFormVisible = true
        this.currentAction = action
      },
      openFormDialog() {
        this.$nextTick(_ => {
          this.$refs.dialogForm.setAction(this.currentAction)
        })
      },
      handleFormSave() {
        this.$refs['dialogForm'].submitForm()
      },
      handleFormReset() {
        this.$refs['dialogForm'].initialize()
      },
      handleCreateSuccess() {
        this.getList()
        this.dialogFormVisible = false
      },
      handleUpdateRow(row, action) {
        this.dataSelection = row
        this.dialogEditVisible = true
        this.currentAction = action
      },
      handleUpdate(action) {
        if(this.dataListSelection.length <= 0) {
          this.$alert('请选择一行待修改的记录', '警告', { 
            confirmButtonText: '确认'
          })
          return
        }
        this.currentAction = action
        this.dataSelection = this.dataListSelection[0]

        if(action.disableProp && action.disableValues.find(dv=>dv===this.dataSelection[action.disableProp])) {
          this.$alert('当前选中的记录不允许修改', '错误', { 
            confirmButtonText: '确认'
          })
          return
        }
        this.dialogEditVisible = true
      },
      openEditDialog() {
        this.$nextTick(_ => {
          this.$refs.dialogEdit.initialize(this.dataSelection)
          this.$refs.dialogEdit.setAction(this.currentAction)
        })
      },
      handleEditSave() {
        this.$refs['dialogEdit'].submitForm()
      },
      handleEditDelete() {
        this.$refs['dialogEdit'].deleteData()
      },
      handleEditRefresh() {
        this.$refs.dialogEdit.initialize(this.dataSelection)
      },
      handleEditUpdateSuccess() {
        this.dialogEditVisible = false
        this.getList()
      },
      handleEditDeleteSuccess() {
        this.dialogEditVisible = false
        this.getList()
      },
      handleInfo(data) {
        this.dialogInfoVisible = true
        this.dataSelection = data
      },
      openInfoDialog() {
        this.$nextTick(_ => {
          this.$refs.dialogInfo.initialize(this.dataSelection)
        })
      },
      handleInfoRefresh() {
        this.$refs.dialogInfo.initialize(this.dataSelection)
      },
      handleInfoUpdate() {
        this.dialogInfoVisible = false
        this.handleUpdateRow(this.dataSelection)
      },
      handleInfoDelete() {
        this.$refs.dialogInfo.deleteData()
      },
      handleInfoDeleteSuccess() {
        this.dialogInfoVisible = false
        this.getList()
      },
      handleDeleteRow(row, action) {
        this.$confirm('确认要删除当前记录吗？', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          const params = { id: row.id }
          remove(this.module.name, params).then(response => {
            this.getList();
            this.$message({ type: 'success', message: '删除操作执行完成' });
          }).catch((error) => {})
        }).catch(() => {
          this.$message({ type: 'info', message: '删除已取消' });
        })
      },
      handleExecuteRow(row, action) {
        this.$confirm('确认要执行"' + action.name + '"吗？', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          const params = { id: row.id }
          execute(action, params).then(response => {
            this.getList();
            this.$message({ type: 'success', message: action.name + '操作执行完成' });
          }).catch((error) => {})
        }).catch(() => {})
      },
      handleDelete(action) {
        if(this.dataListSelection.length <= 0) {
          this.$alert('请选择待删除的记录', '警告', { 
            confirmButtonText: '确认'
          })
          return
        }

        let msg = '确认要删除吗？'
        for(let i = 0; i < this.dataListSelection.length; i++) {
          let dataSelection = this.dataListSelection[i]
          if(action.disableProp && action.disableValues.find(dv=>dv===dataSelection[action.disableProp])) {
            // this.$alert('当前选中的记录集中存在着不允许删除的记录', '错误', { 
            //   confirmButtonText: '确认'
            // })
            // return
            msg = '当前选中的记录中存在着已经提交且不能更改的数据，确认要删除吗？'
            break
          }
        }
        this.$confirm(msg, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          const params = { id: this.dataListSelection.map(d => d[this.module.pk]) }
          remove(this.module.name, params).then(response => {
            this.getList();
            this.$message({ type: 'success', message: '删除操作执行完成' });
          }).catch((error) => {})
        }).catch(() => {
          this.$message({ type: 'info', message: '删除已取消' });
        })
      },
      handleImport() {
        this.$refs.importList.dialogImportVisible = true
      },
      handleImportComplete() {
        this.getList()
      },
      handleExport() {
        this.$refs.exportList.dialogExportVisible = true
      },
      handleSelectionChange(val) {
        this.dataListSelection = val;
      },
      handleSizeChange(val) {
        this.pageRequest.size = val;
        this.getList();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageRequest.page = val;
        this.getList();
        console.log(`当前页: ${val}`);
      },
      getFileUrl(uri, ruleType) {
        if(isAbsoluteFile(ruleType)) {
          return uri
        }
        let server = this.fileHttpServer + ''
        if(server.endsWith('/')) {
          server = server.substring(0, server.length - 1)
        }
        return server + uri
      },
      handlePreview(url) {
        if(url) openWindow(url, "图片预览", 600, 600)
      },
      isHideInList,
      isHideInInfo,
      columnMinWidth,
      isListProp,
      isAuditProp,
      isShowInRow,
      isAbsoluteFile
    }
  }
</script>

<style lang="scss" scoped>
.example-list-container {
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
    width: 100px;
    text-align:right;
  }
  .el-form-item { margin-bottom: 10px; }
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
<style>
.el-dialog{
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
.el-dialog .el-dialog__body{
  flex:1;
  overflow: auto;
}
.el-dialog .el-dialog__footer {
  text-align: center;
} 

.example-list-container .el-table .el-table-column--selection .cell {
  padding:0px 10px!important;
}
.example-list-container .el-table .cell {
  vertical-align: top;
}
.example-list-container .el-form-item__content {
  word-break: break-all;
}
.max_20_20 {
  max-width: 20px;
  max-height: 20px;
  vertical-align: middle;
}
.table-list .el-table {
  overflow-x: auto;
  min-height: 420px;
}
.table-list .el-table__header-wrapper {
  overflow:initial;
  width: 100%;
}
.table-list .el-table__body-wrapper {
  overflow:initial!important;
  width: 100%;
}
</style>