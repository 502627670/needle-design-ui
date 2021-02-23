<template>
<div class="example-list-body" style="border-top:3px solid #d2d6de; border-bottom:1px solid #d2d6de;">
  <div class="box">
    <div class="left">
      <h3 style="margin:0px;padding-top:5px;">{{ module.showName }}</h3>
    </div>
    <div class="right">
      <button type="button" @click="getChildrenData(data)"
        class="el-button el-button--default el-button--small is-circle" >
        <i class="el-icon-refresh"></i>
      </button>
      <button type="button" class="el-button el-button--default el-button--small is-circle" @click="dialogViewPropertyVisible = true">
        <i class="el-icon-menu"></i>
      </button>
    </div>
  </div>
    <el-table v-loading="loading" :data="dataList" 
      @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="expand" width="30">
        <template slot-scope="scope">
          <el-form ref="ruleForm" label-width="150px" style="max-width:1200px;">
            <el-row :gutter="0">
              <template v-for="prop in module.viewProps">
              <el-col v-if="!isHideInInfo(prop.ruleType)" :key="prop.prop + '_extend'" 
                :xs="24" :sm="isShowInRow(prop)?24:12">
                <el-form-item :label="prop.name">
                  <div v-if="prop.feature==='IMAGE' && scope.row[prop.prop]">
                    <a href="#" @click="handlePreview(getFileUrl(scope.row[prop.prop]))">
                      <img :src="getFileUrl(scope.row[prop.prop])" class="max_20_20" />
                    </a>
                  </div>
                  <div v-else-if="prop.feature==='FILE' && scope.row[prop.prop]">
                    <a :href="getFileUrl(scope.row[prop.prop])" target="_blank">
                      <i class="el-icon-document" />
                    </a>
                  </div>
                  <div v-else>{{ scope.row[prop.prop] }}</div>
                </el-form-item>
              </el-col>
              </template>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="38"></el-table-column>
      <template v-for="prop in module.viewProps">
        <el-table-column v-if="!isHideInList(prop.ruleType)" 
          :key="prop.prop + '_c_column'" 
          :label="prop.name" 
          :prop="prop.prop"
          :min-width="columnMinWidth(prop.maxLength)"
          sortable>
          <template slot-scope="scope">
          <div v-if="prop.feature==='IMAGE' && scope.row[prop.prop]">
            <a href="#" @click="handlePreview(getFileUrl(scope.row[prop.prop]))">
              <img :src="getFileUrl(scope.row[prop.prop])" class="max_20_20" />
            </a>
          </div>
          <div v-else-if="prop.feature==='FILE' && scope.row[prop.prop]">
            <a :href="getFileUrl(scope.row[prop.prop])" target="_blank">
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
        :current-page="pageRequest.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageRequest.size" background
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageRequest.total">
      </el-pagination>
    </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import openWindow from '@/utils/open-window'
import  { findList, isHideInList, isHideInInfo, columnMinWidth, isShowInRow } from '@/api/example'
export default {
  name: "Children",
  components: { 

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
      data: {},
      dataList: [],
      pageRequest: {page:0, size:10, totalElements:0},
      loading: false,
      dataListSelection: [],
    };
  },
  created () {},
  computed: {
    ...mapGetters([ 'fileHttpServer' ]),
  },
  methods: {
    getChildrenData(data) {
      if(!this.loading) {
        this.loading = true
        this.data = data ? data : this.data
        let params = {...this.data}
        params._page = this.pageRequest.page ? this.pageRequest.page - 1 : 0
        params._size = this.pageRequest.size || 10
        findList(this.module.name, params).then(response => {
          let data = response.data
          this.dataList = data.content
          this.pageRequest = Object.assign(data.pageable, 
            {total:data.totalElements, page:data.number+1, size:data.size})
          Object.assign(this.module, response.module)
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
    getDataListSelection() {
      return this.dataListSelection
    },
    getFileUrl(uri) {
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
    isShowInRow
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
  }
  .right {
    width: 400px;
    text-align:right;
  }
  .el-form-item { margin-bottom: 10px; }
  .crud-pagination {
    margin-top:4px;
    padding:2px 10px;
    text-align:right;
  }
}
</style>