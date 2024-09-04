<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn flat round dense icon="menu" class="q-mr-sm" />
      <q-avatar>
        <img src="@/assets/logo.svg">
      </q-avatar>

      <q-toolbar-title>Demo</q-toolbar-title>

      <q-btn flat round dense icon="whatshot" />
    </q-toolbar>

    <q-tabs align="left" v-model="activeLink">
      <q-route-tab name="Home" label="Home" to="/" exact />
      <q-route-tab name="Product" label="Product"  to="/product" exact />
      <q-route-tab name="Subscriptions" label="Subscriptions"  to="/subscriptions" exact />
    </q-tabs>
  </q-header>

</template>

<script type='text/babel'>
export default {
  mounted: function () {
    console.log("router");
    console.log(this.$route.path);
    this.activeLink = window.location.pathname;
  },
  data() {
    return {
      activeLink: "/",
      menuRoutes: [
        {name: 'Home', path: '/'},
        {name: 'Product', path: '/product'},
        {name: 'Subscriptions', path: '/subscriptions'}
      ],
    };
  },
};
</script>