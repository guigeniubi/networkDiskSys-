<template>
  <div>
    <!--搜索栏-->
    <el-card id="search">
      <el-row><!--24分-->
        <el-col :span="4">
          <el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button></el-col>
        <el-col :span="20" align="right">
          <el-input v-model="searchModel.roleName" placeholder="文件名" clearable></el-input>
          <el-button @click='getRoleList' type="primary" round icon="el-icon-search">查询</el-button></el-col>

      </el-row>
    </el-card>


    <!--结果列表-->
    <el-card>
      <el-table :data="roleList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            <!-- (pageNo-1)*pageSize+index+1 -->
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
          9
        </el-table-column>
        <!-- <el-table-column prop="roleId" label="角色ID" width="200">
        </el-table-column> -->
        <el-table-column prop="roleName" label="文件名" width="260">
        </el-table-column>
        <el-table-column prop="roleDesc" label="修改时间">
        </el-table-column>
        <el-table-column prop="roleDesc" label="大小">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.roleId)" type="primary" icon="el-icon-edit" size="mini"
              circle></el-button>
              <el-button type="primary" icon="el-icon-share" size="mini" circle></el-button>
            <el-button @click="deleteRole(scope.row)" type="danger" icon="el-icon-delete" size="mini"
              circle></el-button>
            
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分页组件-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 50]" :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 上传 -->
    <el-dialog @close='clearForm' :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="roleForm" ref="roleFormRef" :rules="rules">
        <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限设置" prop="menuIdList" :label-width="formLabelWidth">
          <el-tree :data="menuList" :props="menuProps" show-checkbox default-expand-all node-key="menuId" ref="menuRef"
            style="width:85%"></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fileApi from '@/api/file'
import roleApi from '@/api/roleManager'
import menuApi from '@/api/menuManger'
export default {
  data() {
    return {
      menuList: [],
      menuProps: {
        children: 'children',
        label: 'title'
      },
      formLabelWidth: '130px',
      roleForm: {},
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      roleList: [],
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在2  到 20 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],

      }
    }
  },
  methods: {
    getAllMenu() {
      menuApi.getAllMenu().then(response => {
        this.menuList = response.data;
      });
    }
    ,
    getRoleList() {
      roleApi.getRoleList(this.searchModel).then(response => {
        this.roleList = response.data.rows;
        this.total = response.data.total;
      });

    },
    saveRole() {
      this.$refs.roleFormRef.validate((valid) => {
        if (valid) {
          let checkedKeys = this.$refs.menuRef.getCheckedKeys();
          let halfCheckedKeys = this.$refs.menuRef.getHalfCheckedKeys();
          this.roleForm.menuIdList = checkedKeys.concat(halfCheckedKeys);

          //提交给后台
          roleApi.saveRole(this.roleForm).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            });
            this.dialogFormVisible = false;
            this.getRoleList();

          });
        }
        else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    clearForm() {
      this.roleForm = {};
      this.$refs.roleFormRef.clearValidate();
      // this.$refs.menuRef.setCheckKeys([]);
    },
    openEditUI(id) {
      if (id == null) {
        this.title = '新增角色';
      }
      else {
        this.title = '修改角色';
        //根据id查询角色数据
        roleApi.getRoleById(id).then(response => {
          this.roleForm = response.data;
          // this.$refs.menuRef.setCheckKeys(response.data.menuIdList);
        });
      }
      this.dialogFormVisible = true;
    },

    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getRoleList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getRoleList();
    },
    deleteRole(role) {
      this.$confirm(`您确认删除用户${role.roleName}?`, '此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // roleApi.deleteRoleByID(role.roleId).then(response => {
        //   this.$message({
        //     type: 'success',
        //     message: response.message
        //   });
        //   this.getRoleList()
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!'
        });
      });
    }


  },
  created() {
    this.getRoleList();
    this.getAllMenu();
  },

};

</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
</style>