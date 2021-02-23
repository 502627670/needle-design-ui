<template>
<div>
  <el-row :gutter="20">
    <el-col :sm="12">  
      <div class="col-md-6 col-xl-4 mb-3">
        <div class="card h-100" style="height:242px!important;">
          <div class="card-header">
            <h6><i class="el-icon-date"/> 我的任务</h6>
            <div class="dropdown ml-auto">
              <!-- <a href="#" class="dropdown-toggle text-secondary small">更多</a> -->
              <router-link class="small" to="/myTask">
                更多
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <table class="table table-borderless table-sm table-align-middle mb-0">
              <thead>
                <tr class="text-secondary">
                  <th scope="col" class="text-center">Link</th>
                  <th scope="col">标题</th>
                  <th scope="col" class="text-right">时间</th>
                  <th scope="col" class="text-right">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="taskList.length <= 0">
                  <td colspan="4" class="small text-center" style="padding-left:20px;padding-top:15px;">
                    还没有收到任务
                  </td>
                </tr>
                <tr v-else v-for="(task, index) in taskList" :key="'_index_task_list' + index">
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td class="title-text">
                    <router-link :to="'/myTask?id='+task.id">
                    {{task.subtitle}}
                    </router-link>
                  </td>
                  <td class="text-right">
                    {{task.assignDate}}
                    <!-- <div class="progress" style="height: 3px">
                      <el-progress :percentage="50" color="#1989fa"></el-progress>
                    </div> -->
                  </td>
                  <td class="text-right">{{task.taskStatus}}</td>
                </tr>
                <!-- 
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>Services</td>
                  <td class="text-right">
                    <div class="progress" style="height: 3px">
                      <el-progress :percentage="50"></el-progress>
                    </div>
                  </td>
                  <td class="text-right">处理中</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>Product List</td>
                  <td class="text-right">
                    <div class="progress" style="height: 3px">
                      <el-progress :percentage="60" color="#e6a23c"></el-progress>
                    </div>
                  </td>
                  <td class="text-right">已完成</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>Contact Us</td>
                  <td class="text-right">
                    <div class="progress" style="height: 3px">
                      <el-progress :percentage="50"></el-progress>
                    </div>
                  </td>
                  <td class="text-right">处理中</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>50% Sale</td>
                  <td class="text-right">
                    <div class="progress" style="height: 3px">
                      <el-progress :percentage="50"></el-progress>
                    </div>
                  </td>
                  <td class="text-right">已完成</td>
                </tr> -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </el-col>

    <el-col :sm="12">  
      <div class="col-md-6 col-xl-4 mb-3">
        <div class="card h-100" style="height:242px!important;">
          <div class="card-header">
            <h6><i class="el-icon-message"/> 我的消息</h6>
            <div class="dropdown ml-auto">
              <!-- <a href="#" class="dropdown-toggle text-secondary small">最近的</a> -->
              <router-link class="small" to="/message">
                更多
              </router-link>
            </div>
          </div>
          <div class="card-body">
            <table class="table table-borderless table-sm table-align-middle mb-0">
              <thead>
                <tr class="text-secondary">
                  <th scope="col" class="text-center">Link</th>
                  <th scope="col">标题</th>
                  <th scope="col" class="text-right">时间</th>
                  <th scope="col" class="text-right">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!messageList || messageList.length <= 0">
                  <td colspan="4" class="small text-center" style="padding-left:20px;padding-top:15px;">
                    还没有收到消息
                  </td>
                </tr>
                <tr v-else v-for="(msg, index) in messageList" :key="'_index_msg_' + index">
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>
                    <router-link :to="'/message?id='+msg.id">{{msg.title}}</router-link>
                  </td>
                  <td class="text-right">
                    <div class="progress" style="height: 3px">
                      {{msg.assignDate}}
                    </div>
                  </td>
                  <td class="text-right">
                    {{msg.messageStatus}}
                  </td>
                </tr>
                <!-- <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>Services</td>
                  <td class="text-right">
                    <div class="progress" style="height: 3px">
                      2020-11-01
                    </div>
                  </td>
                  <td class="text-right">已读</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>Product List</td>
                  <td class="text-right">
                    <div class="progress" style="height: 3px">
                      2020-11-01
                    </div>
                  </td>
                  <td class="text-right">未读</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>Contact Us</td>
                  <td class="text-right">
                    <div class="progress" style="height: 3px">
                      2020-11-01
                    </div>
                  </td>
                  <td class="text-right">未读</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>50% Sale</td>
                  <td class="text-right">
                    <div class="progress" style="height: 3px">
                      2020-11-01
                    </div>
                  </td>
                  <td class="text-right">未读</td>
                </tr> -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </el-col>
    <!-- <el-col :sm="8">  
      <div class="col-md-6 col-xl-4 mb-3">
        <div class="card h-100">
          <div class="card-header">
            <h6><i class="el-icon-view" /> 我的访问</h6>
            <div class="dropdown ml-auto">
              <a href="#" class="dropdown-toggle text-secondary small">最近的</a>
            </div>
          </div>
          <div class="card-body">
            <table class="table table-borderless table-sm table-align-middle mb-0">
              <thead>
                <tr class="text-secondary">
                  <th scope="col" class="text-center">Link</th>
                  <th scope="col">项目</th>
                  <th scope="col" class="text-right">内容</th>
                  <th scope="col" class="text-right">时间</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>报价单</td>
                  <td class="text-right">
                    报价单A001
                  </td>
                  <td class="text-right">2020-11-05</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>采购单</td>
                  <td class="text-right">
                    采购单A001
                  </td>
                  <td class="text-right">2020-11-05</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>采购单</td>
                  <td class="text-right">
                    采购单A001
                  </td>
                  <td class="text-right">2020-11-05</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>采购单</td>
                  <td class="text-right">
                    采购单A001
                  </td>
                  <td class="text-right">2020-11-05</td>
                </tr>
                <tr>
                  <td class="text-center">
                    <a href="javascript:void(0)">
                      <i class="el-icon-top-right bigger-130 text-primary" />
                    </a>
                  </td>
                  <td>采购单</td>
                  <td class="text-right">
                    采购单A001
                  </td>
                  <td class="text-right">2020-11-05</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </el-col> -->
    
  </el-row>
