<template>
  <div>
    <h1 class="text-3xl font-bold bg-red-500">Hello World</h1>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script setup>
const handleClick = () => {
  console.log("Button clicked");
};
</script>
