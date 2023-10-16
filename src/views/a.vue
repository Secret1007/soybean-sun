<template>
  <div>111</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { testErrorMessage } from "../service/api";

const a = () => {
  console.log(window.$message, "<<<");
};
onMounted(() => {
  a();
  testErrorMessage();
});
</script>

<style scoped></style>
