<template>
  <div class="categories">
    <el-button type="success" plain>添加分类</el-button>
    <el-table :data="categoryList">
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
      total: 0
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
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
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    }
  }
}
</script>

<style>

</style>
