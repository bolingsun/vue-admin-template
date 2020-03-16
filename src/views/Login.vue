<template>
  <div>
    <el-form
      :rules="rules"
      :model="loginForm"
      ref="loginForm"
      label-width="60px"
    >
      <el-form-item label="账号" prop="username" style="position:relative">
        <el-input
          type="text"
          v-model="loginForm.username"
          @keyup.enter.native="goToPwdInput"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input
          type="password"
          v-model="loginForm.pwd"
          @keyup.enter.native="handleLogin"
          ref="pwd"
        ></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleLogin" :loading="loading"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
// import { login } from "@/api/user";
export default {
  name: "Login",
  data() {
    // username 验证
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    // pwd 验证
    const validatePwd = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      loginForm: {
        username: "admin",
        pwd: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateUsername },
          { required: true, trigger: "change", validator: validateUsername }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { required: true, trigger: "blur", validator: validatePwd },
          { required: true, trigger: "change", validator: validatePwd }
        ]
      }
    };
  },
  methods: {
    // 登录操作
    onLogin() {
      // this.$refs.pwd.$el.getElementsByTagName("input")[0].blur();
      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true;
      //     this.$store
      //       .dispatch("user/login", this.loginForm)
      //       .then(() => {
      //         this.$message({
      //           message: "登录成功",
      //           type: "success"
      //         });
      //         this.$router.push({ path: "/" });
      //       })
      //       .catch(() => {
      //         this.loading = false;
      //       });
      //   } else {
      //     return false;
      //   }
      // });
    },
    handleLogin() {
      if (this.$refs.loginForm.validate()) {
        // console.log("通过");
        let loginForm = {
          username: this.loginForm.username,
          password: this.loginForm.pwd
        };
        this.$store
          .dispatch("user/login", loginForm)
          .then(() => {
            this.$message({
              type: "success",
              message: "登录成功"
            });
            this.$router.push({
              path: "/"
            });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        return false;
      }
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>
