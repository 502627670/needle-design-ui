<template>
  <div class="example-import-dialog">
    <el-dialog :visible.sync="dialogImportVisible" width="80%"
      :close-on-click-modal="false" 
      :close-on-press-escape="false">
      <div slot="title">上传导入{{module.showName}}</div>

      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>

      <el-table :data="tableData" v-loading="previewLoading"
        border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
      </el-table>

      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" plain @click="handleTemplate" :disabled="downloadLoading">下载模板</el-button>
        <el-button type="primary" @click="handleCreate" :loading="saveLoading" :disabled="tableData.length<=0">保存</el-button>
        <el-button type="danger" @click="handleReset">重置</el-button>
        <el-button @click="dialogImportVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import elDragDialog from '@/directive/el-dragDialog'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { preview, saveImport, isImportProp } from '@/api/example'

export default {
  name: 'ImportList',
  components: { UploadExcelComponent },
  // directives: { elDragDialog },
  props: {
    module: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      dialogImportVisible: false,
      tableData: [],     // 显示的数据
      tableHeader: [],
      downloadLoading: false,

      previewLoading: false,
      saveLoading: false,
    }
  },
  created() {
    
  },
  methods: {
    handleDialogDrag() {
      this.$refs.select.blur()
    },
    handleTemplate() {
      this.downloadLoading = true
      const filename = this.module.name + '_template'
      const header = this.module.props.filter(mp => isImportProp(mp.ruleType)).map(mp => mp.prop)
      import('@/vendor/Export2Excel').then(excel => {
          excel.export_json_to_excel({
              header: header,
              data: [],
              filename: filename,
              autoWidth: true,
              bookType: 'xlsx'
          })
          this.downloadLoading = false
      })
    },
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (isLt5M) {
        return true
      }
      this.$message({
        message: '上传文件大小不能超过5M，请修改后重新上传',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      if(!this.previewLoading) {
        let _props = JSON.stringify(header)
        let _data = JSON.stringify(results)
        this.previewLoading = true
        const params = { _props: _props, _data: _data }
        preview(this.module.name, params).then(response => {
          this.tableHeader = header.concat(['_check'])
          this.tableData = response.data
          setTimeout(() => { this.previewLoading = false }, 200)
        })
        .catch((error) => { this.previewLoading = false });
      }
    },
    handleCreate() {
      this.saveLoading = true
      let params = {_data : JSON.stringify(this.tableData)}
      saveImport(this.module.name, params).then(response => {
        this.saveLoading = false
        this.$message({ type: 'success', message: '数据已经保存完成！' })
        this.dialogImportVisible = false
        this.$emit('import')
        this.tableData = []
        this.tableHeader = []
        setTimeout(() => this.saveLoading = false, 200)
      }).catch((error) => { this.saveLoading = false })
    },
    handleReset() {
      this.tableData = []
      this.tableHeader = []
    },
  }
}
</script>
<style lang="scss" scoped>
.example-import-dialog >>> .el-dialog {
  display: flex;
  flex-direction: column;
  width: calc(100% - 30vh);
  max-height: calc(100% - 30vh);
  overflow: hidden;
  .el-dialog__header {
    border-bottom:1px solid #f2f2f2;
    padding: 20px 20px 20px;
  }
  .el-dialog__body {
    overflow:auto;
    .drop {
      border: 2px dashed #bbb;
      width: 500px;
      height: 60px;
      line-height: 55px;
      margin: 0 auto;
      font-size: 24px;
      border-radius: 5px;
      text-align: center;
      color: #bbb;
      position: relative;
      .el-button {
        vertical-align:3px;
      }
    }
  }
  .el-dialog__footer {
    border-top:1px solid #f2f2f2;
  }
}

</style>