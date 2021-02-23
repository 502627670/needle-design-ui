<template>
  <div class="example-form-dialog">
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" 
      width="60%" top="0"
      style="overflow:auto;margin-top:5%;margin-bottom:5%;">
      <div slot="title">{{ i18nName('module.quickCreate', 'quick create') + ' ' + module.name }}</div>

      <el-form ref="dataForm" v-model="dataForm" label-width="100px" style="padding-right:32px;">
        <el-row :gutter="5">
          <template v-for="moduleProperty in dialogModuleProperties">
            <el-col v-if="moduleProperty.required&& !isReadOnly(moduleProperty) &&!moduleProperty.auditProp &&(moduleProperty.inViewMask&2)==2" :xs="24" 
              :key="moduleProperty.id" :sm="(moduleProperty.editor || moduleProperty.file || moduleProperty.text)?24:12">
              <FormText :ref="'formItem_'+ moduleProperty.property" v-if="moduleProperty.text" :label-width="100" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]"></FormText>
              <FormEditor :ref="'formItem_'+ moduleProperty.property" v-else-if="moduleProperty.editor" :label-width="100" :module="module" :moduleProperty="moduleProperty" v-model="dataForm[moduleProperty.property]"></FormEditor>
              <FormFile :ref="'formItem_'+ moduleProperty.property" v-else-if="moduleProperty.file" :label-width="100" :module="module" :moduleProperty="moduleProperty" v-model="dataForm[moduleProperty.property]" />
              <FormFK :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.fk" :label-width="100" :module="module" :moduleProperty="moduleProperty" :dataRow="dataForm" v-model="dataForm[moduleProperty.fkPath]" />
              <FormDatetime :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.dateTime" :label-width="100" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
              <FormDate :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.date" :label-width="100" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
              <FormTime :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.time" :label-width="100" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
              <FormSelect :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.select || moduleProperty.enum" :label-width="100" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
              <FormString :ref="'formItem_' + moduleProperty.property" v-else :label-width="100" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
            </el-col>
          </template>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" :disabled="disabled" @click="executeUpdate">{{ i18nName('module.save', 'save') }}</el-button>
        <el-button @click="dialogFormVisible = false">{{ i18nName('module.cancel', 'cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>  
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage3'
  import FormString from '../edit/_string'
  import FormText from '../edit/_text'
  import FormEditor from '../edit/_editor'
  import FormFile from '../edit/_file'
  import FormFK from '../edit/_fk'
  import FormDate from '../edit/_date'
  import FormDatetime from '../edit/_datetime'
  import FormTime from '../edit/_time'
  import FormSelect from '../edit/_select'

  import { save, getFastForm } from '@/api/example'
  import { i18nName } from '@/utils/i18n'

  export default {
    name: 'FormDialog',
    components: { FormText, FormEditor, FormFile, FormString, FormFK, FormDate, FormDatetime, FormTime, FormSelect },
    props: {
      fileHttpServer: {
        type: String
      },
      module: {
        type: Object,
        default: false
      },
      moduleProperties: {
        type: Array,
        default: false
      },
    },
    data() {
      return {
        dialogFormVisible: false,
        
        dataForm: {},
        moduleAction: {},
        moduleActionProperties: {},
        
        dialogModuleProperties: this.moduleProperties,
        

        innerVisible: false,
        saving: false,
      }
    },
    computed: {
      disabled: function() {
        return this.dialogModuleProperties.length > 0 ? false : true
      }
    },
    methods: {
      isReadOnly(moduleProperty) {
        return !this.moduleActionProperties[moduleProperty.propertyPath];
      },
      validateForm() {
        let validChildren = true;
        for(let i = 0; i < this.moduleProperties.length; i++) {
          let refName = 'formItem_' + this.moduleProperties[i].property;
          let ref = this.$refs[refName];
          if(ref && ref[0].validateForm) {
            if(!ref[0].validateForm()) {
              validChildren = false;
            }
          }
        }
        return validChildren;
      },
      clearForm() {
        for(let i = 0; i < this.moduleProperties.length; i++) {
          let refName = 'formItem_' + this.moduleProperties[i].property;
          let ref = this.$refs[refName];
          if(ref && ref[0].validateForm) {
            ref[0].clearForm()
          }
        }
      },
      getAction() {
        const params = { actionId: this.moduleAction.id }
        getFastForm(this.module, params).then(response => {
          this.dataForm = response.data.entity
          this.moduleActionProperties = response.data.moduleActionProperties
          this.dialogModuleProperties = response.data.moduleProperties.filter(mp => {
            return mp.required&& !this.isReadOnly(mp) &&!mp.auditProp &&(mp.inViewMask&2)==2
          })
        });
      },
      executeUpdate() {
        const actionId = this.moduleAction.id;    // <==
        const validChildren = this.validateForm();
        if (validChildren) {
          this.saving = true;
          const moduleName = this.module.name;
          const params = Object.assign({actionId: actionId}, this.dataForm);
          save(this.module, params).then(response => {
            this.saving = false;
            this.$message({ type: 'success', message: this.i18nName('module.message.saveDataSuccess') });
            this.clearForm();
            this.dialogModuleProperties = []
            this.dialogFormVisible = false;
            this.$emit('refreshList');
          }).catch((error) => {
            this.saving = false;
          });
        } 
        else {
          this.$message({ type: 'warning', message: this.i18nName('module.message.checkInputProperty') });
          return false;
        }
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
// .el-row /deep/ .el-col {
  // height:52px;
// }
.example-form-dialog /deep/ .el-dialog__wrapper {
  overflow:hidden;
  height:100%;
}
.example-form-dialog /deep/ .el-dialog__header {
  border-bottom:1px solid #f2f2f2;
}
.example-form-dialog /deep/ .el-dialog__body {
  max-height:500px!important;
  overflow:auto;
}
.example-form-dialog /deep/ .el-dialog__footer {
  border-top:1px solid #f2f2f2;
}
</style>