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
              <el-breadcrumb-item>{{ i18nName('module.modify', 'modify') }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
        <el-col :span="12" style="height:36px"></el-col>
      </el-row>
    </div>

    <div  class="example-form-body" style="border-top:2px solid #d2d6de;padding:0px;margin:6px 20px 0px 20px;">
      <!-- <div style="text-align:center;border-top:3px solid #d2d6de;padding:1px 10px 2px 10px;background:#fafafa;">
        <el-row style="margin:0px;">
          <el-col :span="12" style="text-align:left;">
            <i class="el-icon-edit-outline"></i>
            <span style="font-size:14px;font-weight:bold;margin-left:5px;">编辑</span>
          </el-col>
          <el-col :span="12" style="text-align:right;font-size:12px;padding-top:4px;padding-right:20px;">
            <span style="color:#f56c6c;">*</span>为必填项
          </el-col>
        </el-row>
      </div> -->
      <div style="text-align:center;padding:0px 10px 0px 10px;background:#fafafa;line-height:38px;">
        <el-row style="margin:0px;">
          <el-col :span="12" style="text-align:left;">
            <i class="el-icon-edit-outline"></i>
            <span style="font-size:14px;font-weight:bold;margin-left:5px;">{{ i18nName('module.modify', 'modify') }}</span>
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
              <el-col v-for="moduleProperty in row.moduleProperties" v-if="!isReadOnly(moduleProperty) && !moduleProperty.auditProp" :key="moduleProperty.property" :xs="24" :sm="24 / row.columnSize">
                <FormText :ref="'formItem_'+ moduleProperty.property" v-if="moduleProperty.text" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]"></FormText>
                <FormEditor :ref="'formItem_'+ moduleProperty.property" v-else-if="moduleProperty.editor" :module="module" :moduleProperty="moduleProperty" v-model="dataForm[moduleProperty.property]"></FormEditor>
                <FormFile :ref="'formItem_'+ moduleProperty.property" v-else-if="moduleProperty.file" :module="module" :moduleProperty="moduleProperty" v-model="dataForm[moduleProperty.property]" />
                <FormFK :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.fk" :module="module" :moduleProperty="moduleProperty" :dataRow="dataRefs" v-model="dataForm[moduleProperty.fkPath]" />
                <FormDate :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.date" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                <FormDatetime :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.dateTime" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                <FormTime :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.time" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                <FormSelect :ref="'formItem_' + moduleProperty.property" v-else-if="moduleProperty.select || moduleProperty.enum" :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                <FormString :ref="'formItem_' + moduleProperty.property" v-else :moduleProperty="moduleProperty" :moduleActionProperties="moduleActionProperties" v-model="dataForm[moduleProperty.property]" />
                <!-- <button type="default" @click="showTextData(moduleProperty.propertyPath)">DDD</button> -->
              </el-col>
            </template>
            <!-- 
            <template v-for="row in firstRowGroup.rows">
              <el-col v-for="moduleProperty in row.moduleProperties" :xs="24" :sm="row.columnSize<=1?24:12">
                <el-form-item :label="moduleProperty.name+':'" :prop="moduleProperty.name" class="postInfo-container-item">
                  <el-input v-model="dataForm[moduleProperty.name]"></el-input>
                </el-form-item>
                <el-form-item :label="moduleProperty.name+':'" class="postInfo-container-item">
                  <div style="position:relative;">
                    <div style="margin-right:50px;">
                      <el-select v-model="dataForm[moduleProperty.property]" filterable remote placeholder="搜索用户" :remote-method="getRemoteUserList">
                        <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item"></el-option>
                      </el-select>
                    </div>
                    <div style="position:absolute;top:-1px;right:0px;">
                      <el-button type="default" icon="el-icon-search" @click="handleSearchRequest(1)"></el-button>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </template>
              -->
            <!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="作者:"  class="postInfo-container-item">
                <div style="position:relative;">
                  <div style="margin-right:50px;">
                    <el-select v-model="dataForm.author" filterable remote placeholder="搜索用户" :remote-method="getRemoteUserList">
                      <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item"></el-option>
                    </el-select>
                  </div>
                  <div style="position:absolute;top:-1px;right:0px;">
                    <el-button type="default" icon="el-icon-search" @click="handleSearchRequest(1)"></el-button>
                  </div>
                </div>
              </el-form-item> 
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="发布时间:" class="postInfo-container-item">
                <el-date-picker v-model="dataForm.display_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="重要性:" class="postInfo-container-item">
                <el-rate style="margin-top:8px;" v-model="dataForm.importance" :max='3' :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :low-threshold="1"
                  :high-threshold="3">
                </el-rate>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="名称" prop="name" class="postInfo-container-item">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="活动区域" prop="region" class="postInfo-container-item">
                <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="活动时间" required class="postInfo-container-item">
                <el-row style="margin:0px;">
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2" style="text-align:center;color:#ccc;">——</el-col>
                  <el-col :span="11">
                    <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="活动性质" prop="type" class="postInfo-container-item">
                <el-checkbox-group v-model="ruleForm.type" size="small">
                  <el-checkbox-button label="美食/餐厅线上活动" name="type" disabled></el-checkbox-button>
                  <el-checkbox-button label="地推活动" name="type"></el-checkbox-button>
                  <el-checkbox-button label="线下主题活动" name="type"></el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="特殊资源" prop="resource" class="postInfo-container-item">
                <el-radio-group v-model="ruleForm.resource" size="small">
                  <el-radio border label="线上品牌商赞助"></el-radio>
                  <el-radio border label="线下场地免费"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="多选" class="postInfo-container-item">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="复选框 A"></el-checkbox>
                  <el-checkbox label="复选框 B"></el-checkbox>
                  <el-checkbox label="复选框 C"></el-checkbox>
                  <el-checkbox label="禁用" disabled></el-checkbox>
                  <el-checkbox label="选中且禁用" disabled></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col> -->
          </el-row>

          <el-collapse v-model="activeGroupNames" @change="handleChange">
            <el-collapse-item :name="rowGroup.name" v-for="(rowGroup) in notFirstRowGroups" :key="rowGroup.name">
              <template slot="title">
                <div style="position:relative;">
                    <div>
                      <i class="el-icon-edit"></i>
                      <span style="font-weight:600;margin-left:5px;">{{ $t(rowGroup.name) }}</span>
                    </div>
                    <div style="position:absolute;right:30px;top:0px;"><span style="color:#f56c6c;font-weight:normal;">*</span>为必填项</div>
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

            <!-- 
            <el-collapse-item name="1">
              <template slot="title">
                <div style="position:relative;">
                    <div>
                      <i class="el-icon-edit"></i>
                      <span style="font-weight:600;margin-left:5px;">描述信息</span>
                    </div>
                    <div style="position:absolute;right:30px;top:0px;"><span style="color:#f56c6c;font-weight:normal;">*</span>为必填项</div>
                </div>
              </template>
              <div style="margin-top:20px;">
                <el-row :gutter="10">
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="摘要:" class="postInfo-container-item">
                      <el-input type="textarea" :rows="5" autosize placeholder="请输入内容" v-model="dataForm.content_short"></el-input>
                      <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template slot="title">
                <div style="position:relative;">
                    <div>
                      <i class="el-icon-edit"></i>
                      <span style="font-weight:600;margin-left:5px;">编辑器</span>
                    </div>
                    <div style="position:absolute;right:30px;top:0px;"><span style="color:#f56c6c;font-weight:normal;">*</span>为必填项</div>
                </div>
              </template>
              <div style="margin-top:20px;">
                <el-row :gutter="10">
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="摘要:" class="postInfo-container-item">
                      <div class="editor-container">
                        <Tinymce :height=200 ref="editor" v-model="dataForm.content" />
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
            -->
            <!-- <el-collapse-item name="3">
              <template slot="title">
                <div style="position:relative;">
                    <div>
                      <i class="el-icon-edit"></i>
                      <span style="font-weight:600;margin-left:5px;">文档资源</span>
                    </div>
                    <div style="position:absolute;right:30px;top:0px;"><span style="color:#f56c6c;font-weight:normal;">*</span>为必填项</div>
                </div>
              </template>
              <div style="margin-top:20px;">
                <el-row :gutter="10">
                  <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="图片" prop="imageUri" class="postInfo-container-item">
                      <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item> -->
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
import FormString from './_string'
import FormText from './_text'
import FormEditor from './_editor'
import FormFile from './_file'
import FormFK from './_fk'
import FormDate from './_date'
import FormDatetime from './_datetime'
import FormTime from './_time'
import FormSelect from './_select'

