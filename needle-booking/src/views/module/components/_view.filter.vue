<template>
<div class="example-filter-item">
  <el-cascader v-if="filterProp.selfModule" class="filter-minw"
    :ref="'tree_'+filterProp.prop" @change="handleTreeNodeChange(filterProp)"
    v-model="filterProp.value" clearable :props="getSelfFilterProp(filterProp)">
  </el-cascader>
  <el-select v-else-if="filterProp.refLeafModule" class="filter-minw"
    :ref="'fk_'+filterProp.prop" v-model="filterProp.value" 
    @change="handleFkChange" filterable clearable remote reserve-keyword placeholder="请输入关键词"
    :remote-method="function(query) { remoteMethod(filterProp, query) }" :loading="loading">
    <el-option v-for="item in (filterProp.options || [])"
      :key="item[filterProp.refLeaf]"
      :label="item[filterProp.refLeafShow]"
      :value="item[filterProp.refLeaf]">
    </el-option>
  </el-select>
  <el-select v-else-if="filterProp.values" class="filter-minw"
    v-model="filterProp.value" clearable
    placeholder="请选择" @change="handleChange">
    <el-option v-for="data in filterProp.values" :key="'_filter'+data.value" 
      :label="data.label" :value="data.value"></el-option>
  </el-select>
  <div v-else-if="filterProp.feature==='DATE'" style="display:inline-block;">
    <el-select v-if="filterProp.ops && filterProp.ops.length > 1"
      v-model="op" @change="handleOpChange" 
      slot="prepend" placeholder="请选择" style="width:50px;">
      <el-option v-for="op in filterProp.ops" :key="'filter_op_' + op.label" 
        :label="op.label" :value="op.value"></el-option>
    </el-select>
    <el-date-picker type="date" style="width:150px"
      v-model="filterProp.value" align="right" placeholder="选择日期" 
      format="yyyy-MM-dd" value-format="yyyy-MM-dd"
      :picker-options="dateOptions">
    </el-date-picker>
  </div>
  <div v-else-if="filterProp.feature==='DATETIME'" style="display:inline-block;">
    <el-select v-if="filterProp.ops && filterProp.ops.length > 1"
      v-model="op" @change="handleOpChange" 
      slot="prepend" placeholder="请选择" style="width:50px;">
      <el-option v-for="op in filterProp.ops" :key="'filter_op_' + op.label" 
        :label="op.label" :value="op.value"></el-option>
    </el-select>
    <el-date-picker type="datetime" style="width:150px"
      v-model="filterProp.value" align="right" placeholder="选择日期" 
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      :picker-options="datetimeOptions">
    </el-date-picker>
  </div>
  <div v-else style="display:inline-block;">
    <el-select v-if="filterProp.ops && filterProp.ops.length > 1"
      v-model="op" @change="handleOpChange" 
      placeholder="请选择" style="width:50px;">
      <el-option v-for="op in filterProp.ops" :key="'filter_op_' + op.label" 
        :label="op.label" :value="op.value"></el-option>
    </el-select>
    <el-input v-model="filterProp.value" autocomplete="off" 
      :style="filterProp.ops && filterProp.ops.length > 1?'width:150px':'width:200px'"
      :type="filterProp.feature==='NUMBER'?'number':'text'"
      @blur="handleChange($event.target.value)">
    </el-input>
  </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import  { findList, isAuditProp } from '@/api/example'
export default {
  name: "Children",
  components: {},
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: String
    },
    filterProp: {
      type: Object,
      required: true,
      default: {}
    }
  },
  data () {
    return {
      data: {},
      loading: false,
      op: this.getDefaultOp(),
      treeProps: {},

      dateOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      datetimeOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', start);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', start);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', start);
          }
        }]
      },
    }
  },
  created () {},
  computed: {
    ...mapGetters(["permission"]),
  },
  mounted() {
  },
  methods: {
    getDefaultOp() {
      let defaultOp = this.filterProp.ops.length > 0 ? this.filterProp.ops[0].value : '='
      // this.handleChange(defaultOp)
      this.handleOpChange(defaultOp)
      // this.handleFkChange(defaultOp)
      return defaultOp
    },
    remoteMethod(filterProp, content) {
      if (!this.loading) {
        this.loading = true
        let refLeafModule = filterProp.refLeafModule
        let refLeafProp = filterProp.refLeaf
        let refLeafShowProp = filterProp.refLeafShow
        let viewProps = [ refLeafProp ]
        let viewFilter = { prop: refLeafShowProp, op:'rlike', value: content }
        let viewFilters = [ viewFilter ]
        let params = { 
          '_vp' : viewProps,
          '_vf' : JSON.stringify(viewFilters)
        }
        findList(refLeafModule, params).then(response => {
          filterProp.options = response.data.content
          this.loading = false
        }).catch(() => { this.loading = false })
      }
    },
    getSelfFilterProp(filterProp) {
      let selfModule = filterProp.selfModule
      let selfPk = filterProp.selfPk
      let selfRefProp = filterProp.selfRefProp
      let refLeaf = filterProp.refLeaf
      let showProp = filterProp.refLeafShow
      this.treeProps = {
        lazy: true,
        checkStrictly: true,
        lazyLoad (node, resolve) {
          const parentId = node.value
          let viewFilter = { "prop": selfRefProp, "op":"=", "value": parentId }
          if(!parentId) { viewFilter.op = 'IS NULL' }
          let viewFilters = []
          viewFilters.push(viewFilter)
          findList(selfModule, { '_vf' : JSON.stringify(viewFilters) }).then(response => {
            let data = response.data.content || []
            const nodes = data.map(item => ({
              value: item[selfPk],
              label: item[showProp],
              // leaf: item.offspringNumber <= 0
            }))
            resolve(nodes)
          }).catch(() => {})
        }
      }
      return this.treeProps
    },
    handleTreeNodeChange(filterProp) {
      let propArray = filterProp.prop.split('\.')
      let selfPk = filterProp.selfPk
      let showProp = filterProp.refLeafShow
      let nodes = this.$refs['tree_' + filterProp.prop].getCheckedNodes(true)
      let label = nodes[0].label
      let value = nodes[0].value
      this.$emit('input', value)
    },
    handleChange(val) {
      this.$emit('input', val)
      this.$emit('handleOp', this.op)
    },
    handleOpChange(val) {
      this.$emit('handleOp', this.op)
    },
    handleFkChange(val) {
      this.$emit('input', val)
      this.$emit('handleOp', this.op)
    }
  }
};
</script>
<style lang="scss" scoped>
.example-filter-item {
  display:inline-block;
  .el-form-item { margin-bottom: 10px; } 
  .filter-minw {
    min-width: 200px;
  }
}
</style>
<style>
.example-filter-item .el-form--inline .el-form-item {
  margin-right: 5px!important;
}
.example-filter-item .el-select__caret {
  font-size: 4px!important;
}
.example-filter-item .el-input--suffix .el-input__inner {
  padding-right: 10px;
  padding-left:10px;
}
.example-filter-item .el-input__prefix {
  left: 0px;
}
.example-filter-item .el-input--prefix .el-input__inner {
  padding-left: 20px;
}
</style>
