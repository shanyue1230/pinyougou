<template>
  <el-container class="index">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        欢迎你，xxx
        <a @click="logout" href="javascript:;">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!--
          el-menu: 整个导航菜单组件
            default-active="2" 设置默认激活的导航

          el-submenu:
            template:子菜单的内容

          el-menu-item-group： 菜单项的分组

          el-menu-item：每一个菜单项
          default-active="1-1"
         -->
        <el-menu
          :default-active="active"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router>
          <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.path">
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.path">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  computed: {
    active () {
      return this.$route.path.slice(1)
    }
  },
  async created () {
    // console.log(this.$route)
    const res = await this.axios.get('menus')
    if (res.meta.status === 200) {
      this.menuList = res.data
      // console.log(this.menuList)
    }
  },
  methods: {
    logout () {
      // 给用户一个提示
      // 参数1：提示内容
      this.$confirm('你确定要退出吗?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        // 点击确定了
        localStorage.removeItem('token')
        // 跳转到登录页
        this.$router.push('/login')
        // 提示
        this.$message.success('退出成功')
      }).catch(() => {
        this.$message('操作取消')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// 如何给style标签添加了scoped，表示style标签中的样式仅仅在当前组件中生效，不会影响到其他组件
// 推荐每个单文件组件都加上scoped属性。
// 原理： 如果给某个单文件组件的style添加了scoped属性
// 1. 会给当前组件中所有的元素都添加一个随机的自定义属性
// 2. 会给当前组件中的style中的所有的样式都加上一个属性选择器，属性选择器和添加的自定义属性是匹配
.index {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    display: flex;
    .logo,
    .logout {
      width: 180px;
    }
    .logo {
      background: url('../assets/logo.png') no-repeat center center/contain;
    }
    .title {
      flex: 1;
      h1 {
        color: #fff;
        font-size: 30px;
        text-align: center;
        height: 60px;
        line-height: 60px;
      }
    }
    .logout {
      height: 60px;
      line-height: 60px;
      font-weight: 700;
      text-align: right;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #eaeef1;
  }
}
</style>
