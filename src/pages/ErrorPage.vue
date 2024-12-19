<template>
    <a-result
            status="success"
            sub-title="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            title="Successfully Purchased Cloud Server ECS!"
    >
        <template #extra>
            <a-button key="console" type="primary">Go Console</a-button>
            <a-button key="buy">Buy Again</a-button>
        </template>
    </a-result>

    <a-result title="Your operation has been executed">
        <template #extra>
            <a-button key="console" type="primary">Go Console</a-button>
        </template>
    </a-result>

    <a-result status="warning" title="There are some problems with your operation.">
        <template #extra>
            <a-button key="console" type="primary">Go Console</a-button>
        </template>
    </a-result>

    <a-result status="403" sub-title="Sorry, you are not authorized to access this page." title="403">
        <template #extra>
            <a-button type="primary">Back Home</a-button>
        </template>
    </a-result>

    <a-result status="404" sub-title="Sorry, the page you visited does not exist." title="404">
        <template #extra>
            <a-button type="primary">Back Home</a-button>
        </template>
    </a-result>

    <a-result status="500" sub-title="Sorry, the server is wrong." title="500">
        <template #extra>
            <a-button type="primary">Back Home</a-button>
        </template>
    </a-result>

    <a-result
            status="error"
            sub-title="Please check and modify the following information before resubmitting."
            title="Submission Failed"
    >
        <template #extra>
            <a-button key="console" type="primary">Go Console</a-button>
            <a-button key="buy">Buy Again</a-button>
        </template>

        <div class="desc">
            <p style="font-size: 16px">
                <strong>The content you submitted has the following error:</strong>
            </p>
            <p>
                <close-circle-outlined :style="{ color: 'red' }"/>
                Your account has been frozen
                <a>Thaw immediately &gt;</a>
            </p>
            <p>
                <close-circle-outlined :style="{ color: 'red' }"/>
                Your account is not yet eligible to apply
                <a>Apply Unlock &gt;</a>
            </p>
        </div>
    </a-result>
</template>

<script lang="ts" setup>
import {CloseCircleOutlined} from '@ant-design/icons-vue';
</script>

<style scoped>
.desc p {
    margin-bottom: 1em;
}
</style>