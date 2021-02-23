<template>
  <div class="example-info-container">
   
    <div class="example-info-header" style="margin:10px 20px 0px 20px;">
      <el-row>
        <el-col :span="12" style="height:36px;">
          <div style="position:relative;">
            <div style="position:absolute;left:0px;top:9px;">
              <i class="fa fa-list-ul" aria-hidden="true"></i>
            </div>
            <el-breadcrumb separator="/" style="margin-left:28px;height:36px;line-height:36px;">
              <el-breadcrumb-item :to="{ path: module.url }">{{ module.name }}</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: module.url }">{{ i18nName('module.home', 'Home') }}</el-breadcrumb-item>
              <el-breadcrumb-item>{{ i18nName('module.info', 'info') }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
        <el-col :span="12" style="height:36px;line-height:34px;">
          <div style="text-align:right;height:100%;">
            <el-radio-group size="mini">
              <el-radio-button type="default" v-for="(childProperty, index) in childrenProperties" v-if="index<=5" :key="childProperty.id"
                :label="childProperty.module.name" @click.native="scrollToTarget('.children-' + index)"></el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <div  class="example-info-body" style="border-top:3px solid #d2d6de;padding:0px;margin:6px 20px 0 20px;">
      <div style="padding:4px 5px 5px 10px;text-align:left;background:#fafafa;font-size:14px;font-weight:600;">
        <el-row>
          <el-col :span="4" :sm="4">
            <div style="padding-top:5px;">
              <i class="el-icon-tickets" />
              <span style="margin-left:5px;">{{ i18nName('module.detail', 'detail') }}</span>
            </div>
          </el-col>
          <el-col :span="16" :sm="16" style="text-align:center;margin-left:-2px;">
            <template v-for="moduleAction in moduleActions" v-if="(moduleAction.inViewMask & 8) == 8">
              <el-button type="default" v-if="(moduleAction.actionMask&2)==2" :key="moduleAction.id" @click="handleCreate(moduleAction)" size="mini">{{ moduleAction.name }}</el-button>
              <el-button type="default" v-else-if="(moduleAction.actionMask&4)==4" :key="moduleAction.id" @click="handleModify(moduleAction)" size="mini">{{ moduleAction.name }}</el-button>
              <el-button type="default" v-else-if="(moduleAction.actionMask&8)==8" :key="moduleAction.id" @click="handleRemove(moduleAction)" :loading="removing" size="mini">{{ moduleAction.name }}</el-button>
            </template>
            <el-button size="mini" @click="$router.back(-1)">{{ i18nName('module.back', 'back') }}</el-button>
          </el-col>
          <el-col :span="4" :sm="4">&nbsp;</el-col>
        </el-row>
      </div>
      <!-- <div style="text-align:center;margin-top:10px;">
        <template v-for="moduleAction in moduleActions" v-if="(moduleAction.inViewMask & 8) == 8">
          <el-button type="primary" v-if="(moduleAction.actionMask&2)==2" @click="handleCreate(moduleAction)" size="mini">{{ moduleAction.name }}</el-button>
          <el-button type="primary" v-else-if="(moduleAction.actionMask&4)==4" @click="handleModify(moduleAction)" size="mini">{{ moduleAction.name }}</el-button>
          <el-button type="primary" v-else-if="(moduleAction.actionMask&8)==8" @click="handleRemove(moduleAction)" :loading="removing" size="mini">{{ moduleAction.name }}</el-button>
        </template>
        <el-button size="mini" @click="$router.back(-1)">取消</el-button>
      </div> -->
      <div style="margin-top:15px;">
        <el-form ref="ruleForm" label-width="160px" size="mini" style="padding-bottom:15px;">
          <el-row :gutter="0">
            <template v-for="row in firstRowGroup.rows">
              <el-col v-for="moduleProperty in row.moduleProperties"  :key="moduleProperty.id" :xs="24" :sm="24 / row.columnSize">
                <template v-if="!moduleProperty.auditProp">
                  <el-form-item v-if="moduleProperty.select || moduleProperty.enum" :label="moduleProperty.name+':'">
                    <div>{{ getSelectLabel(moduleProperty) }}</div>
                  </el-form-item>
                  <el-form-item v-else-if="moduleProperty.editor" :label="moduleProperty.name+':'">
                    <div v-html="getDataPropertyValue(moduleProperty)" style="cursor:pointer"
                      @click.native="handleEditorDetail(getDataPropertyValue(moduleProperty))"></div>
                  </el-form-item>
                  <el-form-item v-else-if="moduleProperty.file" :label="moduleProperty.name+':'">
                    <img :src="getDataPropertyValue(moduleProperty)" />
                  </el-form-item>
                  <el-form-item v-else-if="moduleProperty.fk" :label="moduleProperty.name+':'">
                    <label>{{ getDataPropertyValue(moduleProperty) }}</label>
                  </el-form-item>
                  <el-form-item v-else :label="moduleProperty.name+':'">
                    <label>{{ getDataPropertyValue(moduleProperty) }}</label>
                  </el-form-item>
                </template>
              </el-col>
            </template>
          </el-row>
        </el-form>
        <el-collapse v-model="activeGroupNames">
          <el-collapse-item :name="rowGroup.name" v-for="(rowGroup,index) in notFirstRowGroups" :key="'rowGroup_' + index">
            <template slot="title">
              <i class="el-icon-info"></i>
              <span style="margin-left:5px;">{{ $t(rowGroup.name) }}</span>
            </template>
            <el-form label-width="160px" size="mini" style="margin-top:15px;">
              <el-row>
                <template v-for="row in rowGroup.rows">
                  <el-col v-for="moduleProperty in row.moduleProperties" :key="moduleProperty.id" :xs="24" :sm="24 / row.columnSize">
                    <template v-if="!moduleProperty.auditProp">
                      <el-form-item v-if="moduleProperty.select || moduleProperty.enum" :label="moduleProperty.name+':'">
                        <div>{{ getSelectLabel(moduleProperty) }}</div>
                      </el-form-item>
                      <el-form-item v-else-if="moduleProperty.editor" :label="moduleProperty.name+':'">
                        <div v-html="getDataPropertyValue(moduleProperty)" style="cursor:pointer"
                          @click="handleEditorDetail(getDataPropertyValue(moduleProperty))"></div>
                      </el-form-item>
                      <el-form-item v-else-if="moduleProperty.file" :label="moduleProperty.name+':'">
                        <img v-if="dataInfo.entity[moduleProperty.propertyPath]" :src="fileHttpServer + getDataPropertyValue(moduleProperty)" />
                      </el-form-item>
                      <el-form-item v-else-if="moduleProperty.fk" :label="moduleProperty.name+':'">
                        <label>{{ getDataPropertyValue(moduleProperty) }}</label>
                      </el-form-item>
                      <el-form-item v-else :label="moduleProperty.name+':'">
                        <label>{{ getDataPropertyValue(moduleProperty) }}</label>
                      </el-form-item>
                    </template>
                  </el-col>
                </template>
              </el-row>
            </el-form>  
          </el-collapse-item>
          <el-collapse-item :name="groupSystemInfo" v-if="createdByProperty || lastModifiedByProperty">
            <template slot="title">
              <i class="el-icon-info"></i>
              <span style="margin-left:5px;">{{ i18nName('module.group.system') }}</span>
            </template>
            <el-form ref="ruleForm" label-width="160px" size="mini" style="margin-top:15px;">
              <el-row>
                <el-col v-if="createdByProperty" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item :label="i18nName('module.group.firstCreatedBy')">
                    {{ dataInfo.entity[createdByProperty.property] }} , 
                    {{ formatDateTime(dataInfo.entity[createdDateProperty.property]) }}
                  </el-form-item>
                </el-col>
                <el-col v-if="lastModifiedByProperty" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item :label="i18nName('module.group.lastModifiedBy')">
                    {{ dataInfo.entity[lastModifiedByProperty.property] }} , 
                    {{ formatDateTime(dataInfo.entity[lastModifiedDateProperty.property]) }}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>  
          </el-collapse-item>
        </el-collapse>
      </div>
      <div style="text-align:center;padding:3px 5px 6px 10px;text-align:center;">
        <template v-for="moduleAction in moduleActions" v-if="(moduleAction.inViewMask & 8) == 8">
          <el-button type="default" v-if="(moduleAction.actionMask&2)==2" :key="moduleAction.id" @click="handleCreate(moduleAction)" size="mini">{{ moduleAction.name }}</el-button>
          <el-button type="default" v-else-if="(moduleAction.actionMask&4)==4" :key="moduleAction.id" @click="handleModify(moduleAction)" size="mini">{{ moduleAction.name }}</el-button>
          <el-button type="default" v-else-if="(moduleAction.actionMask&8)==8" :key="moduleAction.id" @click="handleRemove(moduleAction)" :loading="removing" size="mini">{{ moduleAction.name }}</el-button>
        </template>
        <el-button size="mini" @click="$router.back(-1)">{{ i18nName('module.back', 'back') }}</el-button> 
      </div>
    </div>
    <div v-for="(childProperty, index) in childrenProperties" :key="'child_'+childProperty.id">
      <children :parent="dataInfo.entity" :class="'children-' + index" :moduleProperty="childProperty"></children>
    </div>
  </div>
</template>

<script>
import children from './_children';
import { mapGetters } from "vuex";
import { getDataInfo, getChildrenPage, getPropertyValue, remove, getEntityPropertyValue } from '@/api/example'
import { parseTime, formatTime, messageFormat } from '@/utils/index'
import { i18nName } from '@/utils/i18n'

export default {
  name: "froms",
  components: { children },
  data () {
    return {
      module: {id:1, name: 'example', url: '/example'},
      moduleAction: {},
      moduleProperties: [],
      moduleActions: [],
      dataInfo: {},
      firstRowGroup: {},
      notFirstRowGroups: [],
      activeGroupNames: [],
      groupSystemInfo: new Date().getTime(),
      createdByProperty: null,
      createdDateProperty: null,
      lastModifiedByProperty: null,
      lastModifiedDateProperty: null,
      childrenProperties: [],
      removing: false,

      fileHttpServer: '',
    };
  },
  created () {
    this.getInfo();
  },
  computed: {
    ...mapGetters(["permission"])
  },
  props: [],
  methods: {
    getSelectLabel(moduleProperty) {
      const value = this.dataInfo.entity[moduleProperty.propertyPath]
      let label = moduleProperty.valueMap[value] || value
      return label
    },
    getDataPropertyValue(moduleProperty) {
      return getEntityPropertyValue(this.dataInfo.entity, moduleProperty, this.dataInfo.entityRefObjects);
    },
    formatDateTime(datetime) {
      return parseTime(new Date(datetime), '{y}-{m}-{d} {h}:{i}:{s}');
    },
    getInfo() {
      const params = { id: this.$route.query.id }
      const moduleName = this.$route.path.split('/')[1];
      this.activeGroupNames = [this.groupSystemInfo];
      this.module.label = moduleName;
      getDataInfo(this.module, params).then(response => {
          if(!this.module.name || this.module.name != response.data.module) {
            this.module = response.data.module;
          }
          this.fileHttpServer = response.data.fileHttpServer;
          this.moduleProperties = response.data.moduleProperties;
          this.moduleActions = response.data.moduleActions;
          this.childrenProperties = response.data.childrenProperties;
          this.dataInfo = response.data;
          const rowGroups = response.data.rowGroups || [];
          this.firstRowGroup = rowGroups.length > 0 ? rowGroups[0] : {};
          this.notFirstRowGroups = rowGroups.length > 1 ? rowGroups.slice(1, rowGroups.length) : []; 
          this.notFirstRowGroups.forEach(rowGroup => this.activeGroupNames.push(rowGroup.name));
          this.moduleProperties.forEach(mp => {
            if(mp.auditPropertyMask == 2) this.createdByProperty = mp;
            if(mp.auditPropertyMask == 3) this.createdDateProperty = mp;
            if(mp.auditPropertyMask == 4) this.lastModifiedByProperty = mp;
            if(mp.auditPropertyMask == 5) this.lastModifiedDateProperty = mp;
          });
        });
    },
    showEditView(moduleAction) {
      let actionId = moduleAction.id;
      const url = moduleAction.url;
      const id = this.$route.query.id;
      const moduleName = this.$route.path.split('/')[1];
      this.$router.push({ path: url, query: { id: id, actionId: actionId }});
      // this.$router.push({ path: '/' + moduleName + "/edit?id=" + id + '&actionId=' + actionId });
    },
    handleCreate(moduleAction) {
      this.showEditView(moduleAction);
    },
    handleModify(moduleAction) {
      this.showEditView(moduleAction);
    },
    handleRemove(moduleAction) {
      this.$confirm(messageFormat(this.i18nName('module.message.continueExecuteAction'), [moduleAction.name]), 
        this.i18nName('module.warning'), {
        confirmButtonText: this.i18nName('module.confirm'),
        cancelButtonText: this.i18nName('module.cancel'),
        type: 'warning'
      }).then(() => {
        this.removing = true;
        const moduleName = this.module.name;
        const params = { actionId: moduleAction.id, ids: [ this.$route.query.id ] }
        remove(this.module, params).then(response => {
          this.removing = false;
          this.$message({ type: 'success', message: this.i18nName('module.message.removeDataCompleted') });
          this.$router.push({ path: this.module.url });
        }).catch((error) => {
          this.removing = false;
        });
      }).catch(() => {
        // this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    handleEditorDetail(url) {
      window.open(url, '', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,copyhistory=no')
    },
    scrollToTarget(selector) {
      const options = {
        behavior: 'smooth',
        block: 'start',
        inline: 'center'
      }
      const target = document.querySelector(selector);
      if(target) {
        target.scrollIntoView(options);
      }
      // document.querySelector('.children-1').scrollIntoView(options);
    },
    i18nName
  }
};
</script>
<style lang="scss" scoped>
.from-container {
  padding: 8px 10px;
}

.example-info-body /deep/ .el-card__body {
  padding:0px!important;
}
.example-info-body /deep/ .el-form-item__label {
  font-weight: 600;
  line-height:30px;
}
.example-info-body /deep/ .el-form-item__content label {
  font-weight: normal;
}
.example-info-body .el-tag {
  margin-right:10px;
}
.example-info-body .el-form >>> .el-form-item {
  margin-right:24px;
}
.example-info-body /deep/ .el-pagination {
  padding:0px 5px;
}
.example-info-body .el-collapse /deep/ .el-collapse-item__header {
  height:30px;
  line-height:30px;
  border-top:1px solid #e2e2e2;
  border-bottom:0px;
  padding-left:15px;
  font-weight: 600;
  background:#fafafa;
}
.el-collapse /deep/ .el-collapse-item__arrow {
  height:30px;
  line-height:30px;
  font-weight: 600;
}
.el-collapse /deep/ .el-collapse-item__wrap:last-child {
    border-bottom: 0px;
}
.margin-bottom-0 {
  margin-bottom:0px!important;
}
.el-radio-button /deep/ .el-radio-button__inner {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 120px;
  padding:6px 8px;
}
</style>
