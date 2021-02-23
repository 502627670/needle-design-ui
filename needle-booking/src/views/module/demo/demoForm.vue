<template>
  <div class="example-form-container">
    <div style="padding:0px;margin:20px;border:1px solid green;padding:15px 0;">
      
      
      <el-form ref="dataForm" :model="dataForm" label-width="160px">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item label="作者:" style="margin-right:10%;">
              <el-input placeholder="请输入内容" v-model="dataForm.author">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item> 
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="发布时间:" style="margin-right:10%;">
              <el-date-picker v-model="dataForm.display_time" type="datetime" style="width:100%;"
                format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="重要性:" style="margin-right:10%;">
              <el-rate style="margin-top:8px;" v-model="dataForm.importance" :max='3' :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :low-threshold="1"
                :high-threshold="3">
              </el-rate>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="名称" prop="name" style="margin-right:10%;">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="活动区域" prop="region" style="margin-right:10%;">
              <el-select v-model="ruleForm.region" placeholder="请选择活动区域" style="width:100%;">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="活动时间" required style="margin-right:10%;">
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
            <el-form-item label="活动性质" prop="type" style="margin-right:10%;">
              <el-checkbox-group v-model="ruleForm.type" size="small">
                <el-checkbox-button label="美食/餐厅线上活动" name="type" disabled></el-checkbox-button>
                <el-checkbox-button label="地推活动" name="type"></el-checkbox-button>
                <el-checkbox-button label="线下主题活动" name="type"></el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="特殊资源" prop="resource" style="margin-right:10%;">
              <el-radio-group v-model="ruleForm.resource" size="small">
                <el-radio border label="线上品牌商赞助"></el-radio>
                <el-radio border label="线下场地免费"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="多选" style="margin-right:10%;">
              <el-checkbox-group >
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox>
                <el-checkbox label="禁用" disabled></el-checkbox>
                <el-checkbox label="选中且禁用" disabled></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      测试



      <el-form ref="ruleForm" :model="dataForm" :rules="rules" label-width="160px">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12">
            <el-form-item style="margin-right:10%;"
              :label="module.props[1].name" :prop="module.props[1].prop">
              <FormString :moduleProp="module.props[1]" v-model="dataForm.username" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item style="margin-right:10%;"
              :label="module.props[2].name" prop="password">
              <FormText :moduleProp="module.props[2]" v-model="dataForm['password']" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item style="margin-right:10%;"
              :label="module.props[3].name" :prop="module.props[3].prop">
              <FormDate :moduleProp="module.props[3]" v-model="dataForm['group']" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item style="margin-right:10%;"
              :label="module.props[4].name" :prop="module.props[4].prop">
              <FormFK :module="module" :moduleProp="module.props[4]" v-model="dataForm.userStatus" 
              />
            </el-form-item> 
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item style="margin-right:10%;"
              :label="module.props[4].name" :prop="module.props[4].prop">
              <FormDatetime :moduleProp="module.props[4]" v-model="dataForm[module.props[4].prop]" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item style="margin-right:10%;"
              :label="module.props[4].name" :prop="module.props[4].prop">
              <FormTime :moduleProp="module.props[4]" v-model="dataForm[module.props[4].prop]" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item style="margin-right:10%;"
              :label="module.props[4].name" prop="userStatus">
              <FormSelect :moduleProp="module.props[4]" v-model="dataForm['userStatus']" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item style="margin-right:10%;"
              :label="module.props[5].name" :prop="module.props[5].prop">
              <FormFile :moduleProp="module.props[5]" v-model="dataForm[module.props[5].prop]" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24">
            <el-form-item style="margin-right:10%;"
              :label="module.props[5].name" :prop="module.props[5].prop">
              <FormEditor :moduleProp="module.props[5]" v-model="dataForm[module.props[5].prop]"></FormEditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button @click="showData">测试</el-button>
      </el-form>
      
    </div>
  </div>
</template>
<script>
  
  // import Tinymce from '@/components/Tinymce'
  // import Upload from '@/components/Upload/singleImage3'
  import FormString from './components/_string'
  import FormText from './components/_text'
  import FormDate from './components/_date'
  import FormEditor from './components/_editor'
  import FormDatetime from './components/_datetime'
  import FormTime from './components/_time'
  import FormSelect from './components/_select'
  import FormFK from './components/_fk'
  import FormFile from './components/_file'
  
  import  { saveView, updateView, removeView, saveViewProperty, saveViewFilter, getDataList, getPropertyValue, remove, getEntityPropertyValue } 
    from '@/api/example'
  import elDragDialog from '@/directive/el-drag-dialog'
  import { Loading } from 'element-ui'
  // import { i18nName } from '@/utils/i18n'
  import { messageFormat } from '@/utils/index'
  
  let id = 0;

  export default {
    components: { 
      
      FormString, 
      FormText, 
      FormDate,
      FormFK, 
      FormDatetime,
      FormTime, 
      FormSelect,
      FormFile, 
      FormEditor, 

      
      // Tinymce, 
      // Upload,  
    },
    directives: { elDragDialog },
    data() {
      return {
        ruleForm: {},

        dataForm: {},

        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码为必输项', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          group: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          userStatus: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        },

        module: {
          pk: 'id',
          name: 'user',
          props:[{
                "name":"id",
                "prop":"id",
                "leafType":"java.lang.Long"
            },
            {
                "name":"username",
                "prop":"username",
                "leafType":"java.lang.String"
            },
            {
                "name":"password",
                "prop":"password",
                "leafType":"java.lang.String"
            },
            {
                "name":"group",
                "prop":"group",
                "refModuleName":"group",
                "refProp":"id",
                "leafType":"java.lang.Long"
            },
            {
                "name":"userStatus",
                "prop":"userStatus",
                "leafType":"org.needleframe.security.domain.User$UserStatus",
                "values": { "DISABLE": "DISABLE", "ENABLE": "ENABLE" }
            },
            {
                "name":"file",
                "prop":"file",
                "leafType":"java.lang.String"
            },
            {
                "name":"editor",
                "prop":"editor",
                "leafType":"java.lang.String"
            },
          ]
        }
      }
    },
    watch: {
      $route(to) {},
      viewSelectedPropertyArray(valArr) {
        const selectedPropertyArray = this.modulePropertyArray.filter(i => valArr.indexOf(i) >= 0);
        this.moduleViewPropertyArray = [];
        selectedPropertyArray.forEach(i => {
          if(this.moduleViewPropertyArray.indexOf(i) < 0) {
            let moduleProperty = this.moduleProperties[i]
            this.moduleViewPropertyArray.push({ name: moduleProperty.name, propertyPath: i, property: moduleProperty.property });
          }
        });
        this.dataListKey = this.dataListKey + 1
      },
    },
    created() {
      // this.getList();
    },
    methods: {
      submitForm() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      showData() {
        alert(this.dataForm['username'])
      },
      getModuleProp() {
        return this.module.props[1] 
      },
      i18nName(s) {
        return s
      }
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
}
</style>
<style>
.example-list-container .el-table .el-table-column--selection .cell {
  padding:0px 10px!important;
}
</style>