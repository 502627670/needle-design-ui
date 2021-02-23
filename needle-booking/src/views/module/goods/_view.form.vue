<template>
  <div class="example-info-container">
   
    <div  class="example-info-body" style="border:0px solid #d2d6de;">
      <div>
        <el-form ref="ruleForm" :model="dataForm" :key="dataFormKey" :rules="rules" label-width="160px">
          <el-row :gutter="0">
            <el-col style="padding-right:10%;" :xs="24" :sm="24" class="form-item-col">
              <el-form-item label="商品分类" prop="category">
              <FormFK :moduleProp="{prop:'category',refProp:'id', refModuleName:'category', showProp:'name',showPath:'category.name'}" 
                  v-model="dataForm['category']" 
                  :showValue="dataForm['category.name']" @handleBack="(mappings, data)=>{Object.keys(mappings).forEach(refProp => {let prop=mappings[refProp]; $set(dataForm, prop, data[refProp]); })}"></FormFK> 
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="24" class="form-item-col">
              <el-form-item label="商品图片" prop="listPicUrl">
                <FormFile :moduleProp="{prop:'listPicUrl', feature: 'IMAGE', ruleType: 1 << 10}" v-model="dataForm['listPicUrl']" :showUri="dataForm['listPicUrl']"></FormFile>
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="24" class="form-item-col">
              <el-form-item label="商品轮播图" prop="galleryImgs">
                <FormFile ref="galleryImgs" :moduleProp="{prop:'galleryImgs', feature: 'IMAGE', ruleType: 1 << 10}" 
                  :limitSize="10" v-model="dataForm.galleryImgs" :showUri="dataForm.galleryImgs||''">
                </FormFile>
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="24" class="form-item-col">
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="dataForm['name']" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="24" class="form-item-col">
              <el-form-item label="商品简介" prop="goodsBrief">
                <el-input v-model="dataForm['goodsBrief']" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="12" class="form-item-col">
              <el-form-item label="商品单位" prop="goodsUnit">
                <el-input v-model="dataForm['goodsUnit']" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="12" class="form-item-col">
              <el-form-item label="销量" prop="sellVolume">
                <el-input v-model="dataForm['sellVolume']" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="24" class="form-item-col">
              <el-form-item label="型号和价格" prop="specificationId1">
                <el-select ref="select" v-model="dataForm.specificationId1"
                  clearable placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in specificationList" 
                    :key="item.name" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
                
                <div style="margin-top:10px;">
                  <el-table :data="productList" style="width:100%;">
                    <el-table-column label="商品SKU">
                      <template slot-scope="scope">
                        <el-input @blur="checkSkuOnly(scope.$index, scope.row)" 
                          v-model="scope.row.goodsSn" autocomplete="off"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="快递单上的简称" :width="180">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.goodsName" autocomplete="off"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="型号/规格">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.value" autocomplete="off"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="成本（元）">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.cost" autocomplete="off"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="零售（元）">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.retailPrice" autocomplete="off"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="重量（KG）">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.goodsWeight" autocomplete="off"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="库存">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.goodsNumber" autocomplete="off"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button size="mini"
                          @click="handleDelProduct(scope.$index, scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <div style="margin-top:10px;">
                    <el-button type="primary" @click="handleAddProduct">新增型号</el-button>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="24" class="form-item-col">
              <el-form-item label="选择快递模板" prop="freightTemplate">
                <FormFK :moduleProp="{prop:'freightTemplate',refProp:'id', refModuleName:'freightTemplate', showProp:'name',showPath:'freightTemplate.name'}" 
                  v-model="dataForm['freightTemplate']" 
                  :showValue="dataForm['freightTemplate.name']" @handleBack="(mappings, data)=>{Object.keys(mappings).forEach(refProp => {let prop=mappings[refProp]; $set(dataForm, prop, data[refProp]); })}"></FormFK> 
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="12" class="form-item-col">
              <el-form-item label="排序" prop="sortOrder" style="width:50%;">
                <el-input v-model="dataForm['sortOrder']" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="12" class="form-item-col">
              <el-form-item label="首页显示" prop="isIndex">
                <FormSelect :moduleProp="{prop:'isIndex', values:[{label:'是',value:true},{label:'否',value:false}]}" v-model="dataForm['isIndex']" :showValue="dataForm['isIndex']"></FormSelect>
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="12" class="form-item-col">
              <el-form-item label="发布" prop="isOnSale">
                <el-switch v-model="dataForm['isOnSale']" 
                  active-text="上架" inactive-text="下架">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col style="padding-right:10%;" :xs="24" :sm="24" class="form-item-col">
              <el-form-item label="商品详情" prop="goodsDesc">
                <FormEditor :moduleProp="{}" v-model="dataForm['goodsDesc']"></FormEditor>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    
    <section v-for="child in childrenModules" :key="'children_section_' + child.name">
      <Children ref="childrenList" :module="child"></Children>
    </section>
    
  </div>
