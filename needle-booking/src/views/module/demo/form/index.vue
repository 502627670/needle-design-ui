<template>
  <div class="example-form-container">
    <div style="margin:10px 20px 0px 20px;">
      <el-row>
        <el-col :span="12" style="height:36px;">
          <div style="position:relative;">
            <div style="position:absolute;left:0px;top:9px;">
              <i class="fa fa-list-ul" aria-hidden="true"></i>
            </div>
            <el-breadcrumb separator="/" style="margin-left:28px;height:36px;line-height:36px;">
              <el-breadcrumb-item :to="{ path: module.url }">{{ module.name }}</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: module.url }">{{ i18nName('module.home', 'Home') }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{ i18nName('module.create', 'create') }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
        <el-col :span="12" style="height:36px"></el-col>
      </el-row>
    </div>
    <div  class="example-form-body" style="border-top:2px solid #d2d6de;padding:0px;margin:6px 20px 0px 20px;">
      <div style="text-align:center;padding:0px 10px 0px 10px;background:#fafafa;line-height:38px;">
        <el-row style="margin:0px;">
          <el-col :span="12" style="text-align:left;">
            <i class="el-icon-edit-outline"></i>
            <span style="font-size:14px;font-weight:bold;margin-left:5px;">{{ i18nName('module.create', 'create') }}</span>
          </el-col>
          <el-col :span="12" style="text-align:right;font-size:12px;padding-right:20px;">
            <span style="color:#f56c6c;">*</span>{{ i18nName('module.isRequired', 'is required') }}
          </el-col>
        </el-row>
      </div>
      <div style="text-align:center;margin-top:10px;">
        <el-button type="primary" @click="executeUpdate()" :loading="saving" v-show="showActions" size="mini">{{ i18nName('module.save', 'save') }}</el-button>
        <el-button size="mini" v-show="showActions" @click="$router.back(-1)">{{ i18nName('module.back', 'back') }}</el-button>
      </div>

      <div style="padding:0px;margin-top:20px;">
        <el-form ref="dataForm" :model="dataForm" label-width="160px" size="mini">
          <input type="hidden" v-model="dataForm.id" />
          <el-row :gutter="10">
            <template v-for="row in firstRowGroup.rows">
              <el-col v-for="moduleProperty in row.moduleProperties" v-if="!isReadOnly(moduleProperty) && !moduleProperty.auditProp" 
                :key="moduleProperty.id" :xs="24" :sm="24 / row.columnSize">
                <FormText :ref="'formItem_'+ moduleProperty.property" v-if="moduleProperty.text" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]"></FormText>
                <FormEditor :ref="'formItem_'+ moduleProperty.property" v-else-if="moduleProperty.editor" :module="module" :moduleProperty="moduleProperty" v-model="dataForm[moduleProperty.property]"></FormEditor>
                <FormFile :ref="'formItem_'+ moduleProperty.property" v-else-if="moduleProperty.file" :module="module" :moduleProperty="moduleProperty" :fileHttpServer="fileHttpServer" v-model="dataForm[moduleProperty.property]" />
                <FormFK :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.fk" :module="module" :moduleProperty="moduleProperty" :dataRow="dataRefs" v-model="dataForm[moduleProperty.fkPath]" />
                <FormDate :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.date" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                <FormDatetime :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.dateTime" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                <FormTime :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.time" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                <FormSelect :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.select || moduleProperty.enum" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                <FormString :ref="'formItem_' + moduleProperty.property" v-else :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]"/>
              </el-col>
            </template>
          </el-row>
          <el-collapse v-model="activeGroupNames">
            <el-collapse-item :name="rowGroup.name" v-for="(rowGroup,index) in notFirstRowGroups" :key="'g_'+index">
              <template slot="title">
                <div style="position:relative;">
                    <div>
                      <i class="el-icon-edit"></i>
                      <span style="font-weight:600;margin-left:5px;">{{ $t(rowGroup.name) }}</span>
                    </div>
                    <div style="position:absolute;right:30px;top:0px;"><span style="color:#f56c6c;font-weight:normal;">*</span>{{i18nName('module.isRequired')}}</div>
                </div>
              </template>
              <div style="margin-top:20px;">
                <el-row :gutter="10">
                  <template v-for="row in rowGroup.rows">
                    <el-col v-for="moduleProperty in row.moduleProperties" v-if="!isReadOnly(moduleProperty) && !moduleProperty.auditProp" :key="moduleProperty.id" :xs="24" :sm="24 / row.columnSize">
                      <FormText :ref="'formItem_'+ moduleProperty.property" v-if="moduleProperty.text" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]"></FormText>
                      <FormEditor :ref="'formItem_'+ moduleProperty.property" v-else-if="moduleProperty.editor" :module="module" :moduleProperty="moduleProperty" v-model="dataForm[moduleProperty.property]"></FormEditor>
                      <FormFile :ref="'formItem_'+ moduleProperty.property" v-else-if="moduleProperty.file" :module="module" :moduleProperty="moduleProperty" :fileHttpServer="fileHttpServer" v-model="dataForm[moduleProperty.property]" />
                      <FormFK :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.fk" :module="module" :moduleProperty="moduleProperty" :dataRow="dataRefs" v-model="dataForm[moduleProperty.fkPath]" />
                      <FormDate :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.date" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                      <FormDatetime :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.dateTime" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                      <FormTime :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.time" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                      <FormSelect :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.select || moduleProperty.enum" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                      <FormString :ref="'formItem_' + moduleProperty.property" v-else :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]"/>
                    </el-col>
                  </template>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div style="text-align:center;margin-top:10px;margin-bottom:10px;">
            <el-button type="primary" @click="executeUpdate()" :loading="saving" v-show="showActions" size="mini">{{ i18nName('module.save', 'save') }}</el-button>
            <el-button size="mini" v-show="showActions" @click="$router.back(-1)">{{ i18nName('module.back', 'back') }}</el-button>
          </div>
        </el-form>
      </div>
    </div>
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

