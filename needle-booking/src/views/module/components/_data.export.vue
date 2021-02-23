<template>
  <div class="example-export-dialog">
    <el-dialog :visible.sync="dialogExportVisible" 
      :close-on-click-modal="false" 
      :close-on-press-escape="false">
      <div slot="title">导出{{module.showName}}</div>
      <el-form ref="exportPanel" label-width="120px">
        <el-form-item label="文件名">
            <el-input v-model="filename" prefix-icon="el-icon-document"/>
        </el-form-item>
        <el-form-item label="文件类型">
            <el-select v-model="bookType">
                <el-option label="xlsx" value="xlsx" />
                <el-option label="csv" value="csv" />
                <el-option label="txt" value="txt" />
            </el-select>
        </el-form-item>
        <el-form-item label="自动列宽">
            <el-radio-group v-model="autoWidth">
              <el-radio :label="true" border>是</el-radio>
              <el-radio :label="false" border>否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="导出范围">
            <el-radio-group v-model="dataRange">
              <el-radio label="PAGE" border>当前查询页</el-radio>
              <el-radio label="SELECT" border>当前选中行</el-radio>
            </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="handleExport" :loading="downloadLoading">导出</el-button>
        <el-button @click="dialogExportVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { parseTime } from '@/utils/index'
  
  export default {
    name: 'DataExport',
    components: { },
    props: {
      module: {
        type: Object,
        default: {}
      },
      selectedPropArray: {
        type: Array
      },
      dataList: {
        type: Array,
        required: true,
      },
      dataListSelection: {
        type: Array,
      }
    },
    data() {
      return {
        dialogExportVisible: false,
        autoWidth: true,
        bookType: 'xlsx',
        dataRange: 'PAGE',
        downloadLoading: false,
      }
    },
    computed: {
      filename: function() {
        return this.module.name + '_' + parseTime(new Date(), '{y}{m}{d}{h}{i}{s}')
      } 
    },
    methods: {
      handleExport() {
        this.downloadLoading = true
        const header = this.selectedPropArray
        let data = this.dataList
        if(this.dataRange == 'SELECT') {
            data = this.dataListSelection
        }
        data = this.formatJson(header, data)
        import('@/vendor/Export2Excel').then(excel => {
            excel.export_json_to_excel({
                header: header,
                data: data,
                filename: this.filename,
                autoWidth: this.autoWidth,
                bookType: this.bookType
            })
            this.downloadLoading = false
            this.dialogExportVisible = false
        }).catch(() => { this.downloadLoading = false })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
<style lang="scss" scoped>
.el-form >>> .el-form-item__label {
  font-weight: 550;
  text-align: right;
  overflow:hidden; 
  white-space:nowrap; 
  text-overflow:ellipsis
}
</style>