import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Quasar,Notify,Dialog } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(router)
app.use(Quasar, {
    config: {
        dark: true/* look at QuasarConfOptions from the API card */
    },
    plugins: {Notify,Dialog}, // import Quasar plugins and add here
})
app.mount('#app')
