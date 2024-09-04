<template>
  <div>
    <h3>Mail List
      <q-btn color="primary" label="Add Subscription" @click="routeToAddSubscriptions" />
    </h3>
    <MailList/>
  </div>
</template>
<script lang="ts" setup>
import MailList from '../components/SubscriptionList.vue'
import {useRouter} from "vue-router";

const router = useRouter()

function routeToAddSubscriptions() {
  router.push({name: 'AddSubscription'})
}
</script>