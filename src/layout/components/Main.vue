<template>
  <div class="layout-main">
    <slot></slot>
  </div>
</template>

<script setup name="LayoutMain"></script>

<style lang="scss" scoped>
.layout-main{
  background-color: var(--main-bg);
}
</style>
