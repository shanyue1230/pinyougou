<template>
  <div class="login">
    <!--
      el-form: 表单组件
        :model="form"： 传入一个对象，用于给表单元素双向绑定
        label-width="80px" 表单元素label的宽度
      el-form-item: 一个表单项
        label="活动名称"： 每个表单项的label
      el-input: 输入文本框组件
     -->
    <el-form :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style>

</style>