import { mapGetters } from "vuex";
import { getDataEdit, save, update } from '@/api/example'
import { parseTime, param2Obj } from '@/utils/index'
import { i18nName } from '@/utils/i18n'

export default {
  name: "froms",
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
  watch: {  },
  computed: {
    ...mapGetters(["permission"]),
  },
  created () { },
  
  mounted () { 
    this.getInfo();
  },
  methods: {
    formatDate(date) {
      return parseTime(new Date(date), '{y}-{m}-{d}');
    },
    formatDateTime(datetime) {
      return parseTime(new Date(datetime), '{y}-{m}-{d} {h}:{i}:{s}');
    },
    isReadOnly(moduleProperty) {
      return !this.moduleActionProperties[moduleProperty.propertyPath];
    },
    getInfo() {
      const params = { id: this.$route.query.id, actionId: this.$route.query.actionId }
      const moduleName = this.$route.path.split('/')[1];
      this.module.label = moduleName;
      getDataEdit(this.module, params).then(response => {
          this.module = response.data.module;
          this.moduleProperties = response.data.moduleProperties;
          this.moduleActions = response.data.moduleActions;
          this.moduleAction = response.data.moduleAction;
          this.moduleActionProperties = response.data.moduleActionProperties;
          const rowGroups = response.data.rowGroups || [];
          this.firstRowGroup = rowGroups.length > 0 ? rowGroups[0] : {};
          this.notFirstRowGroups = rowGroups.length > 1 ? rowGroups.slice(1, rowGroups.length) : []; 
          this.notFirstRowGroups.forEach(rowGroup => this.activeGroupNames.push(rowGroup.name));
          let data = response.data.entity;
          let refObjects = response.data.entityRefObjects;
          this.fileHttpServer = response.data.fileHttpServer;
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
        update(this.module, params).then(response => {
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
    handleChange(val) {
      console.log(val);
    },
    showTextData(property) {
      alert(property + ':' + this.dataForm[property])
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
