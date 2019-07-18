<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <span v-show="row.children.length === 0">该角色没有更多的权限信息</span>
          <!-- 存放一级权限 -->
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag @close="delRight(row, l1.id)" closable>{{l1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 存放二级权限 -->
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag @close="delRight(row, l2.id)" closable type="success">{{l2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 存放三级权限 -->
                  <el-tag
                    @close="delRight(row, l3.id)"
                    class="l3"
                    closable
                    type="warning"
                    v-for="l3 in l2.children"
                    :key="l3.id"
                  >{{l3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button @click="showEditDialog(row)" type="primary" icon="el-icon-edit" plain circle size="small"></el-button>
          <el-button @click="delRole(row, $event)" type="danger" icon="el-icon-delete" plain circle size="small"></el-button>
          <el-button
            @click="showAssignDialog(row)"
            type="success"
            icon="el-icon-edit"
            plain
            round
            size="small"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="assignVisible" width="35%">
      <!-- 树形菜单控件 -->
      <el-tree
        ref="tree"
        :data="rightList"
        :props="props"
        show-checkbox
        default-expand-all
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加或者修改的对话框 -->
    <el-dialog :title="title" :visible.sync="editVisible" width="35%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      assignVisible: false,
      rightList: [],
      // 指定树形菜单如何显示
      props: {
        children: 'children',
        label: 'authName'
      },
      // 当前的角色id
      roleId: '',
      editVisible: false,
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['change', 'blur'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  created () {
    this.getRoleList()
  },
  computed: {
    title () {
      return this.form.id ? '修改角色' : '添加角色'
    }
  },
  methods: {
    async getRoleList () {
      const { meta, data } = await this.axios.get('roles')
      if (meta.status === 200) {
        this.roleList = data
      }
    },
    /*
      需求：删除某个角色的某个权限
        角色id和权限id

      发送ajax请求，需要把角色id和权限id给后台，后台就会删除掉对应的权限

      成功了该如何处理：
        1. getRoleList() 重新获取所有的角色列表（包含了权限列表）
          原本展开的列就合起来。
        2. 不去重新渲染所有的角色信息， 重新渲染当前角色的权限信息  后台会把删除后当前角色的最新的权限信息返回。
          只需要修改 row.children属性
    */
    async delRight (row, rightId) {
      // console.log(roleId, rightId)
      // 发送ajax请求
      const res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      console.log(res)
      const { status, msg } = res.meta
      if (status === 200) {
        this.$message.success(msg)
        // 成功,没有必要重新获取整个角色列表，
        // 当前角色的children(权限)发生了改变

        // this.getRoleList()
        // res.data是最新的权限信息
        row.children = res.data
      } else {
        this.$message.error(msg)
      }
    },
    async showAssignDialog (row) {
      // 把角色的id存储起来
      this.roleId = row.id
      this.assignVisible = true

      // 发送ajax请求，获取所有的权限信息
      const { meta, data } = await this.axios.get('rights/tree')
      if (meta.status === 200) {
        this.rightList = data
        console.log(this.rightList)
      }

      // 让拥有的权限默认选中
      // 根据key值默认渲染  key设置为了id
      // 获取到当前角色中所有的权限（只要3级权限），放到一个数组里面去
      // console.log(row)
      let ids = []
      // 使用ids数组把所有的3级的权限的id存储起来
      row.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    async assignRight () {
      // 获取到所有的选中的权限id
      let ids = this.$refs.tree.getCheckedKeys()
      // 获取所有的半选中的id
      let halfIds = this.$refs.tree.getHalfCheckedKeys()
      let rids = [...ids, ...halfIds].join()
      console.log(rids)
      console.log(this.roleId)
      const res = await this.axios.post(`roles/${this.roleId}/rights`, { rids })
      const { status, msg } = res.meta
      if (status === 200) {
        this.$message.success(msg)
        // 关闭对话框
        this.assignVisible = false
        // 重新渲染
        this.getRoleList()
      } else {
        this.$message.error(msg)
      }
    },
    async delRole (row, e) {
      try {
        // 弹出确认框
        await this.$confirm('你确定要删除该角色吗', '温馨提示', { type: 'warning' })
        // 发送ajax请求
        const res = await this.axios.delete(`roles/${row.id}`)
        const { status, msg } = res.meta
        if (status === 200) {
          // 成功提示
          this.$message.success(msg)
          // 重新渲染
          this.getRoleList()
        } else {
          this.$message.error(msg)
        }
      } catch {
        this.$message('取消删除')
      } finally {
        // 代码无论成功与否，finally都会执行
        // console.dir(e.target.nodeName)
        let current = e.target
        if (e.target.nodeName === 'I') {
          current = e.target.parentNode
        }
        // console.log(current)
        current.blur()
      }
    },
    showAddDialog () {
      this.editVisible = true
      this.form.id = ''
      this.form.roleName = ''
      this.form.roleDesc = ''

      // 保证校验结果显示后才能清空
      this.$nextTick(() => {
        // 重置表单的校验规则
        this.$refs.form.clearValidate()
      }, 100)
    },
    showEditDialog (row) {
      this.editVisible = true
      this.form.id = row.id
      this.form.roleName = row.roleName
      this.form.roleDesc = row.roleDesc

      // 保证校验结果显示后才能清空
      this.$nextTick(() => {
        // 重置表单的校验规则
        this.$refs.form.clearValidate()
      }, 100)
    },
    async editRole () {
      // 校验功能
      try {
        await this.$refs.form.validate()
        // 发送ajax请求
        // 判断是添加还是修改
        // 请求方式 post     put
        // 请求地址：roles   roles/id
        // 响应状态: 200     201
        const { id } = this.form
        let method = id ? 'put' : 'post'
        let url = id ? `roles/${id}` : `roles`
        let code = id ? 200 : 201

        // const res = await this.axios({
        //   method: method,
        //   url: url,
        //   data: this.form
        // })

        const res = await this.axios[method](url, this.form)
        const { status, msg } = res.meta
        if (status === code) {
          this.$message.success(msg)
          // 关闭模态框
          this.editVisible = false
          // 重置表单
          this.$refs.form.resetFields()
          // 重新渲染
          this.getRoleList()
        } else {
          this.$message.error(msg)
        }
      } catch {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.roles {
  .l1 {
    padding: 5px 0;
    border-bottom: 1px dotted #ccc;
  }
  .l2 {
    margin-bottom: 5px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .l3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