import { mapGetters } from "vuex";
import { getDataInfo, save, update, getDataForm } from '@/api/example'
import { i18nName } from '@/utils/i18n'
import { param2Obj } from '@/utils/index'

export default {
  name: "Form",
  components: { Tinymce, Upload, FormText, FormEditor, FormFile, FormString, FormFK, FormDate, FormDatetime, FormTime, FormSelect },
  data () {
    return {
      showActions: false,
      dataForm: {},
      dataRefs: {},

      module: {id:1, name: 'example', url: '/example'},
      moduleProperties: [],
      moduleActions: [],
      moduleAction: {},
      moduleActionProperties: {},

      activeGroupNames: [],
      firstRowGroup: {},
      notFirstRowGroups: [],
      
      saving: false,
      saveAndCreating: false,
      fileHttpServer: '',
    };
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  created () {
    this.getInfo();
  },
  
  methods: {
    isReadOnly(moduleProperty) {
      return !this.moduleActionProperties[moduleProperty.propertyPath];
    },
    getInfo() {
      const params = { actionId: this.$route.query.actionId }
      const moduleName = this.$route.path.split('/')[1];
      this.module.label = moduleName;
      getDataForm(this.module, params).then(response => {
          this.module = response.data.module;
          this.moduleProperties = response.data.moduleProperties;
          this.moduleActions = response.data.moduleActions;
          this.moduleAction = response.data.moduleAction;
          this.moduleActionProperties = response.data.moduleActionProperties;
          const rowGroups = response.data.rowGroups || [];
          this.firstRowGroup = rowGroups.length > 0 ? rowGroups[0] : {};
          this.notFirstRowGroups = rowGroups.length > 1 ? rowGroups.slice(1, rowGroups.length) : []; 
          this.notFirstRowGroups.forEach(rowGroup => this.activeGroupNames.push(rowGroup.name));
          this.fileHttpServer = response.data.fileHttpServer;
          let data = response.data.entity || {};
          this.moduleProperties.forEach(mp => {
            let value = data[mp.property];
            if(value) {
              if(!mp.fk) {
                this.dataForm[mp.property] = value;
                this.dataRefs[mp.property] = value;
              } 
              else {
                if(mp.propertyType != mp.referenceType) {
                  this.dataForm[mp.property] = value;
                  this.dataRefs[mp.property] = refObjects[mp.property];
                }
                else {
                  this.dataForm[mp.property + '.' + mp.referencePk] = value[mp.referencePk];
                  let refObject = {};
                  refObject[mp.referencePk] = value[mp.referencePk]
                  refObject[mp.referenceProperty] = value[mp.referenceProperty];
                  this.dataRefs[mp.property] = refObject;
                }
              }
            }
          });
          this.showActions = true;
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
          }
        }
      }
      return validChildren;
    },
    executeUpdate() {
      const validChildren = this.validateForm();
      if (validChildren) {
        this.saving = true;
        const moduleName = this.module.name;
        const params = Object.assign({actionId: this.$route.query.actionId}, this.dataForm);
        
        save(this.module, params).then(response => {
          this.saving = false;
          this.$message({ type: 'success', message: this.i18nName('module.message.saveDataSuccess') });
          const redirectUrl = this.moduleAction.redirectUrl;
          if(redirectUrl) {
            let data = response.data
            let paramObject = param2Obj(redirectUrl)
            for (let prop in paramObject) {
              paramObject[prop] = data[prop]
            }
            this.$router.push({ path: redirectUrl, query: paramObject })
            // this.$router.push({ path: redirectUrl + "?id=" + response.data.id })
          }
        }).catch((error) => {
          this.saving = false;
        });
      } 
      else {
        this.$message({ type: 'warning', message: this.i18nName('module.message.checkInputProperty') });
        return false;
      }
    },
    executeUpdateAndCreate() {
      const validChildren = this.validateForm();
      if (validChildren) {
        this.saveAndCreating = true;
        const moduleName = this.module.name;
        const params = Object.assign({actionId: this.$route.query.actionId}, this.dataForm);
        save(this.module, params).then(response => {
          this.saveAndCreating = false;
          this.$message({ type: 'success', message: this.i18nName('module.message.saveDataSuccess') });
        }).catch((error) => {
          this.saveAndCreating = false;
        });
      } 
      else {
        this.$message({ type: 'warning', message: this.i18nName('module.message.checkInputProperty') });
        return false;
      }
    },
    i18nName
  }
};
</script>
<style lang="scss" scoped>
.from-container {
  padding: 8px 10px;
}
.example-form-body /deep/ .el-card__body {
  padding:0px!important;
}
.example-form-body /deep/ .el-collapse {
  border-top: 0px!important;
}
.example-form-body /deep/ .el-collapse-item__header {
  border-top:1px solid #efefef;
}
.example-form-body /deep/ .el-collapse-item {
  margin-bottom:1px;
}
.example-form-body .el-form /deep/ .el-form-item {
  padding:0px;
  padding-right:25px;
  margin-bottom:20px;
}
.example-form-body /deep/ .el-collapse-item__content {
  padding-bottom:0px;
}
.example-form-body /deep/ .el-form-item__label {
  font-weight: 600;
}
.postInfo-container-item {
  margin-right:20px;
}

