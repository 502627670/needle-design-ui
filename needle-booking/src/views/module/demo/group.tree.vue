<template>
  <div class="example-list-container">
    <div style="padding:15px 20px 5px 20px;">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="组名">
          <el-input placeholder="组名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="example-list-body" style="margin:0px 20px;border-top:3px solid #d2d6de; border-bottom:0px solid #d2d6de;">
      <div class="box">
        <div class="left">
          <el-button type="default" @click="handleImport"><span>新建</span></el-button>
          <el-button type="default" @click="handleImport"><span>修改</span></el-button>
        </div>
        <div class="right">
          <button type="button" class="el-button el-button--default el-button--small is-circle">
            <i class="el-icon-refresh"></i>
          </button>
          <button type="button" class="el-button el-button--default el-button--small is-circle">
            <i class="el-icon-menu"></i>
          </button>
        </div>
      </div>
      <section style="margin: 10px 0;">
        <div class="block">

          <el-tree
            :props="props"
            :load="loadNode"
            lazy>
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => append(data)">
                  新增
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleEdit">
                  修改
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>

          <!-- <el-tree 
            :data="data" node-key="id" 
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => append(data)">
                  新增
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleEdit">
                  修改
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree> -->
        </div>
      </section>
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑组':'新建组'">
      <el-form :model="role" label-width="80px" label-position="right">
        <el-form-item label="父级">
          <el-input v-model="group.parent" placeholder="父级" readonly/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="group.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="group.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  // import createForm from '../form/dialog'
  // import exportList from './_export'
  // import importList from './_import'
  // import elDragDialog from '@/directive/el-drag-dialog'
  import { Loading } from 'element-ui'
  
  let id = 1000;
  const data = [{
    id: 1,
    label: '一级 1',
    children: [{
      id: 4,
      label: '二级 1-1',
      children: [{
        id: 9,
        label: '三级 1-1-1'
      }, {
        id: 10,
        label: '三级 1-1-2'
      }]
    }]
  }, {
    id: 2,
    label: '一级 2',
    children: [{
      id: 5,
      label: '二级 2-1'
    }, {
      id: 6,
      label: '二级 2-2'
    }]
  }, {
    id: 3,
    label: '一级 3',
    children: [{
      id: 7,
      label: '二级 3-1'
    }, {
      id: 8,
      label: '二级 3-2'
    }]
  }];

  export default {
    components: { 
      // createForm, 
      // exportList, 
      // importList 
    },
    // directives: { elDragDialog },
    data() {
      return {

        props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },  

        formInline: {},
        group: {},
        dialogVisible: false,
        data: JSON.parse(JSON.stringify(data))
      }
    },
    watch: {
      $route(to) {},
      // viewSelectedPropertyArray(valArr) {
      //   const selectedPropertyArray = this.modulePropertyArray.filter(i => valArr.indexOf(i) >= 0);
      //   this.moduleViewPropertyArray = [];
      //   selectedPropertyArray.forEach(i => {
      //     if(this.moduleViewPropertyArray.indexOf(i) < 0) {
      //       let moduleProperty = this.moduleProperties[i]
      //       this.moduleViewPropertyArray.push({ name: moduleProperty.name, propertyPath: i, property: moduleProperty.property });
      //     }
      //   });
      //   this.dataListKey = this.dataListKey + 1
      // },
    },
    created() {
      // this.getList();
    },
    methods: {
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region' }]);
        }
        if (node.level > 1) return resolve([]);

        setTimeout(() => {
          const data = [{
            name: 'leaf',
            leaf: true
          }, {
            name: 'zone'
          }];

          resolve(data);
        }, 500);
      },

      handleEdit() {
        this.dialogVisible = true
      },
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
            </span>
          </span>);
      },
    }
  }
</script>

<style lang="scss" scoped>
.example-list-container {
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

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
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