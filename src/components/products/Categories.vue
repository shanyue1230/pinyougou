<template>
  <div class="categories">
    <el-button type="success" plain @click="showAdd">添加分类</el-button>
    <el-table :data="categoryList" v-loading="loading">
      <!-- tree-key: 每个对象的id -->
      <!-- parent-key 父节点的id -->
      <!-- level-key -->
      <el-table-tree-column tree-key="cat_id" folder-icon="" parent-key="cat_pid" level-key="cat_level" label="分类名称" prop="cat_name" :indent-size="20"></el-table-tree-column>
      <el-table-column label="是否有效">
        <template v-slot="{ row }">
          {{ row.cat_deleted ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain circle icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" plain circle icon="el-icon-delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="35%">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px" status-icon>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="请输入分类名称" v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            clearable
            v-model="addForm.cat_pid"
            :options="options"
            :props="props">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// https://github.com/foolishchow/element-tree-grid
export default {
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      loading: true,
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: [],
        cat_level: 0
      },
      rules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: ['change', 'blur'] }
        ]
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      this.loading = true
      const res = await this.axios.get(`categories`, {
        params: {
          // 获取3级的分类
          type: 3,
          // 分页参数
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      const { meta, data } = res
      if (meta.status === 200) {
        this.categoryList = data.result
        this.total = data.total
        console.log(this.categoryList)
      }

      // 使用一个延时器，假装很卡，让客户花钱优化
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    },
    async showAdd () {
      this.addDialogVisible = true

      // 发送ajax请求，获取2级的分类数据
      const res = await this.axios.get(`categories?type=2`)
      console.log(res)
      const { meta, data } = res
      if (meta.status === 200) {
        this.options = data
      }
    },
    async addCategory () {
      try {
        await this.$refs.addForm.validate()
        // 发送ajax请求
        const res = await this.axios.post(`categories`, {
          cat_name: this.addForm.cat_name,
          cat_level: this.addForm.cat_pid.length,
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0
        })
        const { status, msg } = res.meta
        if (status === 201) {
          this.$message.success(msg)
          // 重置表单
          this.$refs.addForm.resetFields()
          // 隐藏对话框
          this.addDialogVisible = false
          this.getCategoryList()
        } else {
          this.$message.error(msg)
        }
      } catch {}
    }
  }
}
</script>

<style>

</style>
