<template>


  <div>
    <h1>Product List
      <q-btn color="primary" label="Add Product" @click="routeToAddProduct" />
    </h1>

    <ProductList/>
  </div>
</template>
<script lang="ts" setup>
import ProductList from '../components/ProductList.vue'
import {useRouter} from "vue-router";

const router = useRouter()

function routeToAddProduct() {
  router.push({name: 'AddProduct'})
}
</script>