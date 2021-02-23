<template>
<div>
  <el-row :gutter="20" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div style="float:left;margin-left:20px;">
          <div style="margin-top:24px;">
            <!-- <i class="el-icon-link" style="font-size:28px" /> -->
            <svg-icon icon-class="feather" style="font-size:32px;"/>
            <count-to :start-val="0" :end-val="1024" :duration="1600" 
              class="card-panel-num" style="font-size:20px" />
          </div>
          <div>
            <h3 style="font-size:16px;color:#467bcb;margin:15px 0;">已收到任务数</h3>
          </div>
        </div>
        <div style="float:right;margin-right:30px;">
          <div style="margin-top:40px;">
            <i class="el-icon-date" style="font-size:36px;font-weight:bold;color:#467bcb;" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div style="float:left;margin-left:20px;">
          <div style="margin-top:26px;">
            <svg-icon icon-class="task" style="font-size:30px;"/>
            <count-to :start-val="0" :end-val="1024" :duration="1600" 
              class="card-panel-num" style="font-size:20px" />
          </div>
          <div>
            <h3 style="font-size:16px;color:#2c9b5e;margin:15px 0;">已完成任务数</h3>
          </div>
        </div>
        <div style="float:right;margin-right:30px;">
          <div style="margin-top:40px;">
            <i class="el-icon-date" style="font-size:36px;font-weight:bold;color:#2c9b5e;" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div style="float:left;margin-left:20px;">
          <div style="margin-top:26px;">
            <svg-icon icon-class="receive-message" style="font-size:30px;"/>
            <count-to :start-val="0" :end-val="1024" :duration="1600" 
              class="card-panel-num" style="font-size:20px" />
          </div>
          <div>
            <h3 style="font-size:16px;color:#d35f41;">已收到消息数</h3>
          </div>
        </div>
        <div style="float:right;margin-right:30px;">
          <div style="margin-top:40px;">
            <i class="el-icon-message" style="font-size:36px;font-weight:bold;color:#d35f41;" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div style="float:left;margin-left:20px;">
          <div style="margin-top:26px;">
            <!-- <i class="el-icon-link" style="font-size:30px" /> -->
            <svg-icon icon-class="open-message" style="font-size:30px;"/>
            <count-to :start-val="0" :end-val="1024" :duration="1600" 
              class="card-panel-num" style="font-size:20px" />
          </div>
          <div>
            <h3 style="font-size:16px;color:#f1ae1b;">已阅读消息数</h3>
          </div>
        </div>
        <div style="float:right;margin-right:30px;">
          <div style="margin-top:40px;">
            <i class="el-icon-message" style="font-size:36px;font-weight:bold;color:#f1ae1b;" />
          </div>
        </div>
      </div>
    </el-col>

    <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col> -->
    <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col> -->
    <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col> -->
  </el-row>
</div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  // margin-top: 18px;

  .card-panel-col {
    margin-bottom: 20px;
  }

  .card-panel {
    height: 118px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #ccc;
        // background: #40c9c6;
        // background: #1296db;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #1296db;
      // color: #fff;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 12px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 30px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 28px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
