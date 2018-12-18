<template>
    <p class="c-money tac pre_time">{{showTimeLeft}}</p>
</template>

<script>
    export default {
        name: "time-left",
        props: {
            endTime: String
        },
        data() {
            return {
                timeLeft: '00.00.00',
                bindIntervalEvent: ''
            }
        },
        computed: {
            showTimeLeft() {
                if (this.timeLeft < 0) {
                    return '预售已结束'
                } else {
                    let hour = 0;
                    let minute = 0;
                    let second = 0;//时间默认值
                    hour = Math.floor(this.timeLeft / (60 * 60));
                    minute = Math.floor(this.timeLeft / 60) - (hour * 60);
                    second = Math.floor(this.timeLeft) - (hour * 60 * 60) - (minute * 60);
                    if (minute <= 9) minute = '0' + minute;
                    if (second <= 9) second = '0' + second;
                    return "剩余时间："+ hour + ":" + minute + ":" + second;
                }
            }
        },
        created() {
            this.getLeftTime(); //获取剩余时间
            this.bindIntervalEvent = setInterval(this.intervalEvent, 1000)
        },
        methods: {
            getLeftTime() {
                let endT = new Date(this.endTime).getTime();
                let nowT = new Date().getTime();
                if (endT > nowT) {
                    this.timeLeft = (endT - nowT) / 1000;  //总剩余时间
                } else {
                    this.timeLeft = 0
                }
            },
            // 间隔事件
            intervalEvent() {
                if (this.time <= 0) {
                    clearInterval(this.bindIntervalEvent)
                } else {
                    this.timeLeft--
                }
            }

        }
    }
</script>

<style scoped>

</style>