.example-form-body .el-collapse /deep/ .el-collapse-item__header {
  height:30px;
  line-height:30px;
  background:#fafafa;
  padding-left:10px;
}
.example-form-body .el-collapse /deep/ .el-collapse-item__arrow {
  height:30px;
  line-height:30px;
}
.example-form-body .el-collapse /deep/ .el-collapse-item__wrap:last-child {
    border-bottom: 0px;
}
.example-form-body .el-checkbox {
    margin-left: 0px!important;
    margin-right:30px;
}

.example-form-body .el-form /deep/ .el-input__inner {
  height:32px!important;
  line-height:32px!important;
}
.example-form-body .el-form /deep/ .el-form-item__label {
  line-height: 32px;
}
.example-form-body .el-form /deep/ .el-input__icon {
  line-height:32px;
}
.example-form-body .el-form /deep/ .el-form-item__content {
  line-height: 32px;
}
.example-form-body .el-form /deep/ .el-textarea__inner {
  height:auto!important;
}
// .el-row /deep/ .el-col {
//   height:52px;
// }
.margin-bottom-0 {
  margin-bottom:0px!important;
}

.editor-container {
  min-height: 36px;
  margin: 0px 0px;
  .editor-upload-btn-container {
    text-align: right;
    margin-right: 10px;
    .editor-upload-btn {
      display: inline-block;
    }
  }
}
</style>
