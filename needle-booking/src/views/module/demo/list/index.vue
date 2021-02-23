<template>
  <div class="example-list-container">
    <div style="padding:15px 20px 5px 20px;">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="用户组">
          <el-cascader :props="props"></el-cascader>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input placeholder="用户组"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button type="primary">高级搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="example-list-filter" style="margin:6px 20px 0px 20px;border-top:3px solid #d2d6de; border-bottom:1px solid #d2d6de;">
      <div style="background:#fafafa;height:34px;line-height:32px;padding:0px 10px 0px 10px;">
        <el-row>
          <el-col :span="12">
            <div style="font-size:14px;font-weight:600;">
              <i class="fa fa-filter" aria-hidden="true" style="color:#888;"></i>
              View Filter Expression
            </div>
          </el-col>
          <el-col :span="12" style="text-align:right;margin-top:-1px;">
            <el-button size="mini" style="padding:3px 5px;" @click="addViewFilter" >{{ i18nName('module.add', 'add') }}</el-button>
            <el-button size="mini" style="padding:3px 5px;margin-left:5px;"
              :loading="executeViewFilterLoading" @click="handleUpdateViewFilter">{{ i18nName('module.save', 'Save') }}</el-button>
          </el-col>
        </el-row>
      </div>
      <div style="padding:0 10px;">
        
      </div>
    </div> -->
    <div class="example-list-body" style="margin:0px 20px;border-top:3px solid #d2d6de; border-bottom:1px solid #d2d6de;">
      <div class="box">
        <div class="left">
          <el-button type="default" @click="handleImport"><span>新建</span></el-button>
          <el-button type="default" @click="handleImport"><span>修改</span></el-button>
          <el-button type="default" @click="handleImport"><span>删除</span></el-button>
          <el-button type="default" key="importList" icon="el-icon-upload2" @click="handleImport"><span>导入</span>
          </el-button>
          <el-button type="default" key="exportList" icon="el-icon-download" @click="handleExport"><span>导出</span>
          </el-button>
        </div>
        <div class="right">
          <button type="button" class="el-button el-button--default el-button--small is-circle" @click="getList">
            <i class="el-icon-refresh"></i>
          </button>
          <button type="button" class="el-button el-button--default el-button--small is-circle" @click="dialogViewPropertyVisible = true">
            <i class="el-icon-menu"></i>
          </button>
        </div>
      </div>
      <section>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand" width="30">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商品名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="所属店铺">
                  <span>{{ props.row.shop }}</span>
                </el-form-item>
                <el-form-item label="商品 ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="店铺 ID">
                  <span>{{ props.row.shopId }}</span>
                </el-form-item>
                <el-form-item label="商品分类">
                  <span>{{ props.row.category }}</span>
                </el-form-item>
                <el-form-item label="店铺地址">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
                <el-form-item label="商品描述">
                  <span>{{ props.row.desc }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="38" style="padding:0px!important;"></el-table-column>
          <el-table-column label="操作" width="78">
            <template slot-scope="scope">
              <el-button type="default" icon="el-icon-document" size="mini" style="padding:4px;margin-right:4px;" title="详情"></el-button>
              <el-dropdown placement="bottom" trigger="click" :hide-on-click="false">
                <el-button type="default" icon="el-icon-arrow-right" style="padding:4px;" title="更多"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item >
                    <i class="el-icon-edit"></i>&nbsp;&nbsp;编辑
                  </el-dropdown-item>
                  <el-dropdown-item >
                    <i class="el-icon-edit"></i>&nbsp;&nbsp;角色
                  </el-dropdown-item>
                  <el-dropdown-item >
                    <i class="el-icon-edit"></i>&nbsp;&nbsp;删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column
            label="用户名"
            prop="id">
          </el-table-column>
          <el-table-column
            label="密码"
            prop="name">
          </el-table-column>
          <el-table-column label="用户组" prop="desc"></el-table-column>
        </el-table>
        <div class="crud-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageRequest.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageRequest.size" background
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageRequest.totalElements">
          </el-pagination>
        </div> 
      </section>
     
    </div>

    <!-- <createForm ref="dataFormView" :module="module" :moduleProperties="modulePropertiesArray" @refreshList="getList"></createForm> -->

    <!-- <el-dialog v-el-drag-dialog :visible.sync="dialogViewVisible" left :close-on-click-modal="false" @dragDialog="handleDialogDrag">
      <div slot="title">{{ i18nName(moduleViewForm.title) }}</div>
      <div style="margin-top:-25px;">
        <el-form :model="moduleViewForm" :rules="moduleViewFormRule" ref="moduleViewForm" style="padding-right:15px;padding-left:15px;text-align:left;">
          <input type="hidden" name="id" v-model="moduleViewForm.id" />
          <el-form-item v-if="moduleViewForm.showRename" prop="name" :label="i18nName('module.viewName', 'View Name')" label-width="auto">
            <el-input v-model="moduleViewForm.name"></el-input>
          </el-form-item>
          <el-form-item v-if="moduleViewForm.showShare">
            <div style="display:block;width:100%;"><label slot="label" style="text-align:left;font-weight:bold;">{{i18nName('module.whoCanSeeThisView')}}</label></div>
            <el-radio-group v-model="moduleViewForm.share" size="mini">
              <div style="line-height:28px;margin-top:5px;"><el-radio label="SHARE_PRIVATE" style="font-size:13px;">{{i18nName('module.onlyMeCanSeeThisView')}}</el-radio></div>
              <div style="line-height:28px;"><el-radio label="SHARE_PUBLIC" style="font-size:13px;">{{i18nName('module.allCanSeeThisView')}}</el-radio></div>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center;margin-top:20px;">
          <el-button type="primary" size="mini" @click="handleSaveOrUpdateView" :loading="saveViewLoading">{{i18nName('module.save')}}</el-button>
          <el-button @click="dialogViewVisible = false" size="mini">{{i18nName('module.cancel')}}</el-button>
        </div>
      </div>
    </el-dialog> -->

    <!-- <el-dialog v-el-drag-dialog :visible.sync="dialogViewPropertyVisible" left :close-on-click-modal="true" @dragDialog="handleDialogDrag">
      <div slot="title">{{i18nName('module.selectViewProperty', 'Select View Property')}}</div>
      <div style="margin-top:-25px;">
        <div style="padding:0px;margin:0px;">
          <div style="margin-top:0px;padding:20px 15px;border-top:1px solid #d2d6de;line-height:28px;">
            <el-checkbox-group v-model="viewSelectedPropertyArray">
              <el-checkbox v-for="(value, key) in moduleProperties" v-if="isListProperty(value)" :label="value.propertyPath" :key="'dialog_'+key" style="width:33%;">{{i18nName(value.name)}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div style="text-align:center;margin-top:0px;border-top:0px solid #d2d6de;border-top:1px solid #f2f2f2;padding:10px 10px 0px 10px;margin-bottom:-15px;">
            <el-button type="primary" @click="handleUpdateViewProperty" :disabled="!moduleView.id" :loading="executeViewPropertyLoading" size="mini">{{i18nName('module.save')}}</el-button>
            <el-button @click="dialogViewPropertyVisible = false" size="mini">{{i18nName('module.cancel')}}</el-button>
          </div>
        </div>
      </div>
    </el-dialog> -->
    
    <!-- <export-list ref="exportList" :module="module" :moduleProperties="moduleProperties" :dataList="dataList"
      :moduleViewPropertyArray="moduleViewPropertyArray" :dataListSelection="dataListSelection"></export-list>

    <import-list ref="importList" :module="module" :moduleProperties="moduleProperties" 
      :moduleViewPropertyArray="moduleViewPropertyArray"></import-list> -->
    
  </div>
</template>
<script>
  // import createForm from '../form/dialog'
  // import exportList from './_export'
  // import importList from './_import'
  import  { saveView, updateView, removeView, saveViewProperty, saveViewFilter, getDataList, getPropertyValue, remove, getEntityPropertyValue } 
    from '@/api/example'
  import elDragDialog from '@/directive/el-drag-dialog'
  import { Loading } from 'element-ui'
  import { i18nName } from '@/utils/i18n'
  import { messageFormat } from '@/utils/index'
  
  let id = 0;

  export default {
    components: { 
      // createForm, 
      // exportList, 
      // importList 
    },
    directives: { elDragDialog },
    data() {
      return {
        formInline: {},

        props: {
          lazy: true,
          lazyLoad (node, resolve) {
            const { level } = node;
            setTimeout(() => {
              const nodes = Array.from({ length: level + 1 }).map(item => ({
                  value: ++id,
                  label: `选项${id}`,
                  leaf: level >= 2
                }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            }, 200);
          }
        },
        

        tableData: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }],
        pageRequest: {}
      }
    },
    watch: {
      $route(to) {},
      viewSelectedPropertyArray(valArr) {
        const selectedPropertyArray = this.modulePropertyArray.filter(i => valArr.indexOf(i) >= 0);
        this.moduleViewPropertyArray = [];
        selectedPropertyArray.forEach(i => {
          if(this.moduleViewPropertyArray.indexOf(i) < 0) {
            let moduleProperty = this.moduleProperties[i]
            this.moduleViewPropertyArray.push({ name: moduleProperty.name, propertyPath: i, property: moduleProperty.property });
          }
        });
        this.dataListKey = this.dataListKey + 1
      },
    },
    created() {
      // this.getList();
    },
    methods: {
      getSelectLabel(data, moduleProperty) {
        let value = data[moduleProperty.propertyPath]
        if(value) {
          return moduleProperty.valueMap[value] || value
        }
        return value
      },
      handleViewChange(val) {
        var url = this.$route.path
        if(val) {
          url += '?id=' + val;
        }
        this.$router.push({ path: url});
      },
      handleSearchClick() {
        // this.$refs.searchButton.loading = true;
        this.pageRequest.page = 0;  
        this.getList();
      },
      handleCreateView() {
        this.dialogViewVisible = true;
        this.moduleViewForm = {id: '', name: '', share: "2" }
        this.moduleViewForm.title = this.i18nName('module.createView', 'Create View');
        this.moduleViewForm.share = 'SHARE_PUBLIC';
        this.moduleViewForm.showRename = true;
        this.moduleViewForm.showShare = true;
      },
      handleRenameView() {
        this.dialogViewVisible = true;
        this.moduleViewForm = Object.assign(this.moduleViewForm, this.moduleView);
        this.moduleViewForm.title = this.i18nName('module.renameView', 'Rename View');
        this.moduleViewForm.showRename = true;
        this.moduleViewForm.showShare = false;
      },
      handleShareView() {
        this.dialogViewVisible = true;
        this.moduleViewForm = Object.assign(this.moduleViewForm, this.moduleView);
        this.moduleViewForm.title = this.i18nName('module.shareView', 'Share View');
        this.moduleViewForm.showRename = false;
        this.moduleViewForm.showShare = true;
      },
      handleSaveOrUpdateView() {
        this.$refs['moduleViewForm'].validate((valid) => {
          if (valid) {
            if(this.moduleViewForm.id) {
              this.saveViewLoading = true;
              updateView(this.module, this.moduleViewForm).then(response => {
                this.$message({ type: 'success', message: this.i18nName('module.message.saveViewSuccess', 'Save View Data Success.') });
                const moduleView = response.data;
                Object.assign(this.moduleViews.find(value => value.id == moduleView.id) || {}, moduleView);
                this.saveViewLoading = false;
                this.dialogViewVisible = false;
              }).catch((error) => {
                this.saveViewLoading = false;
              });
            }
            else {
              this.saveViewLoading = true;
              saveView(this.module, this.moduleViewForm).then(response => {
                this.$message({ type: 'success', message: this.i18nName('module.message.saveViewSuccess', 'Save View Data Success.') });
                this.moduleViews.push(response.data);
                this.saveViewLoading = false;
                this.dialogViewVisible = false;
              }).catch((error) => {
                this.saveViewLoading = false;
              });
            }
            return true;
          } 
          this.$message({ type: 'warning', message: this.i18nName('module.message.checkViewInput', 'Please check view input field.') });
          return false;
        });
      },
      handleRemoveView() {
        this.$confirm(this.i18nName('module.message.removeView', 'Choose to remove current view, continue?'), this.i18nName('module.prompt', 'Prompt'), {
          confirmButtonText: this.i18nName('module.confirm', 'confirm'), cancelButtonText: this.i18nName('module.cancel', 'cancel'), type: 'warning'
        }).then(() => {
          const params = { id: this.moduleView.id };
          removeView(this.module, params).then(response => {
            this.moduleView = {};
            this.getList();
            this.$message({ type: 'success', message: this.i18nName('module.removeViewCompleted') });
            this.dialogViewVisible = false;
          });
        });
      },
      handleUpdateViewProperty() {
        const params = { viewId: this.moduleView.id, propertyPaths: this.viewSelectedPropertyArray };
        this.executeViewPropertyLoading = true;
        saveViewProperty(this.module, params).then(response => {
          this.executeViewPropertyLoading = false;
          this.$message({ type: 'info', message: this.i18nName('module.updateViewPropertyCompleted') });
          this.dialogViewPropertyVisible = false;
        }).catch((error) => {
          this.executeViewPropertyLoading = false;
        });
      },
      handleViewFilterPropertyChange(val) {
        val.value = '';
      },
      addViewFilter() {
        let properties = Object.keys(this.moduleProperties);
        properties = properties.filter(p => {
          return (this.moduleProperties[p].dataFeature & 4) == 4
        });
        if(properties.length > 0) {
          const propertyPath = properties[0];
          const moduleProperty = this.moduleProperties[propertyPath];
          const viewFilter = { id: null, propertyPath: moduleProperty.propertyPath, findType:'EQUAL', value: ''}
          this.moduleViewFilters.push(viewFilter);
        }
      },
      removeViewFilter(viewFilter) {
        const propertyPath = viewFilter.propertyPath;
        const index = this.moduleViewFilters.findIndex(vf => vf.propertyPath == propertyPath);
        if(index >= 0) {
          this.moduleViewFilters.splice(index, 1);
        }
      },
      handleUpdateViewFilter() {
        let propArray = [], typeArray = [], valueArray = [];
        this.moduleViewFilters.forEach(viewFilter => {
          propArray.push(viewFilter.propertyPath);
          typeArray.push(viewFilter.findType);
          valueArray.push(viewFilter.value || '');
        });
        
        const params = { viewId: this.moduleView.id, prop: propArray, type: typeArray, value: valueArray, boolFilter: this.moduleView.boolFilter };
        this.executeViewFilterLoading = true;
        saveViewFilter(this.module.name, params).then(response => {
          this.executeViewFilterLoading = false;
          this.$message({ type: 'info', message: this.i18nName('module.message.saveViewFilterExpCompleted') });
        }).catch((error) => {
          this.executeViewFilterLoading = false;
        });
      },
      isLikable(moduleProperty) {
        const dataType = moduleProperty.dataType;
        return dataType == 1 || dataType == 8;
      },
      handleDialogCreate(moduleAction) {
        const dataFormView = this.$refs.dataFormView;
        dataFormView.dialogFormVisible = true;
        dataFormView.moduleAction = moduleAction;
        dataFormView.getAction();
      },
      handleCreate(moduleAction) {
        // this.$router.push({ path: moduleAction.url, query: { actionId: moduleAction.id } });
      },
      handleModify(moduleAction) {
        if(this.dataListSelection.length <= 0) {
          this.$alert(this.i18nName('module.message.selectOneRowDataBeforeModify'), this.i18nName('module.warning'), { 
            confirmButtonText: this.i18nName('module.confirm') 
          });
        }
        else {
          const id = this.dataListSelection[0].id;
          // this.$router.push({ path: moduleAction.url, query: { id: id, actionId: moduleAction.id } });
        }
      },
      handleRemove(moduleAction) {
        if(this.dataListSelection.length <= 0) {
          this.$alert(this.i18nName('module.message.selectAtLeastOneRowData'), this.i18nName('module.warning'), { 
            confirmButtonText: this.i18nName('module.confirm') 
          });
        }
        else {
          this.$confirm(messageFormat(this.i18nName('module.message.continueExecuteSelectionAction'), [moduleAction.name]), 
            this.i18nName('module.warning'), {
            confirmButtonText: this.i18nName('module.confirm'),
            cancelButtonText: this.i18nName('module.cancel'),
            type: 'warning'
          }).then(() => {
            this.batchRemoving = true;
            const params = { actionId: moduleAction.id, ids: this.dataListSelection.map(d => d.id) }
            remove(this.module, params).then(response => {
              this.batchRemoving = false;
              // this.dataListSelection.forEach(item => this.dataList.splice(this.dataList.indexOf(item), 1));
              this.getList();
              this.$message({ type: 'success', message: this.i18nName('module.message.removeDataCompleted') });
            }).catch((error) => {
              this.batchRemoving = false;
            });
          }).catch(() => {
            // this.$message({ type: 'info', message: '已取消删除' });
          });
        }
      },
      handleImport() {
        this.$refs.importList.dialogImportVisible = true
      },
      handleExport() {
        this.$refs.exportList.dialogExportVisible = true
      },
      handlePrint() {
        // this.$print(this.$refs.print)
        // this.$print(this.$refs.print, {'no-print':'.el-table__expand-column'})
      },
      isListProperty(moduleProperty) {
        return (moduleProperty.inViewMask & 1) == 1;
      },
      getList() {
        this.listLoading = true
        this.moduleViews = [];
        this.modulePropertyArray = [];
        this.moduleViewPropertyArray = [];
        this.viewSelectedPropertyArray = [];
        this.dataListEntityActions = [];
        
        const id = this.moduleView.id || this.$route.query.id;
        this.moduleView.id = id;
        const params = Object.assign({page: this.pageRequest.page>0? this.pageRequest.page-1:0, size: this.pageRequest.size}, this.moduleView);
        const viewFilterPropertyPaths = [], viewFilterFindTypes = [], viewFilterValues = [];
        this.moduleViewFilters.forEach(viewFilter => {
          viewFilterPropertyPaths.push(viewFilter.propertyPath || '');
          viewFilterFindTypes.push(viewFilter.findType || 'EQUAL');
          viewFilterValues.push(viewFilter.value || '');
        });
        params['viewFilter.propertyPath'] = viewFilterPropertyPaths;
        params['viewFilter.findType'] = viewFilterFindTypes;
        params['viewFilter.value'] = viewFilterValues;
        this.module.label =  this.$route.path.split('/')[1];
        let currentTag = this.$store.getters.visitedViews.find(v => v.path == this.$route.path)
        this.module.serviceName = currentTag ? currentTag.serviceName : ''
        this.lastQueryParam = params
        getDataList(this.module, params).then(response => {
          if(!this.module.name || this.module.name != response.data.module.name) {
            this.module = response.data.module;
          }
          this.moduleView = response.data.moduleView;
          this.moduleViewFilters = response.data.moduleViewFilters || [];
          this.modulePropertiesArray = response.data.moduleProperties || [];
          this.moduleViews = response.data.moduleViews || [];
          this.moduleActions = response.data.moduleActions || [];
          (response.data.moduleProperties || []).forEach((v, i) => {
            this.moduleProperties[v.propertyPath] = v;
            if(this.isListProperty(v)) this.modulePropertyArray.push(v.propertyPath);
            if(v.required) this.requiredPropertySize++;
          });
          this.moduleActions.forEach(m => {
            if((m.actionMask & 4) == 4 || (m.actionMask & 8) == 8) this.dataListEntityActions.push(m);
          });
          (response.data.moduleViewProperties || []).forEach((v, i) => {
            this.moduleViewPropertyArray.push({ name: v.propertyName, propertyPath: v.propertyPath, property: v.property });
            if(this.isListProperty(this.moduleProperties[v.propertyPath])) {
              this.viewSelectedPropertyArray.push(v.propertyPath);
            }
          });
          this.dataRefList = response.data.refObjects;
          this.dataList = this.formJsonData(response.data.page.content);
          this.pageRequest.totalElements = response.data.page.totalElements;
          this.listLoading = false;
        }).catch(err => {
          this.listLoading = false;
          // this.$refs.searchButton.loading = false;
        })
      },
      formJsonData(dataList) {
        const propertyPaths = Object.keys(this.moduleProperties);
        dataList.forEach((data,index) => {
          propertyPaths.forEach(propPath => {
            let moduleProperty = this.moduleProperties[propPath]
            data[propPath] = this.getDataPropertyValue(index, data, moduleProperty)
          })
        })
        return dataList;
      },
      getDataPropertyValue(index, data, moduleProperty) {
        let refEntityMap = this.dataRefList[index];
        return getEntityPropertyValue(data, moduleProperty, refEntityMap);
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
      handleEntityRemove(moduleAction, data) {
        this.$confirm(messageFormat(this.i18nName('module.message.continueExecuteAction'), [moduleAction.name]), 
          this.i18nName('module.warning'), {
          confirmButtonText: this.i18nName('module.confirm'),
          cancelButtonText: this.i18nName('module.cancel'),
          type: 'warning'
        }).then(() => {
          const params = { actionId: moduleAction.id, ids: [ data.id ] }
          remove(this.module, params).then(response => {
            this.getList();
            this.$message({ type: 'success', message: this.i18nName('module.message.removeDataCompleted') });
          });
        });
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
      i18nName
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
</style>