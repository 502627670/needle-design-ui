<template>
  <div class="example-fk-search">
    <el-input placeholder="请输入" v-model="content" @blur="handleBlur">
      <el-button slot="append" icon="el-icon-search" @click="handleSearchDialog"></el-button>
    </el-input>
    <el-dialog :visible.sync="dialogSearchVisible" class="fk-dialog" width="80%" :title="'查找'">
      <div class="fk-dialog-search">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="用户名">
            <el-input placeholder="用户组"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>  
      <div class="fk-dialog-content" style="border-top:3px solid #d2d6de; border-bottom:1px solid #d2d6de;">
        <el-table v-loading="loading" ref="refModuleTable"
          :data="dataList" 
          highlight-current-row
          @selection-change="handleSelectionChange"
          @current-change="handleCurrentRowChange"
          style="width: 100%">
          <el-table-column type="expand" width="30">
            <template slot-scope="scope">
              <el-form ref="ruleForm" label-width="150px">
                <el-row :gutter="0">
                  <el-col v-for="prop in refModule.viewProps" :key="prop.prop + '_extend'" :xs="24" :sm="12">
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
          <el-table-column v-for="prop in refModule.viewProps" :key="prop.prop + '_column'" 
            :label="prop.name" :prop="prop.prop">
            <template slot-scope="scope">
            {{ scope.row[prop.prop] }}
            </template>
          </el-table-column>
        </el-table>
        <div class="crud-pagination">
          <el-pagination
            :current-page="pageRequest.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageRequest.size" background
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageRequest.totalElements">
          </el-pagination>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSelectedResult">确认</el-button>
        <el-button type="danger">刷新</el-button>
        <el-button type="success" @click="dialogSearchVisible=false">取消</el-button>
      </span>
    </el-dialog>

  </div>  
</template>
<script>
import  { findList } from '@/api/example'

export default {
  name: "FormFK",
  components: {},
  model: {
    prop: 'value',
    event: 'inputPK'
  },
  props: {
    module: {
      type: Object
    },
    moduleProp: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      content: '',
      
      formInline: {},

      moduleName: 'user',
      prop: 'group',
      refModuleName: 'group',
      refProp: 'id',
      showProp: 'name',
      viewFilter: { prop: '', value: '' },

      refModule: {
        pk: 'id',
        name: 'group',
        props: [],
        viewProps: [],
      },
      dataList: [],
      pageRequest: {},
      loading: false,
      dataListSelection: [],

      dialogSearchVisible: false,
      pageRequest: { page: 0, size: 10, type: undefined, sort: '+id', totalElements: 0 },
    };
  },
  watch: {
    // filterPropId: function() {
    //   const mp = this.refmodulePropIdMap[this.filterPropId] || {};
    //   this.filterPropertyArray[0] = mp;
    //   this.filterPropValue = '';
    // }
  },
  computed: {
    // valueKeyMap: function() {
    //   let valueKeyMap = {};
    //   if(this.filterPropId && this.refmodulePropIdMap[this.filterPropId]) {
    //     const moduleProp = this.refmodulePropIdMap[this.filterPropId];
    //     valueKeyMap = moduleProp.valueMap || {}
    //   }
    //   return valueKeyMap;
    // }
  },
  created() {
    this.getList()
  },
  methods: {
    handleBlur() {
      if(!this.content) {
        this.$emit('inputPK', '')
      }
    },
    handleSearchDialog() {
      this.dialogSearchVisible = true;
      this.pageRequest.page = 0;
    },
    getList() {
      let query = {}
      if(!this.loading) {
        this.loading = true
        findList(this.refModule.name, query).then(response => {
          this.dataList = response.data.content
          this.refModule = response.module
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    handleSelectionChange(val) {
      this.dataListSelection = val
    },
    handleCurrentRowChange(row) {
      this.dataListSelection.forEach(row => {
        this.$refs.refModuleTable.toggleRowSelection(row, false)
      })
      this.dataListSelection.splice(0, this.dataListSelection.length)
      this.dataListSelection.push(row)
      this.$refs.refModuleTable.toggleRowSelection(row, true)
    },
    handleSelectedResult() {
      let refPropContent = ''
      let showPropContent = ''
      this.dataListSelection.forEach(row => {
        refPropContent += row[this.refProp] + ','
        showPropContent += row[this.showProp] + ','
      })
      if(refPropContent.endsWith(',')) {
        refPropContent = refPropContent.substring(0, refPropContent.length - 1)
        showPropContent = showPropContent.substring(0, showPropContent.length - 1)
      }
      this.content = showPropContent
      this.dialogSearchVisible = false;
      this.$emit('inputPK', refPropContent)
    },
    handleSizeChange(val) {
      this.pageRequest.size = val;
      this.getReferenceList();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageRequest.page = val;
      this.getReferenceList();
      console.log(`当前页: ${val}`);
    },
    clearForm() {
      this.content = '';
    }
  }
};
</script>
<style lang="scss" scoped>
.crud-pagination {
  margin-top:4px;
  padding:2px 10px;
  text-align:right;
}
</style>
<style>
.fk-dialog .el-dialog .el-dialog__footer {
  text-align: center;
}
.fk-dialog-search .el-form-item {
  margin-bottom:10px;
}
.fk-dialog-content .el-table .el-table-column--selection .cell {
  padding:0px 10px!important;
}
</style>
