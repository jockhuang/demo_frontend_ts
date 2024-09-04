<template>
  <div class="q-pa-md">
    <q-table
        ref="tableRef" v-model:pagination="pagination"
        :columns="columns"
        :filter="pagination.filter"
        :filter-method="searchData"
        :loading="loading"
        :rows="apiData.data.items"
        :rows-per-page-options="[3,5,10,20,50]"
        bordered
        column-sort-order="ad"
        flat
        row-key="id"
        title="Products"
        @request="onRequest"

    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="200" v-model="pagination.filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-isRelease="bodyProps">
        <q-td :props="bodyProps">
          <q-toggle v-model="bodyProps.value" disable/>
        </q-td>
      </template>
      <template v-slot:body-cell-operations="props">
        <q-td :props="props">
          <q-btn icon="mode_edit" @click="handleEdit(props.row.id)"></q-btn>
          <q-btn icon="delete" @click="handleDelete(props.row.id)"></q-btn>
        </q-td>
      </template>
    </q-table>

  </div>
</template>
<script lang="ts" setup>
import api from "@/common/api"
import type {APIResponse, Product, QueryConfig, QueryResult} from "@/common/api"
import {onMounted, reactive, watch,ref} from 'vue'
import {useRouter} from 'vue-router'
import {date, Notify, useTimeout,Dialog} from 'quasar'
import type { QTableColumn, QTableProps} from 'quasar'
import formatDate = date.formatDate;

const router = useRouter()
const loading = ref(false)
const tableRef = ref()
const props = defineProps({
  mySize: {
    default: 10,
    type: Number
  }
})
const columns: QTableColumn[] = [
  { name: 'id', required: true, label: 'ID', align: 'left', field: 'id', sortable: true},
  { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
  { name: 'description', label: 'Description', field: 'description', sortable: true },
  { name: 'price', label: 'Price', field: 'price', sortable: true },
  { name: 'isRelease', label: 'Released', field: 'isRelease', sortable: true },
  { name: 'createDate', label: 'Create Date', field: 'createDate', sortable: true, format: (val) =>formatDate(val,'YYYY-MM-DD HH:mm:ss')},
  { name: 'updateDate', label: 'Update Date', field: 'updateDate', sortable: true, format: (val) =>formatDate(val,'YYYY-MM-DD HH:mm:ss')},
  { name: 'operations', label: 'Operations', field: ''}
]
const mySize = ref(props.mySize)
const pagination = ref({
  sortBy: 'id',
  descending: true,
  page: 1,
  rowsPerPage: mySize.value,
  rowsNumber: 0

})

const queryParams = reactive<QueryConfig>({
  "isDesc": pagination.value?.descending,
  "orderBy": pagination.value?.sortBy?pagination.value?.sortBy:"id",
  "pageIndex": pagination.value?.page,
  "pageSize": pagination.value?.rowsPerPage,
  "search": "",
})
const { registerTimeout } = useTimeout()
const apiData = reactive<APIResponse<QueryResult<Product>>>({
  code: 0,
  data: {
    items: [],
    totalPages: 0,
    totalCount: 0,
    pageIndex: 0,
    pageSize: 0,
  },
  message: ''
})

function onRequest (tableProps: Parameters<NonNullable<QTableProps['onRequest']>>[0]) {
  registerTimeout(() => {
    queryParams.pageSize = tableProps.pagination.rowsPerPage
    queryParams.pageIndex = tableProps.pagination.page
    queryParams.orderBy = tableProps.pagination.sortBy
    queryParams.isDesc = tableProps.pagination.descending
    queryParams.search = tableProps.filter
    pagination.value.sortBy = tableProps.pagination.sortBy
    pagination.value.descending = tableProps.pagination.descending
  }, 500);
}

function fetchData() {
  loading.value = true
  console.log("fetchData:", queryParams)
  api.products.list(queryParams).then(data => {
    console.log("response:", data)
    apiData.data = data.data
    apiData.code = data.code
    apiData.message = data.message
    pagination.value.page = apiData.data.pageIndex
    pagination.value.rowsPerPage = apiData.data.pageSize
    pagination.value.rowsNumber = apiData.data.totalCount
  })
  loading.value = false
}

function handleDelete(id: string) {
  Dialog.create({
    title: 'Caution',
    message: 'Are you sure to delete this product?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    api.products.delete(id).then(response => {
      console.log(response.data)
      if (response.code == 0) {
        Notify.create({
          message:'Congrats, this product has been removed!',
          color: 'green',
          position: 'top'
        })

        fetchData()
      } else {
        Notify.create({
          message:response.message,
          color: 'red',
          position: 'top'
        })
      }
    })
  })

}

function handleEdit(id: string) {
  console.log("handleEdit", id)
  router.push({name: 'EditProduct', params: {slug: id}})
}

watch(
    () => {
      queryParams.pageSize, queryParams.pageIndex , queryParams.isDesc, queryParams.orderBy,queryParams.search
    },
    () => {
      fetchData()
    },
    {deep: true}
)

function searchData(rows:readonly any[], terms:any) {
  queryParams.search = terms.search
  registerTimeout(() => {
    fetchData();
  }, 700);
  return rows
}

onMounted(() => {
  fetchData()
})
</script>

