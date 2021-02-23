<template>
  <div class="example-fk-search">
    <el-input placeholder="请输入" :key="'fk_key_' + moduleProp.showPath"
      :value="getContent()" readonly="readonly" @blur="handleBlur"
      style="height:32.8px!important;">
      <el-button slot="append" icon="el-icon-search" :disabled="readonly" 
        @click="handleSearchDialog">
      </el-button>
    </el-input>
    <!-- CHL:{{value + ':' + showContent + ':' + content}} -->
    <el-dialog :visible.sync="dialogSearchVisible" append-to-body :close-on-click-modal="false"
      class="fk-dialog" width="88%" :title="'查找'+refModule.showName">
      <div class="fk-dialog-search">
        <el-form :inline="true">
          <template v-for="(filterProp,index) in (filterProps || [])">
          <el-form-item :label="filterProp.name" label-width="88px" style="text-align:right;"  
            :key="'fk-filter-'+filterProp.prop + '_' + index">
            <FilterItem :filterProp="filterProp" 
              v-model="filterProp.value" @handleOp="function(op) {filterProp.op = op}">
            </FilterItem>
          </el-form-item>
          </template>
          <el-form-item :key="'home-search-btn'">
            <el-button type="primary" plain @click="handleSearch">查询</el-button>
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
                  <el-col v-for="prop in refModule.viewProps" :key="prop.prop + '_extend'" 
                    :xs="24" :sm="12">
                    <el-form-item :label="prop.name">
                      <div v-if="prop.feature==='IMAGE' && scope.row[prop.prop]">
                        <a href="#" @click="handlePreview(getFileUrl(scope.row[prop.prop]), prop.ruleType)">
                          <img :src="getFileUrl(scope.row[prop.prop], prop.ruleType)" class="max_20_20" />
                        </a>
                      </div>
                      <div v-else-if="prop.feature==='FILE' && scope.row[prop.prop]">
                        <i class="el-icon-document" />
                      </div>
                      <div v-else>{{ scope.row[prop.prop] }}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="38"></el-table-column>
          <template v-for="prop in refModule.viewProps">
            <el-table-column v-if="!isHideInList(prop.ruleType)" 
              :key="prop.prop + '_column'" 
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
                <i class="el-icon-document" />
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
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageRequest.size" background
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageRequest.total">
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSelectedResult">确认</el-button>
        <el-button type="danger" @click="getList">刷新</el-button>
        <el-button type="success" @click="dialogSearchVisible=false">取消</el-button>
      </span>
    </el-dialog>

  </div>  
</template>
<script>
import { mapGetters } from 'vuex'
import FilterItem from './_view.filter'
import openWindow from '@/utils/open-window'
import  { findList, isHideInList, columnMinWidth, isAbsoluteFile  } from '@/api/example'

