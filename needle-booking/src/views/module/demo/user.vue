<template>
  <div class="example-list-container">
    <div style="padding:15px 20px 5px 20px;">
      <el-form :inline="true">
        <template v-for="filterProp in (filterProps || [])">
        <el-form-item :label="filterProp.name"  
          :key="'home-filter-'+filterProp.prop">
          <FilterItem :filterProp="filterProp" 
            v-model="filterProp.value" @handleOp="function(op) {filterProp.op = op}">
          </FilterItem>
        </el-form-item>
        </template>
        <el-form-item :key="'home-search-btn'">
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-form :inline="true" :model="findForm">
        <el-form-item label="用户组">
          <el-cascader v-model="findForm.group" clearable :props="props"></el-cascader>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="findForm.username" placeholder="用户组"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="primary">高级搜索</el-button>
        </el-form-item>
      </el-form> -->
    </div>
    <div class="example-list-body" 
      style="margin:0px 20px 20px 20px;border-top:3px solid #d2d6de; border-bottom:1px solid #d2d6de;">
      <div class="box">
        <div class="left">
          <template v-for="action in module.actions" >
            <el-button v-if="action.act === 'CREATE'" type="default" 
              @click="handleCreate(action)" 
              :key="'tool_action_' + action.id"><span>{{ action.name }}</span>
            </el-button>
            <el-button v-else-if="action.act === 'UPDATE'" type="default" 
              @click="handleUpdate(action)" 
              :key="'tool_action_' + action.id"><span>{{ action.name }}</span>
            </el-button>
            <el-button v-else-if="action.act === 'DELETE'" type="default" 
              @click="handleDelete(action)" 
              :key="'tool_action_' + action.id"><span>{{ action.name }}</span>
            </el-button>
          </template>
          <!-- <el-button type="default" @click="handleCreate()"><span>新建</span></el-button>
          <el-button type="default" @click="handleUpdate()"><span>修改</span></el-button>
          <el-button type="default" @click="handleDelete()"><span>删除</span></el-button>
          <el-button type="default" key="importList" icon="el-icon-upload2" @click="handleImport"><span>导入</span>
          </el-button>
          <el-button type="default" key="exportList" icon="el-icon-download" @click="handleExport"><span>导出</span>
          </el-button> -->
        </div>
        <div class="right">
          <el-button type="default" icon="el-icon-refresh" @click="getList"></el-button>
          <el-button type="default" icon="el-icon-menu" @click="dialogViewPropertyVisible = true"></el-button>
        </div>
      </div>
      <section v-cloak>
        <el-table v-loading="loading" @selection-change="handleSelectionChange" 
          :data="dataList" fit highlight-current-row :key="dataListKey"
          style="width: 100%">
          <el-table-column type="expand" width="30">
            <template slot-scope="scope">
              <el-form ref="ruleForm" label-width="150px">
                <el-row :gutter="0">
                  <el-col v-for="prop in module.viewProps" :key="prop.prop + '_expand'" :xs="24" :sm="12">
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
          <el-table-column type="selection" width="38" style="padding:0px!important;"></el-table-column>
          <el-table-column label="操作" width="78">
            <template slot-scope="scope">
              <el-button type="default" icon="el-icon-document" style="padding:4px;margin-right:4px;" 
                title="详情" @click="handleInfo(scope.row)"></el-button>
              <el-dropdown placement="bottom" trigger="click" :hide-on-click="false">
                <el-button type="default" icon="el-icon-arrow-right" style="padding:4px;" title="更多"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <template v-for="action in module.actions" >
                    <el-dropdown-item v-if="action.act === 'UPDATE'" 
                      :key="'list_update_'+action.name" @click.native="handleUpdateRow(scope.row, action)"> 
                      <i class="el-icon-edit"></i>&nbsp;&nbsp;{{action.name}}
                    </el-dropdown-item>
                    <el-dropdown-item v-if="action.act === 'DELETE'" 
                      :key="'list_delete_'+action.name" @click.native="handleDeleteRow(scope.row, action)">
                      <i class="el-icon-edit"></i>&nbsp;&nbsp;{{action.name}}
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <template v-for="(prop) in viewProps">
            <el-table-column v-if="!isHideInList(prop.ruleType)"
              :key='prop.prop' :label="prop.name" :prop="prop.prop">
              <template slot-scope="scope">
                <div>{{ scope.row[prop.prop] }}</div>
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
      </section>
    </div>

    <el-dialog :visible.sync="dialogViewPropertyVisible" left :close-on-click-modal="true" @dragDialog="handleDialogDrag">
      <div slot="title">选择可显示列</div>
      <div style="margin-top:-25px;">
        <div style="padding:0px;margin:0px;">
          <div style="margin-top:0px;padding:20px 15px;border-top:1px solid #d2d6de;line-height:28px;">
            <el-checkbox-group v-model="viewPropArray">
              <el-row>
                <template v-for="(prop, index) in module.viewProps">
                  <el-col :xs="12" :sm="8" v-if="!isHideInList(prop.ruleType)"
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

    <el-dialog :visible.sync="dialogFormVisible" @open="openFormDialog" :close-on-click-modal="false" 
      width="80%" :title="'新建' + module.name">
      <Form ref="dialogForm" :module="module" @handleSuccess="handleCreateSuccess"></Form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFormSave">保存</el-button>
        <el-button type="danger" @click="handleFormReset">重置</el-button>
        <el-button type="success" @click="dialogFormVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogEditVisible" @open="openEditDialog" :close-on-click-modal="false" 
      width="80%" :title="'修改' + module.name">
      <Edit ref="dialogEdit" :module="module" 
        @handleUpdateSuccess="handleEditUpdateSuccess"
        @handleDeleteSuccess="handleEditDeleteSuccess"></Edit>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditSave">保存</el-button>
        <template v-for="action in module.actions">
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
      :close-on-click-modal="false"
      width="80%" :title="module.name + '详情'">
      <Info ref="dialogInfo" :module="module" @handleDeleteSuccess="handleInfoDeleteSuccess"></Info>
      <span slot="footer" class="dialog-footer">
        <template v-for="action in module.actions">
          <el-button type="danger" v-if="action.act === 'UPDATE'" @click="handleInfoUpdate"
             :key="'info_footer_act_' + action.id">
            {{action.name}}
          </el-button>
          <el-button type="danger" v-if="action.act === 'DELETE'" @click="handleInfoDelete"
             :key="'info_footer_act_' + action.id">
            {{action.name}}
          </el-button>
        </template>
        <el-button type="danger" @click="handleInfoRefresh">刷新</el-button>
        <el-button type="success" @click="dialogInfoVisible=false">退出</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import FilterItem from '../components/_view.filter'
  import Info from '../components/_view.info'
  import Form from '../components/_view.form'
  import Edit from '../components/_view.edit'

  import { Loading } from 'element-ui'
  import  { findList, remove, isAuditProp, isID, isHideInList } from '@/api/example'

  let id = 0;
  export default {
    components: { 
      FilterItem,
      Info,
      Form,
      Edit
    },
    directives: {},
    
    data() {
      return {
        filterProps: [],
        viewFilters: [],
        module: { name: 'user' },
        
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
            viewProps.push(vp)
          }
        })
        this.viewProps = viewProps
      },
    },
    created() {
      this.getList()
    },
    mounted() {
    },
    methods: {
      handleDrag() {
        this.$refs.select.blur()
      },
      getViewFilters() {
        let viewFilters = []
        this.filterProps.forEach(fp => {
          let value = fp.value
          if(typeof(value) === Array) {
            value = value[value.length - 1]
          }
          let viewFilter = {
            prop: fp.prop, 
            op: fp.op || '=',
            value: value
          }
          viewFilters.push(viewFilter)
        })
        return viewFilters
      },
      handleSearch() {
        this.viewFilters = this.getViewFilters()
        this.pageRequest.page = 0;
        this.getList();
      },
      getList() {
        if(!this.loading) {
          this.loading = true
          let params = { _vf: JSON.stringify(this.viewFilters) }
          params = Object.assign(params, this.pageRequest)
          params.page = params.page ? params.page - 1 : 0
          findList(this.module.name, params).then(response => {
            let data = response.data
            this.dataList = data.content || []
            this.pageRequest = Object.assign(data.pageable, 
              {total:data.totalElements, page:data.number+1, size:data.size})
            this.module = Object.assign(this.module, response.module)
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
      handleCreate() {
        this.dialogFormVisible = true
      },
      openFormDialog() {
        this.$nextTick(_ => {
          // this.$refs.dialogForm.initialize()
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
      },
      handleUpdate(action) {
        if(this.dataListSelection.length <= 0) {
          this.$alert('请选择一行待修改的记录', '警告', { 
            confirmButtonText: '确认'
          })
          return
        }
        this.dataSelection = this.dataListSelection[0]
        this.dialogEditVisible = true
      },
      openEditDialog() {
        this.$nextTick(_ => {
          this.$refs.dialogEdit.initialize(this.dataSelection)
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
      handleDelete(action) {
        if(this.dataListSelection.length <= 0) {
          this.$alert('请选择待删除的记录', '警告', { 
            confirmButtonText: '确认'
          })
          return
        }
        this.$confirm('确认要删除吗？', '警告', {
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
      // handleDelete(row) {
      //   if(row) {
      //     this.$confirm('确认要删除当前记录吗？', '警告', {
      //       confirmButtonText: '确认',
      //       cancelButtonText: '取消', type: 'warning'
      //     }).then(() => {
      //       const params = { id: row.id }
      //       remove(this.module.name, params).then(response => {
      //         this.getList();
      //         this.$message({ type: 'success', message: '删除操作执行完成' });
      //       }).catch((error) => {})
      //     }).catch(() => {
      //       this.$message({ type: 'info', message: '删除已取消' });
      //     })
      //   }
      //   else {
      //     if(this.dataListSelection.length <= 0) {
      //       this.$alert('请选择待删除的记录', '警告', { 
      //         confirmButtonText: '确认'
      //       })
      //       return
      //     }
      //     this.$confirm('确认要删除吗？', '警告', {
      //       confirmButtonText: '确认',
      //       cancelButtonText: '取消', type: 'warning'
      //     }).then(() => {
      //       const params = { id: this.dataListSelection.map(d => d[this.module.pk]) }
      //       remove(this.module.name, params).then(response => {
      //         this.getList();
      //         this.$message({ type: 'success', message: '删除操作执行完成' });
      //       }).catch((error) => {})
      //     }).catch(() => {
      //       this.$message({ type: 'info', message: '删除已取消' });
      //     })
      //   }
      // },
      isAuditProp(ruleType) {
        return isAuditProp(ruleType)
      },
      isID(ruleType) {
        return isID(ruleType)
      },
      isHideInList(ruleType) {
        return isHideInList(ruleType)
      },
      handleSelectionChange(val) {
        this.dataListSelection = val;
      },
      handlePropertySort(column, prop, order) {
        let propData = column.column
        let orderBy = 
        this.moduleView.sortPropertyPath = propData.property
        this.moduleView.sortBy = propData.order == 'ascending' ? 'ASC' : 'DESC'
        // this.getList()
      },
      handleEntityShow(data) {
        var moduleName = this.$route.path.split('/')[1];
        this.$router.push({ path: '/' + moduleName + '/info', query: { id: data.id } });
      },
      handleEntityModify(moduleAction, data) {
        const id = data.id;
        // this.$router.push({ path: moduleAction.url, query: { id: id, actionId: moduleAction.id } });
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
      handleDialogDrag() {
        this.$refs.select.blur()
      },
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
.example-list-container .el-table .el-table-column--selection .cell {
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
  /*height:600px;*/
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
.el-table{
  width:99.9%; 
}
</style>