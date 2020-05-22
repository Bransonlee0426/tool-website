<template>
    <el-row class="container" type="flex" justify="center" align="top" v-loading="loading">
        <div class="login-frame">
            <el-col>
                <h3 class="title">Nu² Admin</h3>
            </el-col>
            <el-col>
                <el-input
                    class="input"
                    v-model="login.variables.account"
                    placeholder="請輸入帳號"
                    @keyup.enter.native="submit"></el-input>
            </el-col>
            <el-col>
                <el-input
                    class="input"
                    v-model="login.variables.password"
                    placeholder="請輸入密碼"
                    show-password
                    @keyup.enter.native="submit"></el-input>
            </el-col>
            <el-col>
                <el-button class="btn" type="primary" @click="submit">登入</el-button>
            </el-col>
        </div>
    </el-row>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      login: {
        client: 'admin',
        name: this.$mutation.login,
        variables: {
          account: '',
          password: '',
        },
      },
    };
  },
  methods: {
    submit() {
      this.loading = true;
      this.$_mutationApi(this.login,
        (res) => {
          if (res.data.Login) {
            const { token } = res.data.Login;
            const { account } = res.data.Login;
            this.loading = false;
            localStorage.setItem('admin-token', token);
            localStorage.setItem('user-account', account);
            this.$router.push({ name: 'dishData' });
          }
        },
        () => {
          this.loading = false;
          this.$_alert('error', 'loginErr');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.input{
    width: 100%;
    margin-top: 15px;
}
.container{
    background-color: #3C3C3C;
    height: 100vh;
    .login-frame{
        width: 450px;
        margin-top: 150px;
        .title{
            color:#F0F0F0;
            margin-left: auto;
            margin-right: auto;
            width: 150px;
            font-size: 1.8rem;
            margin-bottom: 20px;
        }
        .btn{
            width: 100%;
            margin-top: 15px;
        }
    }

}

</style>