export default {
  name: "FormFK",
  components: { FilterItem },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    readonly: {
      type: Boolean
    },
    value: {
      // type: String
    },
    showValue: {
      // type: String
    },
    moduleProp: {
      type: Object,
      default: {
        prop: '',
        refProp: '',
        showProp: '',
        refModuleName: '',
        showPath: '',
      }
    },
    defaultFilters: {
      type: Array,
    },
    refreshBeforeShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      content: this.showValue,
      filterProps: [],

      refProp: this.moduleProp.refProp,
      showProp: this.moduleProp.showProp,
      viewFilter: { prop: '', value: '' },

      refModule: {
        name: this.moduleProp.refModuleName,
        props: [],
        viewProps: [],
      },
      dataList: [],
      loading: false,
      dataListSelection: [],

      dialogSearchVisible: false,
      pageRequest: { page: 0, size: 10, sort: '+id', total: 0 },
    };
  },
  watch: {
    showValue: function(val) {
      if(val) 
        this.content = val
    }
  },
  computed: {
    ...mapGetters([ 'fileHttpServer' ]),
    showContent() {
      return this.content
    }
  },
  created() {
    if(Object.keys(this.moduleProp).length > 0) {
      this.getList()
    }
  },
  mounted() {
  },
  methods: {
    getContent() {
      if(!this.value) {
        this.content = ''
      }
      return this.showContent || this.value
    },
    handleBlur() {
      let value = this.getContent()
      if(!value || value.toString().trim() === '') {
        this.$emit('input', '')
      }
    },
    getViewFilters() {
      let viewFilters = []
      
      if(this.defaultFilters) {
        this.defaultFilters.forEach(filter => {
          viewFilters.push(filter)
        })
      }
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
    setModuleProp(mp) {
      this.refProp = mp.refProp
      this.showProp = mp.showProp
      this.moduleProp.refProp = mp.refProp
      this.moduleProp.showProp = mp.showProp
      this.refModule.name = mp.refModuleName
    },
    handleSearch() {
      this.pageRequest.page = 0;
      this.getList();
    },
    handleSearchDialog() {
      this.dialogSearchVisible = true;
      this.pageRequest.page = 0;
      if(this.refreshBeforeShow) {
        this.handleSearch()
      }
    },
    getList() {
      if(!this.loading) {
        this.loading = true
        let params = { _vf: JSON.stringify(this.getViewFilters()) }
        params._page = this.pageRequest.page ? this.pageRequest.page - 1 : 0
        params._size = this.pageRequest.size || 10
        findList(this.refModule.name, params).then(response => {
          let data = response.data
          this.dataList = data.content
          this.refModule = response.module
          this.pageRequest = Object.assign(data.pageable, 
            {total:data.totalElements, page:data.number+1, size: data.size})
          if(this.filterProps.length === 0) {
            this.filterProps = this.refModule.filterProps
          }
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

      // alert(this.dataListSelection.length)
      this.dataListSelection.forEach(row => {
        refPropContent += row[this.refProp] + ','
        showPropContent += row[this.showProp] + ','
      })
      if(refPropContent.endsWith(',')) {
        refPropContent = refPropContent.substring(0, refPropContent.length - 1)
        showPropContent = showPropContent.substring(0, showPropContent.length - 1)
      }
      this.dialogSearchVisible = false
      this.$emit('input', refPropContent)
      this.content = showPropContent
      
      let data = this.dataListSelection.length > 0 ? this.dataListSelection[0] : {}
      let mappings = this.moduleProp.mappings || {}
      this.$emit('handleBack', mappings, data)

      this.getList()
    },
    handleSizeChange(val) {
      this.pageRequest.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageRequest.page = val;
      this.getList();
    },
    getFileUrl(uri, ruleType) {
      if(uri) {
        if(isAbsoluteFile(ruleType)) {
          return uri
        }
        
        let server = this.fileHttpServer + ''
        if(server.endsWith('/')) {
          server = server.substring(0, server.length - 1)
        }
        return server + uri
      }
      return "#"
    },
    handlePreview(url, ruleType) {
      if(url) openWindow(url, "图片预览", 600, 600)
    },
    isHideInList(ruleType) {
      return isHideInList(ruleType)
    },
    columnMinWidth,
    isAbsoluteFile
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
.fk-dialog ::-webkit-scrollbar {
  width : 10px;
  height: 10px;
}
.fk-dialog ::-webkit-scrollbar-thumb {
  border-radius   : 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent);
}
.fk-dialog ::-webkit-scrollbar-track {
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : #ededed;
  border-radius: 10px;
}

.fk-dialog .el-dialog .el-dialog__footer {
  text-align: center;
}
.fk-dialog-search .el-form-item {
  margin-bottom:10px;
}
.fk-dialog-content .el-table .el-table-column--selection .cell {
  padding:0px 10px!important;
} 
.max_20_20 {
  max-width: 20px;
  max-height: 20px;
  vertical-align: middle;
}
</style>
