<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue';

const openManage = () => {
  chrome.tabs.create({ url: 'manage.html' });
}
</script>

<template>
  <div>
    <button @click="openManage">click me</button>
  </div>
  <HelloWorld msg="Please Smile" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #54bc4ae0);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
