<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/DemoHeader.vue'
import Footer from './components/DemoFooter.vue'
</script>

<template>
  <div class="q-pa-md">
    <q-layout view="lHh lpr lFf"  class="shadow-2 rounded-borders">
      <Header/>
      <Footer/>
      <q-page-container>
        <RouterView/>
      </q-page-container>
    </q-layout>
  </div>
</template>
