<template>
  <div class="example-export-dialog">
    <el-dialog v-el-drag-dialog :visible.sync="dialogExportVisible" :close-on-click-modal="false" :close-on-press-escape="false" @dragDialog="handleDialogDrag">
      <div slot="title">{{ i18nName('module.export', 'export') + module.name }}</div>
      <el-form ref="exportPanel" label-width="120px">
        <el-form-item :label="i18nName('module.filename', 'Filename')">
            <el-input v-model="filename" prefix-icon="el-icon-document"/>
        </el-form-item>
        <el-form-item :label="i18nName('module.bookType', 'Book Type')">
            <el-select v-model="bookType">
                <el-option label="xlsx" value="xlsx" />
                <el-option label="csv" value="csv" />
                <el-option label="txt" value="txt" />
            </el-select>
        </el-form-item>
        <el-form-item :label="i18nName('module.cellAutoWidth', 'Cell Auto-Width')">
            <el-radio-group v-model="autoWidth">
                <el-radio :label="true" border>{{ i18nName('module.true', 'True') }}</el-radio>
                <el-radio :label="false" border>{{ i18nName('module.false', 'False') }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item :label="i18nName('module.exportRange', 'Export Range')">
            <el-radio-group v-model="dataRange">
                <el-radio label="PAGE" border>{{ i18nName('module.currentPage', 'Current Page') }}</el-radio>
                <el-radio label="SELECT" border>{{ i18nName('module.selectedRow', 'Selected Row') }}</el-radio>
            </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="handleExport" :loading="downloadLoading">{{$t('excel.export')}}</el-button>
        <el-button @click="dialogExportVisible = false">{{$t('table.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog'
  import { parseTime } from '@/utils/index'
  import { i18nName } from '@/utils/i18n'

  export default {
    name: 'DataExport',
    components: { },
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
      moduleViewPropertyArray: {
        type: Array
      },
      dataListSelection: {
        type: Array,
      },
      dataList: {
        type: Array,
        required: true,
      },
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
        return this.module.label + '_' + parseTime(new Date(), '{y}{m}{d}{h}{i}{s}')
      } 
    },
    methods: {
      handleDialogDrag() {
          this.$refs.select.blur()
      },
      handleExport() {
        this.downloadLoading = true
        const header = this.moduleViewPropertyArray.map(viewProp => viewProp.property);
        const filterProp = this.moduleViewPropertyArray.map(viewProp => viewProp.propertyPath);
        let data = this.dataList
        if(this.dataRange == 'SELECT') {
            data = this.dataListSelection
        }
        data = this.formatJson(filterProp, data)
        import('@/vendor/Export2Excel').then(excel => {
            excel.export_json_to_excel({
                header: header,
                data: data,
                filename: this.filename,
                autoWidth: this.autoWidth,
                bookType: this.bookType
            })
            this.downloadLoading = false
        })
      },
      formatJson(filterProp, jsonData) {
        return jsonData.map(v => filterProp.map(j => {
          let moduleProperty = this.moduleProperties[j]
          if(moduleProperty.select || moduleProperty.enum) {
            return moduleProperty.valueMap[v[j]] || v[j]
          }  
          return v[j];
        }))
      },
      showTextData(property) {
        alert(JSON.stringify(this.dataForm))
        alert(property + ':' + this.dataForm[property])
      },
      i18nName
    }
  }
</script>
<style lang="scss" scoped>
.el-form /deep/ .el-form-item__label {
  font-weight: 550;
  text-align: right;
  overflow:hidden; 
  white-space:nowrap; 
  text-overflow:ellipsis
}
</style>