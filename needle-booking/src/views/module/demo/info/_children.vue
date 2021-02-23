<template>
  <div class="example-children-container">
   
    <div style="margin:15px 20px;border-top:3px solid #d2d6de;border-bottom:1px solid #d2d6de;">
      <div style="padding:4px 5px 4px 10px;text-align:left;background:#fafafa;font-size:13px;font-weight:600;">
        <el-row>
          <el-col :span="4" style="padding-top:5px;">{{moduleProperty.asChildrenName}}</el-col>
          <el-col :span="16" style="text-align:center;">
            <template v-for="moduleAction in childrenModuleActions" v-if="(moduleAction.inViewMask & 16) == 16">
              <el-button type="default" v-if="(moduleAction.actionMask&2)==2" :key="moduleAction.id" @click="handleDialogCreate(moduleAction)" size="mini">{{ moduleAction.name }}</el-button>
              <el-button type="default" v-else-if="(moduleAction.actionMask&4)==4" :key="moduleAction.id" @click="handleDialogUpdate(moduleAction)" size="mini">{{ moduleAction.name }}</el-button>
              <el-button type="default" v-else-if="(moduleAction.actionMask&8)==8" :key="moduleAction.id" @click="handleDialogRemove(moduleAction)" :loading="removing" size="mini">{{ moduleAction.name }}</el-button>
            </template>
          </el-col>
          <el-col :span="4" style="text-align:right;padding-right:10px;">
             <button type="button" class="el-button el-button--default el-button--mini is-circle" @click="getChildren">
              <i class="el-icon-refresh"></i>
            </button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="childrenDataList" v-loading="listLoading" stripe style="width: 100%" size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="30px"></el-table-column>
        <el-table-column v-for="moduleProperty in childrenModuleProperties" :key="'list_'+moduleProperty.id" :label="moduleProperty.name">
          <template slot-scope="scope">
            <span v-if="moduleProperty.enum || moduleProperty.select">
              {{ moduleProperty.valueMap[scope.row[moduleProperty.propertyPath]] || scope.row[moduleProperty.propertyPath] }}
            </span>
            <span v-else>{{ getDataPropertyValue(scope.$index, scope.row, moduleProperty) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top:5px;text-align:right;" small
        @current-change="handleCurrentChange"
        :current-page="pageRequest.page"
        :page-size="pageRequest.size" background
        layout="total, prev, pager, next"
        :total="pageRequest.totalElements">
      </el-pagination>
    </div>

    <childrenForm ref="childrenFormView" :parent="parent" :refModuleProperty="moduleProperty" 
      :module="childrenModule" :moduleProperties="childrenModuleProperties" @refreshList="getChildren"></childrenForm>
  </div>
</template>

<script>

import childrenForm from './_childrenForm';
import elDragDialog from '@/directive/el-dragDialog'

import { mapGetters } from "vuex";
import { getChildrenPage, getEntityPropertyValue, remove } from '@/api/example'
import { parseTime, formatTime, messageFormat } from '@/utils/index'
import { i18nName } from '@/utils/i18n'

export default {
  name: "froms",
  components: { childrenForm },
  directives: { elDragDialog },
  props: {
    parent: {
        type: Object
    },
    moduleProperty: {
      type: Object,
      default: false
    }
  },
  data () {
    return {
      listLoading: false,

      childrenModule: {},
      childrenDataList: [],
      childrenDataRefList: [],
      childrenModuleProperties: [],
      childrenModuleActions: [],

      childrenDataListSelection: [],
      pageRequest: { page: 0, size: 10, type: undefined, sort: '+id', totalElements: 0 },

      removing: false,
      childrenFormActiveDate: new Date().getTime(),
    };
  },
  created () {
    this.getChildren();
  },
  computed: {
    ...mapGetters(["permission"])
  },
  methods: {
    getParamForm() {
      let data = {};
      if(this.moduleProperty.referenceType == this.moduleProperty.propertyType) {
        data[this.moduleProperty.property] = this.parent;
      }
      else {
        data[this.moduleProperty.property] = this.parent[this.moduleProperty.referencePk];
      }
      return data;
    },
    getParamRefs() {
      let data = {};
      data[this.moduleProperty.property] = this.parent;
      return data;
    },
    handleDialogCreate(moduleAction) {
      const childrenFormView = this.$refs.childrenFormView;
      childrenFormView.moduleAction = moduleAction;
      childrenFormView.dialogFormVisible = true;
      childrenFormView.getAction(this.getParamForm(), this.getParamRefs());
    },
    handleDialogUpdate(moduleAction) {
      if(this.childrenDataListSelection.length <= 0) {
        this.$alert(this.i18nName('module.message.selectOneRowDataBeforeModify'), 
          this.i18nName('module.warning'), { confirmButtonText: this.i18nName('module.confirm') });
      }
      else {
        const childrenFormView = this.$refs.childrenFormView;
        const dataForm = this.childrenDataListSelection[0];
        const index = this.childrenDataList.indexOf(dataForm);
        const dataRefs = this.childrenDataRefList[index];
        childrenFormView.moduleAction = moduleAction;
        childrenFormView.dialogFormVisible = true;
        childrenFormView.getAction(dataForm, dataRefs);
      }
    },
    handleDialogRemove(moduleAction) {
      if(this.childrenDataListSelection.length <= 0) {
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
          this.removing = true;
          const moduleName = this.childrenModule.name;
          const params = { actionId: moduleAction.id, ids: this.childrenDataListSelection.map(d => d.id) }
          remove(this.childrenModule, params).then(response => {
            this.removing = false
            this.getChildren()
            this.$message({ type: 'success', message: this.i18nName('module.removeDataCompleted') })
          }).catch((error) => {
            this.removing = false
          });
        }).catch(() => {
          // this.$message({ type: 'info', message: '已取消删除' })
        })
      }
    },
    handleRefresh() {
      this.getChildren();
    },
    handleSelectionChange(val) {
      this.childrenDataListSelection = val;
    },
    getChildren() {
      this.listLoading = true;
      let pageNumber = this.pageRequest.page > 0 ? this.pageRequest.page-1 : 0;
      const params = { id: this.parent.id, childPropId: this.moduleProperty.id, page: pageNumber, size: this.pageRequest.size };
      const moduleName = this.$route.path.split('/')[1];
      this.childrenModule.label = moduleName;
      getChildrenPage(this.childrenModule, params).then(response => {
        this.childrenModule = response.data.module;
        this.childrenDataList = response.data.page.content;
        this.childrenDataRefList = response.data.refObjects;
        this.childrenModuleProperties = response.data.moduleProperties;
        this.childrenModuleActions = response.data.moduleActions;
        this.pageRequest.totalElements = response.data.page.totalElements;
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false;
      });
    },
    getDataPropertyValue(index, data, moduleProperty) {
      let refEntityMap = this.childrenDataRefList[index];
      return getEntityPropertyValue(data, moduleProperty, refEntityMap);
    },
    handleCurrentChange(val) {
      this.pageRequest.page = val;
      this.getChildren();
      console.log(`当前页: ${val}`);
    },
    i18nName
  }
};
</script>
<style lang="scss" scoped>
</style>
