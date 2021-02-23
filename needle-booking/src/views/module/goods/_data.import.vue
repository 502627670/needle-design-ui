<template>
  <div class="example-import-dialog">
    <el-dialog :visible.sync="dialogImportVisible" width="86%"
      :close-on-click-modal="false" 
      :close-on-press-escape="false">
      <div slot="title">上传导入{{module.showName}}</div>

      <div style="text-align:center;">
        <el-upload ref="upload" 
          :key="uploadKey"
          :action="uploadAction"
          list-type="text"
          :on-success="successUpload"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :file-list="fileList"
          :with-credentials="true"
          :multiple="false" 
          :limit="100"
          :auto-upload="true">
          <el-button slot="trigger" type="primary">上传标准产品文件</el-button>
        </el-upload>
      </div>

      <el-table :data="tableData" v-loading="previewLoading"
        border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column prop="product.brandName" :label="'品牌'"/>
        <el-table-column prop="product.area" :label="'区域'"/>
        <el-table-column prop="product.productName" :label="'产品名称'"/>
        <el-table-column prop="product.productModel" :label="'型号'"/>
        <el-table-column prop="product.image" :label="'图片'"/>
        <el-table-column prop="product.productSize" :label="'尺寸'"/>
        <el-table-column prop="product.productDetail" :label="'产品描述'" width="200"/>
        <el-table-column prop="product.salePrice" :label="'销售单价'"/>
        <el-table-column prop="product.preSaleCost" :label="'预算成本'"/>
        <el-table-column prop="product.volume" :label="'体积'"/>
        <el-table-column prop="product.grossProfitRate" :label="'成品毛利率'"/>
        <el-table-column prop="product.situation" :label="'产品情况'"/>
        <el-table-column prop="productName" :label="'部件名'"/>
        <el-table-column prop="productSize" :label="'尺寸'"/>
        <el-table-column prop="volume" :label="'体积'"/>
        <el-table-column prop="supplier.simpleName" :label="'oem+'"/>
        <el-table-column prop="saleCostPrice" :label="'销售成本'"/>
        <el-table-column prop="purchaseCostPrice" :label="'采购成本单价'"/>
      </el-table>

      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="handleCreate" :loading="saveLoading" :disabled="tableData.length<=0">保存</el-button>
        <el-button type="danger" @click="handleReset">重置</el-button>
        <el-button @click="dialogImportVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import openWindow from '@/utils/open-window'
import { preview, saveImport, isImportProp, getBaseUri } from '@/api/example'

export default {
  name: 'ImportList',
  components: {  },
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

      uploadKey: 0,
      uploadAction: '',
      fileList: [],
    }
  },
  created() {
    this.uploadAction = this.getUploadUrl()
  },
  methods: {
    getUploadUrl() {
      let url = getBaseUri() + '/data/product/upload?'
      return url
    },
    handlePreview(file) {
      let url = file.url
      if(url) {
        openWindow(url, "图片预览", 600, 600)
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    successUpload(response, file, fileList) {
      let data = response.data
      this.tableData = data[0]
    },
    handleExceed(files, fileList) {
      this.$message({ type: 'success', message: '文件超过上传限制' });
    },
    handleRemove(file, fileList) {
      let params = {uri: ''}
    },


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
      this.fileList = []
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