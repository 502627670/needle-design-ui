<template>
<div class="example-info-container">
  <div class="example-info-body" style="border:0px solid #d2d6de;">
    <div style="margin-bottom:15px;" v-if="taskNexts.length > 0">
    <el-steps :active="activeStep" align-center >
      <el-step v-for="task in taskNexts" 
        :icon="username===task.assignee?'el-icon-user-solid':''"
        :key="'task_' + task.id" 
        :title="task.assignee" 
        :description="task.taskStatus">
      </el-step>
    </el-steps>
    </div>
    <div>
      <el-form ref="ruleForm" label-width="150px" style="padding:15px 20px;">
        <el-row :gutter="0">
          <el-col v-for="prop in module.viewProps" 
            :key="prop.prop" :xs="24" :sm="prop.feature==='IMAGE'||prop.feature==='FILE'?24:12">
            <el-form-item v-if="!isHideInInfo(prop.ruleType) && !isAuditProp(prop.ruleType)" :label="prop.name">
              <div v-if="prop.feature==='IMAGE' && dataInfo[prop.prop]">
                <a href="#" @click="handlePreview(getFileUrl(dataInfo[prop.prop]))">
                  <img :src="getFileUrl(dataInfo[prop.prop])" style="max-width:800px;" />
                </a>
              </div>
              <div v-else-if="prop.feature==='FILE' && dataInfo[prop.prop]">
                <i class="el-icon-document" />
              </div>
              <div v-else>{{ dataInfo[prop.prop] }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
  <section v-for="child in this.module.children" :key="'_info_children_' + child.name">
    <Children ref="childrenList" :parent="module" :module="child" 
      @handleCreateSuccess="handleCreateSuccess"></Children>
  </section>
</div>
</template>

<script>
import Children from './_view.childrenEdit'
import { mapGetters } from "vuex"
import openWindow from '@/utils/open-window'
import  { getEntity, findList, findTaskNexts, remove, isHideInInfo, isAuditProp} from '@/api/example'
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
  data() {
    return {
      dataInfo: {},
      activeStep: 1,
      taskNexts: [],
    };
  },
  created () {},
  computed: {
    ...mapGetters(["fileHttpServer", "username"])
  },
  methods: {
    initialize(data) {
      this.getInfo(data)
      this.getTaskNexts(data)
      if(this.module.children) {
        this.getChildrenData(data)
      }
    },
    getTaskNexts(data) {
      let params = { id: data.id }
      this.activeStep = 0
      this.taskNexts = []
      findTaskNexts('task', params).then(response => {
        this.taskNexts = response.data
        this.activeStep = this.taskNexts.length - 1
        // for(let i = 0; i < this.taskNexts.length; i++) {
        //   let taskStatus = this.taskNexts[i].taskStatus
        //   if(taskStatus !== 'COMPLETE' && taskStatus !== '已完成') break
        //   this.activeStep = i + 1
        // }
      })
    },
    getInfo(data) {
      getEntity(this.module.name, data[this.module.pk]).then(response => {
        this.dataInfo = response.data
        let noChildren = !this.module.children
        this.module.props = response.module.props
        if(noChildren) this.getChildrenData(this.dataInfo)
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
    getChildrenData(data) {
      let childrenList = this.$refs.childrenList
      if(childrenList) {
        this.module.children.forEach((child, index) => {
          let refProp = child.refProp
          childrenList[index].initialize(data, refProp)
        })
      }
    },
    handleCreateSuccess() {
      this.getInfo(this.dataInfo)
      // this.getTaskSteps(this.dataInfo)
    },
    getFileUrl(uri) {
      let server = this.fileHttpServer + ''
      if(server.endsWith('/')) {
        server = server.substring(0, server.length - 1)
      }
      return server + uri
    },
    handlePreview(url) {
      if(url) {
        openWindow(url, "图片预览", 600, 600)
      }
    },
    isHideInInfo,
    isAuditProp,
  }
};
</script>
<style lang="scss" scoped>
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
