<template>
    <div id="app">
        <GlobalHeader/>
        <router-view/>
        <GlobalFooter/>
    </div>
</template>

<script lang="ts" setup>
import GlobalHeader from "./components/GlobalHeader.vue";
import GlobalFooter from "./components/GlobalFooter.vue";
</script>
<style scoped>
#app {

}

</style>
