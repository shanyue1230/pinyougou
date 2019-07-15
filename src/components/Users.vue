<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索栏 -->
    <div style="margin: 15px 0;">
      <el-input style="width: 300px;" placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
      </el-input>
      <el-button style="margin-left: 30px;" type="success" @click="showAddDialog" plain>添加用户</el-button>
    </div>
    <!-- 表格 -->
    <!--
      el-table: 整个表格组件
        :data="tableData": 需要传递数据给表格显示

        el-table-column： 表格的一列
          label: 表头
          prop="date"： 对应要显示的数据
          width="180"： 某列占用的宽度，不支持百分比
    -->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="用户状态">
        <template v-slot:default="{ row }">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template v-slot:default="{ row }">
          <el-button @click="showEditDialog(row)" type="primary" icon="el-icon-edit" plain circle size="small"></el-button>
          <el-button @click="deleteUser(row.id, $event)" type="danger" icon="el-icon-delete" plain circle size="small"></el-button>
          <el-button type="success" icon="el-icon-edit" plain round size="small">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--
      size-change:修改每页的条数触发  pagesize
      current-change：修改当前页的时候触发  pagenum

      current-page: 当前页
      page-size 每页的多少条
      total： 总条数
      page-sizes： 修改当前页条数的数量
      layout="total, sizes, prev, pager, next, jumper"
     -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--
      添加用户对话框
        dialogVisible： 控制对话框是否显示
    -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="35%">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入用户密码" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入用户邮箱" v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入用户手机" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="35%">
      <el-form ref="editForm" :rules="rules" status-icon :model="editForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入用户邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入用户手机" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      tableData: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      // 添加用户的对话框，默认是隐藏
      addDialogVisible: false,
      // 添加的表单对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单校验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '用户名长度必须是3-12位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度必须是6-12位', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入有效的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        id: '',
        email: '',
        mobile: '',
        username: ''
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { meta, data } = await this.axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // 如果数据成功，设置给tableData
      if (meta.status === 200) {
        this.tableData = data.users
        this.total = data.total
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      // 只要修改了每页的条数，从第一页开始显示
      this.pagenum = 1
      this.getUserList()
    },
    // 修改了当前页
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    queryUser () {
      this.pagenum = 1
      this.getUserList()
    },
    async deleteUser (id, e) {
      // 获取到了点击的那个按钮
      // console.log(e.target)
      console.log(e)
      try {
        // 等待点击确定按钮
        await this.$confirm('亲,你确定要删除吗?', '温馨提示', {
          type: 'warning'
        })
        // 等待ajax成功结果
        const { meta } = await this.axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          // 判断，如果当前页就剩下一条，应该让pagenum -1
          if (this.tableData.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          // 重新渲染
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message('取消删除')
      }
      // 失去焦点
      e.target.blur()
    },
    async changeState ({ id, mg_state: state }) {
      const res = await this.axios.put(`users/${id}/state/${state}`)
      const { status, msg } = res.meta
      if (status === 200) {
        // 成功
        this.$message.success('修改状态成功')
        // 要不要重新渲染
        this.getUserList()
      } else {
        this.$message.error(msg)
      }
    },
    showAddDialog () {
      this.addDialogVisible = true
    },
    async addUser () {
      try {
        await this.$refs.addForm.validate()
        // 发送ajax请求
        const res = await this.axios.post('users', this.addForm)
        const { status, msg } = res.meta
        if (status === 201) {
          // 提示消息
          this.$message.success('添加用户成功')

          // 重置表单
          this.$refs.addForm.resetFields()

          // 隐藏对话框
          this.addDialogVisible = false

          // 重新渲染
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(msg)
        }
      } catch {
        // e:代表的异常信息
        return false
      }
    },
    showEditDialog (user) {
      this.editDialogVisible = true
      // this.editForm.id = user.id
      // this.editForm.email = user.email
      // this.editForm.mobile = user.mobile
      // this.editForm.username = user.username
      this.editForm = { ...user }
      // console.log(this.editForm)
    },
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        const { id, email, mobile } = this.editForm
        // 发送ajax请求，修改用户
        const res = await this.axios.put(`users/${id}`, { email, mobile })
        const { status, msg } = res.meta
        if (status === 200) {
          this.$message.success('修改成功')
          // 重置表单
          this.$refs.editForm.resetFields()
          // 关闭模态框
          this.editDialogVisible = false
          // 重新渲染
          this.getUserList()
        } else {
          this.$message.error(msg)
        }
      } catch (e) {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
