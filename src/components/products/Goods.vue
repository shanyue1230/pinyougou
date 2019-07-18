<template>
  <div class="goods">
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table :data="goodList">
      <el-table-column type="index" :index="indexMethod" width="50"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name" width="400"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot="{ row }">
          {{row.add_time | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
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
export default {
  data () {
    return {
      goodList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    }
  },
  created () {
    this.getGoodList()
  },
  methods: {
    async getGoodList () {
      const res = await this.axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      const { meta, data } = res
      console.log(res)
      if (meta.status === 200) {
        this.goodList = data.goods
        this.total = data.total
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getGoodList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodList()
    },
    indexMethod (index) {
      return (this.pagenum - 1) * this.pagesize + index + 1
    }
  }
}
</script>

<style>

</style>
