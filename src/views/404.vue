<template>
    <el-row class="container" type="flex">
      <el-col :span="24">
        <h1 class="h1">Whoops !!!</h1>
        <p class="p">Something went wrong.</p>
        <p class="p">Please correct a right path.</p>
      </el-col>
    </el-row>
</template>

<style scoped>
  .container {
    display: inline-block;
    background: #00AFF9 url(https://cbwconline.com/IMG/Codepen/Unplugged.png) center/cover no-repeat;
    height: 100vh;
    color: white;
    width: 100%;
  }

  .h1 {
    margin: .8em 3rem;
    font-size: 5rem;
  }

  .p {
    display: inline-block;
    margin: .2em 3rem;
    font-size: 3rem;
  }

</style>
