<template>
  <div id="app">
    <router-view></router-view> <!-- This is where all different views will be rendered -->
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>