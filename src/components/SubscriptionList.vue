<template>
  <div class="q-pa-md">
    <q-table
        flat bordered
        column-sort-order="da"
        ref="tableRef"
        title="Subscription List"
        :rows="apiData.data.items"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5,10,20,50]"
        v-model:pagination="pagination"
        :loading="loading"
        :filter="pagination.filter"
        :filter-method="searchData"
        @request="onRequest"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="200" v-model="pagination.filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-operations="props">
        <q-td :props="props">
          <q-btn icon="delete" @click="handleDelete(props.row.id)"></q-btn>
        </q-td>
      </template>
    </q-table>

  </div>
</template>
<script lang="ts" setup>
import api from "@/common/api"
import type {APIResponse, QueryConfig, QueryResult, Subscription} from "@/common/api"
import {onMounted, reactive, ref, toRefs, watch,} from 'vue'
import {date, Dialog, Notify,useTimeout} from "quasar"
import type {QTableColumn, QTableProps} from "quasar"
import formatDate = date.formatDate;

const props = defineProps({
  mySize: {
    default: 10,
    type: Number
  }
})
let {mySize} = toRefs(props)
const columns: QTableColumn[] = [
  { name: 'id', required: true, label: 'ID', align: 'left', field: 'id', sortable: true},
  { name: 'email', align: 'center', label: 'Email', field: 'email', sortable: true },
  { name: 'description', label: 'Description', field: 'description', sortable: true },
  { name: 'createDate', label: 'Create Date', field: 'createDate', sortable: true, format: (val, row) =>formatDate(val,'YYYY-MM-DD HH:mm:ss')},
  { name: 'operations', label: 'Operations', field: ''}

]
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

const loading = ref(false)
let apiData = reactive<APIResponse<QueryResult<Subscription>>>({
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
  api.subscriptions.list(queryParams).then(data => {
    console.log("subscriptions:", data)
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
    message: 'Are you sure to delete this?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    api.subscriptions.delete(id).then(response => {
      console.log(response.data)
      if (response.code == 0) {
        Notify.create({
          message:'Congrats, this mail has been removed!',
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


watch(
    () => {
      queryParams.pageSize, queryParams.pageIndex , queryParams.isDesc, queryParams.orderBy,queryParams.search
    },
    () => {
      fetchData()
    },
    {deep: true}
)

function searchData(rows: any[], terms:any) {
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