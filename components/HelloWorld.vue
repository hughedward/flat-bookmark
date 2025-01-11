<script lang="ts" setup>
import { ref } from 'vue';

defineProps({
  msg: String,
});

const goToManagePage = () => {
  window.location.href = 'chrome-extension://chromePluginWXT01/entrypoints/popup/index.html';
};

// const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>
  <h2>you need to create a home-dir-bookmark named qyb first</h2>

  <!-- <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div> -->

  <!-- <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the WXT and Vue logos to learn more</p> -->
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
