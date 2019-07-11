<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索栏 -->
    <div style="margin: 15px 0;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
      </el-input>
      <el-button style="margin-left: 30px;" type="success" plain>添加用户</el-button>
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
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template v-slot:default="{ row }">
          <el-button type="primary" icon="el-icon-edit" plain circle size="small"></el-button>
          <el-button @click="deleteUser(row.id)" type="danger" icon="el-icon-delete" plain circle size="small"></el-button>
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
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      // 发送ajax请求，获取数据
      // axios.get('url', {
      //   params
      // })
      this.axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
        // 请求头
        // 基于token认证，必须带上token
        // headers: {
        //   Authorization: localStorage.getItem('token')
        // }
      }).then(res => {
        const { meta, data } = res
        // 如果数据成功，设置给tableData
        if (meta.status === 200) {
          this.tableData = data.users
          this.total = data.total
        }
      })
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
    deleteUser (id) {
      // console.log(id)
      this.$confirm('亲,你确定要删除吗?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        // 发送ajax请求
        this.axios.delete(`users/${id}`).then(res => {
          const { meta } = res
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
        })
      }).catch(() => {
        this.$message('操作取消')
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.el-breadcrumb {
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
  background-color: #ddd;
}

.el-input {
  width: 300px;
}

</style>