</div>
</template>

<script>
import CountTo from 'vue-count-to'
import  { findList } from '@/api/example'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      taskList: [],
      messageList: [],
    }
  },
  created() {
    this.findTasks()
    this.findMessages()
  },
  methods: {
    findTasks() {
      let params = {_size: 5}
      findList('task', params).then(response => {
        this.taskList = response.data.content
        setTimeout(() => {
          this.loading = false
        }, 200)
      })
    },
    findMessages() {
      let params = {_size: 5}
      findList('message', params).then(response => {
        this.messageList = response.data.content
        setTimeout(() => {
          this.loading = false
        }, 200)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
body {
    margin: 0;
    // font-family: Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-family: "Microsoft Yahei";
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #1a202c;
    text-align: left;
    background-color: #e2e8f0;
}

.bigger-130 {
  transition: transform .05s;
}
.text-primary {
  color: #467bcb!important;
}
.h-100 {
  height: 100%!important;
}
.card {
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
}
.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 0 solid rgba(0,0,0,.125);
    border-radius: .25rem;
    margin-bottom:20px;
}
.card-header h6 {
  margin: 5px;
  font-size: .8rem;
}
.card-header:first-child {
    border-radius: .25rem .25rem 0 0;
}
.card-footer, .card-header {
    display: flex;
    align-items: center;
}
.card-header {
    padding: .5rem 1rem;
    margin-bottom: 0;
    background-color: #fff;
    border-bottom: 0 solid rgba(0,0,0,.125);
}

.ml-auto, .mx-auto {
    margin-left: auto!important;
}
.dropdown, .dropleft, .dropright, .dropup {
    position: relative;
}
.card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: .6rem .2rem .8rem .2rem;
}
// a.text-secondary:focus, a.text-secondary:hover {
//     color: #4f5b6b!important;
// }
// a:hover {
//     color: #2b5799;
//     text-decoration: underline;
// }
.text-secondary {
    color: #718096!important;
}

.small, small {
    font-size: 80%;
    font-weight: 400;
}

.mb-0, .my-0 {
    margin-bottom: 0!important;
}
.table-sm {
    font-size: .875rem;
}
.markdown-result table, .table {
    width: 100%;
    margin-bottom: 1rem;
    color: #1a202c;
}
.text-secondary {
    color: #718096!important;
}
.table-sm thead th {
    font-size: calc(.875rem - 1px)!important;
    text-align: left;
}
.markdown-result table thead th, .table thead th {
    border-bottom-width: 1px;
    font-weight: 500;
    font-size: calc(1rem - 1px);
}
.table-align-middle td, .table-align-middle th {
    vertical-align: middle!important;
}

.table-sm td, .table-sm th {
    padding: .2rem;
}
.markdown-result table td, .markdown-result table th, .table td, .table th {
    padding: .4rem;
    vertical-align: top;
    border-top: 1px solid #cbd5e0;
}
.table-borderless tbody+tbody, .table-borderless td, .table-borderless th, .table-borderless thead th {
    border: 0;
}
.text-center {
    text-align: center!important;
}

:not(select) {
    scrollbar-width: thin;
}
*, ::after, ::before {
    box-sizing: border-box;
}
tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
}
.bigger-130:hover {
    transform: scale(1.3);
}
.bigger-130 {
    transition: transform .05s;
}
.material-icons {
    font-size: 1.5em;
}
.text-primary {
    color: #467bcb!important;
}
.title-text {
  overflow: hidden;
  width: 50%;
  // border:1px solid red!important;
  text-overflow: ellipsis;
}
</style>