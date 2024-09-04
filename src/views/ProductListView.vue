<template>


  <div>
    <h3>Product List
      <q-btn color="primary" label="Add Product" @click="routeToAddProduct" />
    </h3>

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