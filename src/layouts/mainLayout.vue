<template>
    <div class="content"></div>
</template>

<script setup lang="ts">
class Person {
    name:string;
    age:number;
    constructor (name:string,age:number) {
        this.name = name;
        this.age = age;
    }
    run () {
        console.log()
    }
}
</script>

<style scoped>
.content {
    width: 100%;
}
</style>