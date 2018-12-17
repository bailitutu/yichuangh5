<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App',

        watch:{
            '$route':{
                handler(to, from){
                    if(to.path == '/back'){
                        this.$comm.normalBack();
                    }else if(to.path == '/record'){ //跳转交易记录
                        if(this.$comm.isAndroid()){
                            window.location.href = 'http://www.yichuangpt.com/static/gotoRecord.html'
                        }else if(this.$comm.isIos()){
                            goRecord();
                        }
                    }
                },
                // 深度观察监听
                deep: true
            }
        }
    }
</script>

<style>
    #app {
        width: 100%;
        height: 100%;
        position: relative;
    }
</style>
