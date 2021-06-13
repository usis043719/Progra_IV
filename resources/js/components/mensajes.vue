<template>
    <div class="alert" v-bind:class="[error ? 'alert-danger' : 'alert-success']">
        {{ msg }}
    </div>
</template>
<script>
    export default {
        props:['msg','error'],
    };
</script>
