<template>
  <div class="example-import-dialog">
    <el-dialog v-el-drag-dialog :visible.sync="dialogImportVisible" :close-on-click-modal="false" :close-on-press-escape="false" @dragDialog="handleDialogDrag">
      <div slot="title">{{ i18nName('module.import', 'import') + ' ' + module.name }}</div>

      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>

      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :prop="item" :label="item" :key="item"/>
      </el-table>

      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="default" @click="handleTemplate">{{i18nName('module.downloadTemplate', 'download template')}}</el-button>
        <el-button type="primary" @click="handleCreate" :loading="saving" :disabled="tableData.length<=0">{{i18nName('module.saveData', 'save data')}}</el-button>
        <el-button @click="dialogImportVisible = false">{{ i18nName('module.cancel', 'cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { previewImport, saveImport, getEntityPropertyValue } from '@/api/example'
import { i18nName } from '@/utils/i18n'

export default {
  name: 'DataImport',
  components: { UploadExcelComponent },
  directives: { elDragDialog },
  props: {
    module: {
      type: Object,
      default: false
    },
    moduleProperties: {
      type: Object,
      default: false
    },
    moduleViewPropertyArray: {   // {name, propertyPath, property}
      type: Array
    },
  },
  data() {
    return {
      dialogImportVisible: false,
      tableData: [],     // 显示的数据
      tableHeader: [],
      downloadLoading: false,

      dataList: [],      // 待提交保存的数据
      dataProp: [],

      saving: false,
    }
  },
  methods: {
    handleDialogDrag() {
        this.$refs.select.blur()
    },
    handleTemplate() {
      this.downloadLoading = true;
      const filename = this.module.label + '_template'
      const header = this.moduleViewPropertyArray.filter(viewProp => {
        return !this.moduleProperties[viewProp.propertyPath].auditProp
      }).map(viewProp => viewProp.property)
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
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      let keyNameModuleProperties = {}
      Object.keys(this.moduleProperties).forEach(propPath => {
        let moduleProperty = this.moduleProperties[propPath]
        // keyNameModuleProperties[moduleProperty.name] = moduleProperty
        keyNameModuleProperties[moduleProperty.property] = moduleProperty
      })
      
      header = header.filter(property => {
        const moduleProperty = keyNameModuleProperties[property]
        const isAuditProp = moduleProperty && moduleProperty.auditProp ? true : false
        return !isAuditProp
      })

      this.dataList = results
      this.dataProp = header

      const params = { props: header, data: results }
      previewImport(this.module, params).then(response => {
        this.tableHeader = header;
        this.tableData = this.formJsonData(response.data.content, response.data.refObjects, keyNameModuleProperties)
      })
      .catch((error) => { });
    },
    handleCreate() {
      const params = { props: this.dataProp, data: this.dataList }
      this.saving = true
      saveImport(this.module, params).then(response => {
        this.saving = false
        this.$message({ type: 'success', message: '数据已经保存完成！' })
      })
      .catch((error) => {
        this.saving = false;
      });
    },
    formJsonData(dataList, refObjectList, keyNameModuleProperties) {
      dataList.forEach((data, index) => {
        this.tableHeader.forEach(propName => {   // propertyName realy is property
          let moduleProperty = keyNameModuleProperties[propName]
          let value = getEntityPropertyValue(data, moduleProperty)
          
          if(value) {
            if(moduleProperty.select || moduleProperty.enum) {
              value = moduleProperty.valueMap[value] || value
              data[propName] = value
            }
            else if(moduleProperty.fk) {
              let fk = value
              if(moduleProperty.propertyType == moduleProperty.referenceType) {
                let refValue = data[moduleProperty.property]
                let pathArray = moduleProperty.referencePk.split('\.')
                for(let i = 0; i < pathArray.length && refValue; i++) {
                  let path = pathArray[i]
                  refValue = refValue[path]
                }
                fk = refValue || ''
                value += '【id=' + fk + '】'
              }
              else {
                let refEntityMap = refObjectList[index]
                let refName = ''
                if(refEntityMap) {
                  const refObject = refEntityMap[moduleProperty.property];
                  if(refObject) {
                    refName = refObject[moduleProperty.referenceProperty];
                  }
                }
                value = (refName||'') + '【id=' + fk + '】'
              }
              data[propName] = value
            }
            else {
              data[propName] = value
            }
          }
        })
      })
      return dataList;
    },
    i18nName
  }
}
</script>
<style lang="scss" scoped>
.example-import-dialog /deep/ .el-dialog {
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