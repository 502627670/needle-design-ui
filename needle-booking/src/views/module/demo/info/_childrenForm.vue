<template>
  <div class="example-form-dialog">
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false"
      width="60%" top="0" style="overflow:auto;margin-top:5%;margin-bottom:5%;">
      <div slot="title">{{ (dataForm.id? i18nName('module.modify') : i18nName('module.create')) + ' ' + module.name }}</div>

      <el-form ref="childrenForm" v-model="dataForm" label-width="100px" style="padding-right:32px;" :key="childrenFormActiveDate">
        <el-row :gutter="5">
          <template v-for="moduleProperty in dialogModuleProperties">
            <el-col v-if="isActionProperty(moduleProperty) &&!moduleProperty.auditProp &&(moduleProperty.inViewMask&16)==16" :xs="24" 
              :key="moduleProperty.id" :sm="(moduleProperty.editor || moduleProperty.file || moduleProperty.text)?24:12">
              <FormText :ref="'formItem_'+ moduleProperty.property" v-if="moduleProperty.text" :label-width="100" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]"></FormText>
              <FormEditor :ref="'formItem_'+ moduleProperty.property" v-else-if="moduleProperty.editor" :label-width="100" :moduleProperty="moduleProperty" v-model="dataForm[moduleProperty.property]"></FormEditor>
              <FormFile :ref="'formItem_'+ moduleProperty.property" v-else-if="moduleProperty.file" :label-width="100" :module="module" :moduleProperty="moduleProperty" v-model="dataForm[moduleProperty.property]" />
              <FormFK :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.fk" :label-width="100" :module="module" :moduleProperty="moduleProperty" :dataRow="dataRefs" v-model="dataForm[moduleProperty.fkPath]" />
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
        <el-button type="primary" @click="executeUpdate" :loading="saving">{{i18nName('module.save')}}</el-button>
        <el-button @click="dialogFormVisible = false">{{i18nName('module.cancel')}}</el-button>
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

  import { save, update, getFastForm } from '@/api/example'
  import { i18nName } from '@/utils/i18n'

  export default {
    name: 'FormDialog',
    components: { Tinymce, Upload, FormText, FormEditor, FormFile, FormString, FormFK, FormDate, FormDatetime, FormTime, FormSelect },
    props: {
      parent: { type: Object },
      refModuleProperty: { type: Object },
      module: {
        type: Object,
        default: false
      },
      moduleProperties: {
        type: Array,
        default: false
      },
      fileHttpServer: {
        type: String
      },
    },
    data() {
      return {
        dialogFormVisible: false,
        paramForm: {},
        paramRefs: {},
        moduleAction: {},
        childrenFormActiveDate : new Date().getTime(),
        saving: false,  

        moduleActionProperties: {},
        dialogModuleProperties: this.moduleProperties,
      }
    },
    computed: {
      dataForm: function() {
        const data = this.paramForm;
        return data;
      },
      dataRefs: function() {
        const data = Object.assign({}, this.paramForm, this.paramRefs);
        return data;
      },
    },
    methods: {
      isActionProperty(moduleProperty) {
        return this.moduleActionProperties[moduleProperty.propertyPath];
      },
      getAction(paramForm, paramRefs) {
        const params = { actionId: this.moduleAction.id };
        getFastForm(this.module, params).then(response => {
          this.dialogModuleProperties = response.data.moduleProperties;
          this.moduleActionProperties = response.data.moduleActionProperties;
          this.paramForm = paramForm;
          this.paramRefs = paramRefs;
          this.childrenFormActiveDate = new Date().getTime();
        });
      },
      validateForm() {
        let validChildren = true;
        for(let i = 0; i < this.moduleProperties.length; i++) {
          let refName = 'formItem_' + this.moduleProperties[i].property;
          let ref = this.$refs[refName];
          if(ref && ref[0].validateForm) {
            if(!ref[0].validateForm()) {
              validChildren = false;
              break;
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
      executeUpdate() {
        const actionId = this.moduleAction.id;    // <==
        const validChildren = this.validateForm();
        if (validChildren) {
          this.saving = true;
          const moduleName = this.module.name;
          const params = Object.assign({actionId: actionId}, this.dataForm);
          if(this.dataForm.id) {
            update(this.module, params).then(response => {
              this.saving = false;
              this.$message({ type: 'success', message: '数据已经保存成功！' });
              this.dataForm = {};
              this.$emit('refreshList');
              this.dialogFormVisible = false;
              this.clearForm();
            }).catch((error) => {
              this.saving = false;
            });
          }
          else {
            save(this.module, params).then(response => {
              this.saving = false;
              this.$message({ type: 'success', message: '数据已经保存成功！' });
              this.dataForm = {};
              this.$emit('refreshList');
              this.dialogFormVisible = false;
              this.clearForm();
            }).catch((error) => {
              this.saving = false;
            });
          }
        } 
        else {
          this.$message({ type: 'warning', message: '请检查输入字段！' });
          return false;
        }
      },
      i18nName,
      showTextData(property) {
        alert(JSON.stringify(this.dataForm))
        alert(property + ':' + this.dataForm[property])
      }
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
.example-form-dialog /deep/ .el-dialog__wrapper {
  overflow:hidden;
  height:100%;
}
.example-form-dialog /deep/ .el-dialog__header {
  border-bottom:1px solid #f2f2f2;
}
.example-form-dialog /deep/ .el-dialog__body {
  max-height:600px!important;
  overflow:auto;
}
.example-form-dialog /deep/ .el-dialog__footer {
  border-top:1px solid #f2f2f2;
}
</style>