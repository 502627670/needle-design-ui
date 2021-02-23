<template>
<div class="example-info-container">
  <div class="example-info-body" style="border:0px solid #d2d6de;">
    <div>
      <el-form ref="ruleForm" label-width="150px" style="padding:15px 20px;">
        <el-row :gutter="0">
          <el-col v-for="prop in module.viewProps" 
            :key="prop.prop" :xs="24" :sm="12">
            <el-form-item v-if="!isID(prop.ruleType)" :label="prop.name">
              <div style="margin-right:15px;">
                {{ dataInfo[prop.prop] }} 
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
  <section v-for="child in this.module.children" :key="'_info_children_' + child.name">
    <Children ref="childrenList" :parent="module" :module="child"></Children>
  </section>
</div>
</template>

<script>
import Children from './_role.childrenEdit'
import { mapGetters } from "vuex"
import  { getEntity, remove, isID, isAuditProp } from '@/api/example'
export default {
  name: "info",
  components: { 
    Children
  },
  props: {
    module: {
      type: Object,
      required: true,
      default: {}
    }
  },
  data () {
    return {
      dataInfo: {},
      fileHttpServer: '',
      pageRequest: {}
    };
  },
  created () {
    // this.getInfo();
  },
  computed: {
    // ...mapGetters(["permission"])
  },
  methods: {
    initialize(data) {
      this.getInfo(data)
      this.getChildrenData(data)
    },
    getInfo(data) {
      getEntity(this.module.name, data[this.module.pk]).then(response => {
        this.dataInfo = response.data
      }).catch(() => {})
    },
    deleteData() {
      this.$confirm('确认要删除当前数据吗？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        let params = {}
        params[this.module.pk] = this.dataInfo[this.module.pk]
        remove(this.module.name, params).then(response => {
          this.$emit('handleDeleteSuccess')
          this.$message({ type: 'success', message: '删除操作执行完成' });
        }).catch(() => {})
      }).catch(() => {
        this.$message({ type: 'info', message: '删除已取消' });
      })
    },
    isID(ruleType) {
      return isID(ruleType)
    },
    getChildrenData(data) {
      let childrenList = this.$refs.childrenList
      if(childrenList) {
        this.module.children.forEach((child, index) => {
          let refProp = child.refProp
          childrenList[index].initialize(data, refProp)
        })
      }
    },

    // getSelectLabel(moduleProperty) {
    //   const value = this.dataInfo.entity[moduleProperty.propertyPath]
    //   let label = moduleProperty.valueMap[value] || value
    //   return label
    // },
    // getDataPropertyValue(moduleProperty) {
    //   return getEntityPropertyValue(this.dataInfo.entity, moduleProperty, this.dataInfo.entityRefObjects);
    // },
    // formatDateTime(datetime) {
    //   return parseTime(new Date(datetime), '{y}-{m}-{d} {h}:{i}:{s}');
    // },
    // getInfo() {
    //   const params = { id: this.$route.query.id }
    //   const moduleName = this.$route.path.split('/')[1];
    //   this.activeGroupNames = [this.groupSystemInfo];
    //   this.module.label = moduleName;
    //   // getDataInfo(this.module, params).then(response => {
    //   //     if(!this.module.name || this.module.name != response.data.module) {
    //   //       this.module = response.data.module;
    //   //     }
    //   //     this.fileHttpServer = response.data.fileHttpServer;
    //   //     this.moduleProperties = response.data.moduleProperties;
    //   //     this.moduleActions = response.data.moduleActions;
    //   //     this.childrenProperties = response.data.childrenProperties;
    //   //     this.dataInfo = response.data;
    //   //     const rowGroups = response.data.rowGroups || [];
    //   //     this.firstRowGroup = rowGroups.length > 0 ? rowGroups[0] : {};
    //   //     this.notFirstRowGroups = rowGroups.length > 1 ? rowGroups.slice(1, rowGroups.length) : []; 
    //   //     this.notFirstRowGroups.forEach(rowGroup => this.activeGroupNames.push(rowGroup.name));
    //   //     this.moduleProperties.forEach(mp => {
    //   //       if(mp.auditPropertyMask == 2) this.createdByProperty = mp;
    //   //       if(mp.auditPropertyMask == 3) this.createdDateProperty = mp;
    //   //       if(mp.auditPropertyMask == 4) this.lastModifiedByProperty = mp;
    //   //       if(mp.auditPropertyMask == 5) this.lastModifiedDateProperty = mp;
    //   //     });
    //   //   });
    // },
    // showEditView(moduleAction) {
    //   let actionId = moduleAction.id;
    //   const url = moduleAction.url;
    //   const id = this.$route.query.id;
    //   const moduleName = this.$route.path.split('/')[1];
    //   this.$router.push({ path: url, query: { id: id, actionId: actionId }});
    //   // this.$router.push({ path: '/' + moduleName + "/edit?id=" + id + '&actionId=' + actionId });
    // },
    // handleCreate(moduleAction) {
    //   this.showEditView(moduleAction);
    // },
    // handleModify(moduleAction) {
    //   this.showEditView(moduleAction);
    // },
    // handleRemove(moduleAction) {
    //   // this.$confirm(messageFormat(this.i18nName('module.message.continueExecuteAction'), [moduleAction.name]), 
    //   //   this.i18nName('module.warning'), {
    //   //   confirmButtonText: this.i18nName('module.confirm'),
    //   //   cancelButtonText: this.i18nName('module.cancel'),
    //   //   type: 'warning'
    //   // }).then(() => {
    //   //   this.removing = true;
    //   //   const moduleName = this.module.name;
    //   //   const params = { actionId: moduleAction.id, ids: [ this.$route.query.id ] }
    //   //   remove(this.module, params).then(response => {
    //   //     this.removing = false;
    //   //     this.$message({ type: 'success', message: this.i18nName('module.message.removeDataCompleted') });
    //   //     this.$router.push({ path: this.module.url });
    //   //   }).catch((error) => {
    //   //     this.removing = false;
    //   //   });
    //   // }).catch(() => {
    //   //   // this.$message({ type: 'info', message: '已取消删除' });
    //   // });
    // },
    // handleEditorDetail(url) {
    //   window.open(url, '', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,copyhistory=no')
    // },
    // scrollToTarget(selector) {
    //   const options = {
    //     behavior: 'smooth',
    //     block: 'start',
    //     inline: 'center'
    //   }
    //   const target = document.querySelector(selector);
    //   if(target) {
    //     target.scrollIntoView(options);
    //   }
    //   // document.querySelector('.children-1').scrollIntoView(options);
    // },
  }
};
</script>
<style lang="scss" scoped>
.from-container {
  padding: 8px 10px;
}
.example-info-body >>> .el-card__body {
  padding:0px!important;
}
.example-info-body >>> .el-form-item__label {
  font-weight: 600;
  line-height:30px;
}
.example-info-body >>> .el-form-item__content label {
  font-weight: normal;
}
.example-info-body .el-tag {
  margin-right:10px;
}
.example-info-body .el-form >>> .el-form-item {
  margin-right:24px;
}
.example-info-body >>> .el-pagination {
  padding:0px 5px;
}
.example-info-body .el-collapse >>> .el-collapse-item__header {
  height:30px;
  line-height:30px;
  border-top:1px solid #e2e2e2;
  border-bottom:0px;
  padding-left:15px;
  font-weight: 600;
  background:#fafafa;
}
.el-collapse >>> .el-collapse-item__arrow {
  height:30px;
  line-height:30px;
  font-weight: 600;
}
.el-collapse >>> .el-collapse-item__wrap:last-child {
    border-bottom: 0px;
}
.margin-bottom-0 {
  margin-bottom:0px!important;
}
.el-radio-button >>> .el-radio-button__inner {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 120px;
  padding:6px 8px;
}

.example-info-container {
  .box{
    display: flex;
    justify-content: space-between;
    width:100%;
    background:#fafafa;
    padding:4px 10px 5px 10px;
  }
  .left {
    display: flex;
    flex: 1;
    height: 100%;
  }
  .right {
    width: 100px;
    text-align:right;
  }

  .el-form-item { margin-bottom: 10px; }

  .example-list-body {
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
  .crud-pagination {
    margin-top:4px;
    padding:2px 10px;
    text-align:right;
  }
}
</style>
<style>
.example-list-container .el-table .el-table-column--selection .cell {
  padding:0px 10px!important;
}
.example-list-container .el-dialog{
  display: flex;
  flex-direction: column;
  min-width: 600px;
  margin:0 !important;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  /*height:600px;*/
  max-height:calc(100% - 30px);
  max-width:calc(100% - 30px);
}
.example-list-container .el-dialog .el-dialog__body{
  flex:1;
  overflow: auto;
}
.example-list-container .el-dialog .el-dialog__footer {
  text-align: center;
}
</style>