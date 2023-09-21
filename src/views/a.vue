<template>
  <div>111</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const a = () => {
  console.log(window.$message, "<<<");
};
onMounted(() => {
  a();
});
</script>

<style scoped></style>
