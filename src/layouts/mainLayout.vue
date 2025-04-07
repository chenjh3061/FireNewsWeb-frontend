<!--
 * @Author: 俊宏 oncwnuLAeJWzo2Rk1De_oNwKmI9s@git.weixin.qq.com
 * @Date: 2025-01-17 22:06:28
 * @LastEditors: 俊宏 oncwnuLAeJWzo2Rk1De_oNwKmI9s@git.weixin.qq.com
 * @LastEditTime: 2025-04-07 20:39:34
 * @FilePath: \FireNewsWeb-frontend\src\layouts\mainLayout.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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