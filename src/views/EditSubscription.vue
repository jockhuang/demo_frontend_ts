<template>
  <div>
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" to="/"/>
        <q-breadcrumbs-el label="Subscriptions" icon="widgets" to="/subscriptions" />
        <q-breadcrumbs-el label="Add Subscription" />
      </q-breadcrumbs>
    </div>
    <br>
    <q-page class="padding">
      <q-card class="my-card text-white">
        <Form :validation-schema="schema">
          <q-card-section>
            <div class="text-h6">Add Subscription</div>
            <div class="text-subtitle1">
            </div>
          </q-card-section>
          <q-separator inset />
          <q-card-section class="column q-gutter-md">
            <Field name="email" type="text" v-slot="{field}">
              <q-input outlined id="email" v-model="subscription.email" v-bind="field" label="Email" />
            </Field>
            <error-message name="email"/>
            <Field name="description" type="text" v-slot="{field}">
              <q-input outlined id="description"  v-model="subscription.description" v-bind="field" label="Description" />
            </Field>
            <error-message name="description"/>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat @click="$router.push({name:'Subscriptions'})">Cancel</q-btn>
            <q-btn color="primary" type="button" @click="submitForm">Add</q-btn>
          </q-card-actions>
        </Form>
      </q-card>
    </q-page>
  </div>
</template>

<script lang="ts" setup>
import api, {Subscription} from "@/common/api"
import { reactive} from 'vue'
import { useRouter} from 'vue-router'
import { Notify } from 'quasar'
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
const router = useRouter()


const subscription = reactive<Subscription>({
  email: '',
  description: '',

})

const schema = yup.object().shape({
  email: yup.string().required().email().min(3).max(255),
  description: yup.string().max(255),
});




const submitForm =  () => {
  try {
    schema.validateSync(subscription)
    api.subscriptions.add(subscription).then(response => {
      console.log(response.data)
      if (response.code == 0) {
        Notify.create({
          message:'Congrats, this mail has been added successfully!',
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

    router.push({name: 'Subscriptions'})
  } catch (error) {
    console.log("error",error);
    Notify.create({
      message:"Oops, Please check the input."+error,
      color: 'red',
      position: 'top'
    })
  }

}


</script>