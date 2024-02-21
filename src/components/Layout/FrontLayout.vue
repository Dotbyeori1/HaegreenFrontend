<template>
  <FrontFragments>
    <template v-slot:frontHeader></template>
    <template v-slot:content>
      <router-view></router-view>
    </template>
    <template v-slot:frontFooter></template>
  </FrontFragments>

</template>

<script>
import FrontFragments from "@/components/Layout/FrontFragments.vue";

export default {
  name: "FrontLayout",
  components: {FrontFragments}
}
</script>

<style scoped>

</style>