</template>

<script>
import FormString from '@/views/module/components/_form.string'
import FormText from '@/views/module/components/_form.text'
import FormDate from '@/views/module/components/_form.date'
import FormEditor from '@/views/module/components/_form.editor'
import FormDateTime from '@/views/module/components/_form.datetime'
import FormTime from '@/views/module/components/_form.time'
import FormSelect from '@/views/module/components/_form.select'
import FormFK from '@/views/module/components/_form.fk'
import FormFile from '@/views/module/components/_form.file'
import Children from '@/views/module/components/_view.children'
import { mapGetters } from "vuex";
import  { create, findList, isRequired, isID, isHideInForm, isShowInRow } from '@/api/example'
export default {
  name: "froms",
  components: {
    FormString, 
    FormText, 
    FormDate,
    FormFK, 
    FormDateTime,
    FormTime, 
    FormSelect,
    FormFile, 
    FormEditor,
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
      dataFormKey:0,
      dataForm: {},
      rules: this.getFormRules(),
      pk: this.module.pk,
      moduleProps: this.module.props || [],
      children: this.getChildren() || [],
      childrenModules: [],
      action: {},

      specificationList: [],
      productList: [],
    };
  },
  created () {
    this.getChildrenModules()
    this.initialize()
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  methods: {
    initialize() {
      this.dataForm = {}
      this.module.props.filter(mp =>!!mp.defaultValue).forEach(mp => {
        this.dataForm[mp.prop] = mp.defaultValue || ''
      })
      this.$nextTick( _ => {
        if(this.$refs.childrenList) {
          this.$refs.childrenList.forEach(child => child.getChildrenData())
        }
      })
      this.getSpecificationList()
    },
    setAction(action) {
      this.dataForm = {}
      this.action = action || {}
      if(!this.action.props || this.action.props.length <= 0) {
        this.moduleProps = this.module.props
      }
      else {
        let mps = []
        this.moduleProps.forEach(mp => {
          let actionProp = this.action.props.find(ap => mp.prop === ap.prop)
          if(actionProp) {
            let tmp = { ...mp }
            tmp.defaultValue = actionProp.value
            tmp.values = actionProp.values
            tmp.ruleType |= actionProp.ruleType
            mps.push(tmp)
          }
        })
        this.moduleProps = mps
      }
      this.moduleProps.filter(mp =>!!mp.defaultValue).forEach(mp => {
        this.dataForm[mp.prop] = mp.defaultValue || ''
      })
      this.rules = this.getFormRules()
    },
    getFormRules() {
      let rules = {}

      rules['category'] = [{ required: true, message: '必输项', trigger: 'blur' }]
      rules['listPicUrl'] = [{ required: true, message: '必输项', trigger: 'blur' }]
      rules['galleryImgs'] = [{ required: true, message: '必输项', trigger: 'blur' }]
      rules['name'] = [{ required: true, message: '必输项', trigger: 'blur' }]
      rules['goodsBrief'] = [{ required: true, message: '必输项', trigger: 'blur' }]
      rules['goodsUnit'] = [{ required: true, message: '必输项', trigger: 'blur' }]
      rules['sellVolume'] = [{ required: true, message: '必输项', trigger: 'blur' }]
      rules['specificationId'] = [{ required: true, message: '必输项', trigger: 'blur' }]
      rules['freightTemplate'] = [{ required: true, message: '必输项', trigger: 'blur' }]
      
      this.dataFormKey++
      return rules
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if(!this.productList || this.productList.length <= 0) {
            this.$message({ type: 'error', message: '型号和价格的值不能为空' })
            return false
          }
          for(const ele of this.productList) {
            if(!ele.cost||!ele.goodsSn||!ele.goodsName||!ele.goodsWeight||!ele.retailPrice||!ele.value||!ele.goodsNumber){
              this.$message({ type: 'error', message: '型号和价格的值不能为空' })
              return false
            }
          }

          let actionDataList = this.getActionDataList()
          let params = { _data: JSON.stringify(actionDataList) }
          params._action = this.action.id

          params.specificationId1 = this.dataForm.specificationId1
          params.galleryImgs = this.dataForm.galleryImgs
          this.productList.forEach(p => {
            p.isDelete = false
            p.isOnSale = true
            p.hasChange = false
          })
          params.productList = JSON.stringify(this.productList)

          create(this.module.name, params).then(response => {
            this.initialize()
            this.$emit('handleSuccess')
          }).catch(() => {})
        } 
        else {
          this.$message({ type: 'error', message: '数据验证失败，请检查输入项' });
          console.log('error submit!!');
          return false;
        }
      })
    },
    isHideInForm(ruleType) {
      return isHideInForm(ruleType)
    },
    getSpecificationList() {
      findList('specification', {_sort:'sortOrder',_direction:'asc'}).then(response => {
        this.specificationList = response.data.content
      }).catch(() => {})
    },
    checkSkuOnly(index,row) {
      console.log(index);
      if(row.goodsSn === '') {
          this.$message({ type: 'error', message: 'SKU不能为空' })
          return false
      }
      findList('product', {'goodsSn': row.goodsSn}).then(response => {
        if(response.data.content.length > 0) {
          if(response.data.content[0].id !== row.id) {
            this.$message({ type: 'error', message: '该SKU已存在！' })
          }
        }
        else {
          this.$message({ type: 'success', message: '该SKU可以用！' })
        }
      }).catch(() => {})
    },
    getChildren() {
      let children = this.module.children || []
      children = children.filter(element => {
        let childProp = element.props || []
        let propSize = childProp.filter(mp => !mp.refModuleName && !this.isHideInForm(mp.prop)).length
        if(propSize > 1) return false
        return element.otherRefProps && element.otherRefProps.length == 1
      })
      return children
    },
    getChildrenModules() {
      this.children.forEach(child => { // { pk:, name:, ... }
        child.otherRefProps.forEach(otherRefProp => {
          let refModuleProp = child.props.filter(prop => prop.prop === otherRefProp)[0]
          let pk = refModuleProp.refProp
          let refModuleName = refModuleProp.refModuleName
          this.childrenModules.push({ name: refModuleName, pk: pk })
        })
      })
    },
    getActionDataList() {
      let actionDataList = [{ module: this.module.name, data: this.dataForm }]
      let childrenPageList = this.$refs.childrenList
      this.children.forEach((child, index) => {
        let actionData = { module: child.name }
        let pkName = this.childrenModules[index].pk
        let propName = child.otherRefProps[0]
        let result = []
        let selectionData = childrenPageList[index].dataListSelection
        selectionData.forEach(data => {
          let map = {}
          map[propName] = data[pkName]
          result.push(map)
        })
        actionData.data = result
        actionDataList.push(actionData)
      })
      return actionDataList
    },
    handleDelProduct(index, row) {
      this.productList.splice(index, 1)
    },
    handleAddProduct() {
      this.productList.push({})
    },
    isShowInRow,
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
    width: 400px;
    text-align:right;
  }

  .child-filter-container .el-form-item { margin-bottom: 0px; }

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