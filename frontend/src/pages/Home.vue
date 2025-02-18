<template>
  <div>
    <!-- Head section should not be in the template; it's managed by the main index.html -->
    <div id="app">
      <h1>{{ title }}</h1>
      <p>Welcome to the our web programming project, have fun and do your thang</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePage",
  data() {
    return {
      title: "Home", // Dynamic title displayed in the template
    };
  },
});
</script>

<style scoped>
/* Scoped styles for this component */
h1 {
  color: #007bff;
  text-align: center;
}

p {
  color: #555;
  text-align: center;
}
</style>