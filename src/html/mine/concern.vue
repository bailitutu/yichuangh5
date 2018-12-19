<template>
  <yd-layout :title="pageType == '2'? '关注' : '粉丝'" link="/back">
    <ul class="concern_list" v-if=" pageType == '2' && list.length >0">
      <li v-for="(con,i) in list" :key="i">
        <img :src="con.headImg" alt="" class="concern_img">
        <p>{{con.name}}</p>
      </li>
    </ul>
    <ul class="concern_list" v-if="pageType == '1' && list.length>0">
      <li v-for="(item,index ) in list" :key="index">
        <img :src="item.headImg" alt="" class="concern_img">
        <p>{{item.name}}</p>
        <yd-button size="small" type="primary" class="concern_btn hasBra"
                   :bgcolor="item.isFollow == 0 ? '#282828' : '#B0B0B0' " color="#fff"
                   @click.native="concernFn(index,item)"> {{ item.isFollow == 1 ? '已关注' : '关注'}}
        </yd-button>
      </li>
    </ul>
    <white-page v-if="list.length == 0" :noText="noDataText"></white-page>
  </yd-layout>
</template>

<script>
  import WhitePage from '../../components/whitePage';

  export default {
    name: 'concern',
    components: {WhitePage},
    data () {
      return {
        pageType: '',
        list: [],
        noDataText: ''
      }
    },
    created () {
      this.userId = this.$comm.getUrlKey('userId') || '224418465157615616';
      this.pageType = this.$comm.getUrlKey('type') || '2';  //2:关注；1：粉丝
      this.noDataText = this.pageType == '2' ? '还没有任何关注哦' : '还没有粉丝哦~';
      this.getData(this.pageType);
    },
    methods: {
      // 获取页面数据
      getData (t) {
        this.$dialog.loading.open('努力加载中...');
        this.$http.post('/appUser/findMyAllFollow', {
          userId: this.userId,
          type: t
        }, (res) => {
          this.$dialog.loading.close();
          this.list = res.data;
        })
      },
      // 关注和取消关注
      concernFn (index, item) {
        let fansId = item.id;
        let userId = this.userId;
        // if (item.isFollow == 1) { //去取消关注
        //   this.list[index].isFollow = 0;
        // } else { //去关注
        //   this.list[index].isFollow = 1;
        // }
        //
        // let fansId = '';
        // let userId = '';
        // if (item.isFollow == 1) { //去取消关注
        //   fansId = item.id;
        //   userId = this.userId;
        //   this.list[index].isFollow = 0;
        // } else { //去关注
        //   fansId = this.userId;
        //   userId = item.id;
        //   this.list[index].isFollow = 1;
        // }

        this.$http.post('/shop/followShop', {
          userId: userId,
          fansId: fansId
        }, (res) => {
          if (item.isFollow == 0) {
            this.$dialog.toast({
              mes: '关注成功！'
            })
          } else {
            this.$dialog.toast({
              mes: '取消关注成功'
            })
          }
          this.getData(this.pageType);
        })

      }
    }
  }
</script>

<style scoped>
  .topBar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }

  .concern_list {
    padding: 0 12px;
  }

  .concern_list li {
    height: 52px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    display: flex;
    align-content: center;
    justify-content: space-between;
    padding: 0 10px;
    margin-top: 10px;
    background: #fff;
    align-items: center;
    flex-direction: row;
  }

  .concern_list li > img {
    width: 25px;
    height: 25px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    margin-right: 10px;
  }

  .concern_list li > p {
    font-size: 14px;
    color: #606060;
    flex: 1;
  }

  .concern_btn {
    min-width: 50px;
    min-height: 0.48rem;
    padding: 0.01rem auto;
  }
</style>
