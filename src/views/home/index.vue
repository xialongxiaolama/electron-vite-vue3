<template>
  <div class="home">
    <SvgIcon name="svg-github" />
    <el-button type="primary" size="default" @click="pickApp">{{ $t('message.hello') }}</el-button>
    
  </div>
</template>

<script setup name="home">

const name = ref("home");
function pickApp(){
  console.log("1331",name);
}
</script>

<style lang="scss" scoped>
.home{
  height: 100%;
}
</style>
