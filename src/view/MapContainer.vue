<template>
  <div class="">
    <div id="container"></div>
    <div class="searchMap" style="position: absolute; top: 50px; left: 10px;">
      <div class="mapSearch">
        <div class="mapType" :class="{ onMapTypeName: isMapList }" @click="toggleMapType">
          <div>{{ mapTypeName }}</div>
          <div class="mapTypeList" v-show="isMapList">
            <el-radio v-model="radio" label="1" @change="handleRadioChange">地理位置</el-radio>
            <el-radio v-model="radio" label="2" @change="handleRadioChange">大厅名称</el-radio>
          </div>
        </div>
        <div class="mapSearchBox flex1">
          <input type="text" class="mapInput flex1" ref="mapInput" v-model="mapValue" placeholder="请输入大厅名称关键词" />
          <img class="close" src="../assets/close.png" @click="close" alt="" srcset="">
          <input type="submit" value="搜索" class="mapSubmit rf" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
window._AMapSecurityConfig = {
  securityJsCode: "c4579f6e0553369c5745e90782ea75e6",
};
export default {
  name: "Mapview",
  data() {
    return {
      map: null,
      mapTypeName: "地理位置",
      radio: "1",
      isMapList: false,
      mapValue:''
    };
  },
  created() {},
  mounted() {
    this.initAMap();
  },
  methods: {
    initAMap() {
      AMapLoader.load({
        key: "84ea1dadc02f2621cde9b051ee06e16f", //设置您的key
        version: "2.0",
        plugins: ["AMap.ToolBar", "AMap.Driving", "AMap.Geolocation", "AMap.PlaceSearch", "AMap.AutoComplete"],
        AMapUI: {
          version: "1.1",
          plugins: [],
        },
        Loca: {
          version: "2.0",
        },
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            viewMode: "3D",
            zoom: 10,
            zooms: [2, 22],
            center: [105.602725, 37.076636],
          });
          // 初始化定位
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 5000, // 超过5秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, // 显示定位按钮，默认：true
            buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true, // 定位成功后调整地图视野范围以适应地图精度圈范围，默认：false
          });
          // 将定位插件添加到地图上
          this.map.addControl(geolocation);
          // 添加定位插件事件监听
          geolocation.on("complete", (data) => {
            console.log("定位成功:", data, data.position.KL, data.position.kT);
          });
          geolocation.on("error", (err) => {
            console.log("定位失败:", err);
          });
          // 开始定位
          geolocation.getCurrentPosition();
          // 初始化AMap.AutoComplete
          var auto = new AMap.AutoComplete({ input: this.$refs.mapInput });
          var placeSearch = new AMap.PlaceSearch({
            map: this.map,
          }); //构造地点查询类
          auto.on("select", select); //注册监听，当选中某条记录时会触发
          function select(e) {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name); //关键字查询查询
            console.log(e.poi.adcode, e.poi.name);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    toggleMapType() {
      this.isMapList = !this.isMapList;
    },
    handleRadioChange(value) {
      if (value === "1") {
        this.mapTypeName = "地理位置";
      } else if (value === "2") {
        this.mapTypeName = "大厅名称";
      }
    },
    close(){
      this.mapValue=''
    }
  },
};
</script>
<style scoped>
*,
*:before,
*:after {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

html,
body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
code,
form,
fieldset,
legend,
input,
textarea,
p,
blockquote,
th,
td,
hr,
button,
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section,
img {
  margin: 0px;
  padding: 0px;
  outline: none;
  border: 0px;
  -webkit-text-size-adjust: none;
}

li {
  list-style: none;
}

body {
  text-align: left;
  font-family: "微软雅黑";
  color: #363a44;
  background: #fefefe;
}

a,
ins {
  text-decoration: none;
}

a {
  color: #363a44;
}

.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.clear {
  clear: both;
}

.lf {
  float: left;
}

.rf {
  float: right;
}
.flex1 {
  flex: 1;
}
.home_div {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
  position: relative;
}

#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
  position: absolute;
}

.mapSearch {
  width: 530px;
  height: 56px;
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(141, 155, 173, 0.17);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mapType {
  width: 104px;
  height: 44px;
  line-height: 44px;
  padding-right: 14px;
  margin: 6px;
  text-align: center;
  background: #f3f5f9;
  border-radius: 4px;
  font-weight: 500;
  font-size: 16px;
  position: relative;
  cursor: pointer;
}
.mapType::before {
  content: "";
  position: absolute;
  top: 20px;
  right: 12px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #666666;
}
.onMapTypeName {
  border: 1px solid #0366f1;
}
.onMapTypeName::before {
  content: "";
  position: absolute;
  top: 20px;
  right: 12px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 6px solid #666666;
  border-top: none;
}

.mapTypeList {
  width: 104px;
  height: auto;
  margin-top: 4px;
  background: #fff;
}
.mapTypeList > div {
  width: 104px;
  height: 46px;
}
::v-deep .el-radio {
  margin-right: 0;
}
::v-deep .el-radio__inner {
  border-radius: 2px;
}

::v-deep .el-radio__input.is-checked .el-radio__inner::after {
  content: "";
  width: 8px;
  height: 3px;
  border: 2px solid white;
  border-top: transparent;
  border-right: transparent;
  text-align: center;
  display: block;
  position: absolute;
  top: 2px;
  left: 1px;
  transform: rotate(-45deg);
  border-radius: 0px;
  background: none;
}

.mapSearchBox {
  height: 100%;
  margin-left: 27px;
  padding-left: 1px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 6px;
  border-radius: 4px;
  position: relative;
}
.mapSearchBox::before {
  content: "";
  position: absolute;
  top: 22px;
  left: -1px;
  width: 1px;
  height: 12px;
  background: #0366f1;
}
.mapSearchBox:focus-within {
  border: 1px solid #0366f1;
}
.mapInput {
  height: 100%;
  border: none;
  display: inline-block;
  text-indent: 16px;
  color: #b3b5b9;
  font-size: 16px;
  caret-color: #0366f1;
  padding-left: 4px;
}
.close {
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.mapSubmit {
  width: 104px;
  height: 44px;
  background: #0366f1;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-left: 20px;
}
</style>
