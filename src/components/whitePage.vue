<template>
    <div class="no_page_item">
        <img src="../assets/nodata_icon.png" alt="">
        <p>{{noText ? noText : '暂无数据~'}}</p>
    </div>
</template>

<script>
    export default {
        name: "white-page",
        props:{
            noText:String,
        }
    }
</script>

<style scoped>
    .no_page_item {
        height: auto;
        width: 100%;
        padding: 3rem 0;
        text-align: center;
    }

    .no_page_item img {
        width: 1.4rem;
        height: 1.5rem;
        margin: 0 auto;
    }

    .no_page_item p {
        font-size: 12px;
        color: #b0b0b0;
        margin-top:0.2rem;
        text-align: center;
    }
</style>
