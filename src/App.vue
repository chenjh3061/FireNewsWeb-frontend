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
    max-width: 80vw;
    margin: 0 auto;

a-layout-content {
    min-height: 280px;
}
}

</style>
