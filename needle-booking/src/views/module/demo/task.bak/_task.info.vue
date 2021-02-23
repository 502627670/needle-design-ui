<template>
<div class="example-info-container">
  <div class="example-info-body" style="border:0px solid #d2d6de;">
    <el-steps :active="activeStep" align-center >
      <el-step v-for="userProcess in taskSteps" 
        @click.native="handleSelect(task)" 
        :icon="username===userProcess.assignee?'el-icon-user-solid':''"
        :key="'task_' + userProcess.id" style="cursor:pointer"
        :title="userProcess.assignee" 
        :description="userProcess.processStatus">
      </el-step>
    </el-steps>
    <div>

      <el-form ref="ruleForm" label-width="180px" style="padding:20px 20px 15px 20px;">
        <el-row :gutter="0">
          <el-col :sm="24">
            <el-form-item label="任务标题">
              {{selectedTask.subtitle}}
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="关联项目">
              {{selectedTask.module}}
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="关联业务">
              <router-link :to="'/'+selectedTask.module+'?id='+selectedTask.instanceId+'&_pk='+selectedTask.instancePk">
                {{selectedTask.instanceTitle}} 
                <i class="el-icon-view el-icon--right"></i>
              </router-link>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="报告人">
              {{selectedTask.reporter}}
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="发起时间">
              {{selectedTask.assignDate}}
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="接收人">
              {{selectedTask['assignee'] || selectedTask.assignee}}
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="开始时间">
              {{selectedTask.beginDate}}
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="完成时间">
              {{selectedTask.completeDate}}
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="任务状态">
              <el-tag>{{selectedTask.taskStatus}}</el-tag>
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
import Children from '../components/_view.childrenEdit'
import { mapGetters } from "vuex"
import openWindow from '@/utils/open-window'
import  { getEntity, findList, remove, isHideInInfo, isAuditProp} from '@/api/example'
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
      data: {},

      taskSteps: [],
      activeStep: 1,
      dataInfo: {},
      selectedTask: {},
      activeName: '',

      currentProcess: {},
    };
  },
  created () {
    // this.getInfo();
  },
  computed: {
    ...mapGetters(["fileHttpServer", "username"])
  },
  methods: {
    initialize(data) {
      this.data = data || {}
      this.getInfo(data)
      this.getUserProcesses(data)
    },
    handleSelect(task) {
      getEntity(this.module.name, task[this.module.pk]).then(response => {
        this.selectedTask = response.data
      }).catch(() => {})
    },
    getUserProcesses(data) {
      let params = { taskId: data[this.module.pk] }
      findList('userProcess', params).then(response => {
        this.taskSteps = response.data || []
        this.currentProcess = this.getCurrentProcess(this.taskSteps)
        this.activeStep = 0
        for(let i = 0; i < this.taskSteps.length; i++) {
          if(this.taskSteps[i].processStatus === 'COMPLETE' || 
             this.taskSteps[i].processStatus==='BACK') {
            this.activeStep = i + 1
          }
          else break
        }
      }).catch(() => {})
    },
    getCurrentProcess(userProcesses) {
      if(userProcesses.length === 1) return userProcesses[0]
      return userProcesses.find(up => {
        return up.assignee === this.data.assignee && 
          (up.processStatus==='TODO' || up.processStatus==='BEGIN')
      })
    },
    getInfo(data) {
      getEntity(this.module.name, data[this.module.pk]).then(response => {
        this.dataInfo = response.data
        this.selectedTask = this.dataInfo
        this.activeName = this.selectedTask.id
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

.step-detail {
  padding: 15px 50px;
  // .el-tabs__nav {
  //   float:none;
  // }
}

</style>