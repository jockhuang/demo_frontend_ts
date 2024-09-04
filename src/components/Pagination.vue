<template>
  <div class="demo-pagination-block-right">
    <el-pagination
        :current-page="index"
        :page-size="mySize"
        :page-sizes="[5, 10, 20,50,100]"
        :total="count"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
    />
  </div>

</template>
<script lang="ts" setup>



const index = defineModel('index')
const mySize = defineModel('mySize')
const count = defineModel('count')
function handleCurrentChange(goToPage) {
  if (goToPage == index.value) return
  index.value = goToPage
}

function handleSizeChange(newPageSize) {
  if (newPageSize === mySize.value) return
  mySize.value = newPageSize
}
</script>

<style scoped>
.demo-pagination-block-right {
  text-align: right;
}
</style>
