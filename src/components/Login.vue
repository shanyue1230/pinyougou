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
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" status-icon>
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单数据
      form: {
        username: '',
        password: ''
      },
      // 表单校验规则
      rules: {
        username: [
          // required: 非空规则
          // message: 提示信息
          // trigger: 触发的方式  blur  change
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      // 获取表单组件，调用方法
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate(isValid => {
        if (!isValid) return false
        // 校验成功，发送ajax请求
        this.axios.post('login', this.form).then(res => {
          // 解构
          // console.log(res.data)
          // 只要登录不成功，data就是一个null，不能从data中解构出token
          const { meta: { status, msg }, data } = res
          if (status === 200) {
            // 给一个提示消息
            this.$message({
              message: '登录成功',
              type: 'success',
              duration: 1000
            })
            // 存储token
            localStorage.setItem('token', data.token)
            // 跳转到首页组件
            this.$router.push({ name: 'index' })
          } else {
            this.$message.error(msg)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px;
    border-radius: 20px;
    position: relative;
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -75px;
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button:last-child {
      margin-left: 80px;
    }
  }
}
</style>
