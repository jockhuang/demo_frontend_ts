<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Home" icon="home" to="/"/>
      <q-breadcrumbs-el label="Products" icon="widgets" to="/product" />
      <q-breadcrumbs-el :label="title" />
    </q-breadcrumbs>
  </div>
  <q-page class="padding">
    <q-card class="my-card text-white">
      <Form :validation-schema="schema">
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
          <div class="text-subtitle1">
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="column q-gutter-md">
          <Field name="name" type="text" v-slot="{field}">
            <q-input outlined id="name" v-model="product.name" v-bind="field" label="Product name" />
          </Field>
          <error-message name="name"/>

          <Field name="description" type="text" v-slot="{field}">
            <q-input outlined id="description"  v-model="product.description" v-bind="field" label="Product Description" />
          </Field>
          <error-message name="description"/>
          <Field name="price" type="text" v-slot="{field}">
          <q-input outlined id="price"  v-model="product.price" v-bind="field" label="Product price" />
          </Field>
          <error-message name="price"/>
          <Field name="imageURL" type="text" v-slot="{field}">
            <q-input outlined id="imageURL"  v-model="product.imageURL" v-bind="field" label="Product Image" />
          </Field>
          <ErrorMessage name="imageURL" />
          <q-toggle v-model="product.isRelease" label="Product Released" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat @click="$router.push({name:'Product'})">Cancel</q-btn>
          <q-btn color="primary" type="button" @click="submitForm">{{ title }}</q-btn>
        </q-card-actions>
      </Form>
    </q-card>
  </q-page>

</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import api, {Product} from "@/common/api"
import { Notify } from 'quasar'
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

const route = useRoute()
const router = useRouter()
const slug = computed<string>(() => route.params.slug as string)
const title = slug.value ? 'Update Product' : 'Add Product'
const product = reactive<Product>({
  name: '',
  description: '',
  isRelease: false,
  price: 0,
  imageURL: ''
})

const schema = yup.object().shape({
  name: yup.string().required().min(3).max(255),
  description: yup.string().max(255),
  price:yup.number().positive().integer(),
  imageURL:yup.string().max(255)
});

const submitForm =  () => {
  try {
    schema.validateSync(product)
    console.log(schema.isValid(product).then())
    console.log('submit!', slug, product)
    let responsePromise
    if (!slug.value) {
      responsePromise = api.products.add(product)
    } else {
      responsePromise = api.products.update(slug.value, product)
    }
    responsePromise.then(response => {
      console.log(response.data)
      if (response.code == 0) {
        Notify.create({
          message:'Congrats, this product has been added successfully!',
          color: 'green',
          position: 'top'
        })
      } else {
        Notify.create({
          message:response.message,
          color: 'red',
          position: 'top'
        })
      }
    })
    router.push('/product')
  } catch (error) {
    console.log("error",error);
    Notify.create({
      message:"Oops, Please check the input."+error,
      color: 'red',
      position: 'top'
    })
  }
}


function fetchProduct(slug: string) {
   api.products.details(slug).then(response => {
    if (response.code == 0) {
      product.name = response.data.name
      product.description = response.data.description
      product.price = response.data.price
      product.imageURL = response.data.imageURL
      product.isRelease = response.data.isRelease
    } else {
      Notify.create({
        message:response.message,
        color: 'red',
        position: 'top'
      })
    }
  })
}

onMounted( () => {
  if (slug.value)
    fetchProduct(slug.value)
})


</script>
