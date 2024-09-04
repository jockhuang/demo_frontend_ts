<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/DemoHeader.vue'
import Footer from './components/DemoFooter.vue'
</script>

<template>
  <div class="q-pa-md">
    <q-layout class="shadow-2 rounded-borders test">
      <Header/>
      <Footer/>
      <q-page-container>
        <RouterView/>
      </q-page-container>
    </q-layout>
  </div>
</template>
<style scoped>
.test {
  width: calc(75vw);
}
</style>/