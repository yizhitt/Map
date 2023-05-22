<template>
  <div>
    <div id="container"></div>
    <div class="searchMap" style="position: absolute; top: 50px; left: 10px;">
      <div class="mapSearch">
        <a-select :value="getLabelByValue(selectedMapType)" class="mapType" dropdownClassName="mapTypeList" :dropdownMenuStyle="{ color: '#363a44', padding: '0' }" :dropdownStyle="{ padding: '0' }">
          <a-icon slot="suffixIcon" type="caret-down" theme="filled" />
          <a-radio-group v-model="selectedMapType" slot="dropdownRender" @change="mapTypeHandleChange">
            <a-radio v-for="item in mapTypeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </a-select>
        <div class="mapSearchBox flex1">
          <input type="text" class="mapInput flex1" v-show="selectedMapType === '1'" ref="mapInput" v-model="mapValue" placeholder="请输入地理位置关键词" />
          <input type="text" class="mapInput flex1" v-show="selectedMapType === '2'" v-model="mapValue" placeholder="请输入大厅名称关键词" />
          <img class="close" src="../assets/close.png" @click="close" alt="" srcset="" />
          <input type="submit" value="搜索" class="mapSubmit rf" @click="searchSubmit" />
        </div>
      </div>
      <div class="searchContainer">
        <div class="tips">
          为您展示<b>{{ address }}</b
          >附近的大厅
        </div>
        <div class="optionList">
          <div class="optionItem">
            <a-select :value="rangeLabelByValue(selectedRange)" class="optionName" dropdownClassName="mapTypeList" :dropdownMenuStyle="{ color: '#363a44', padding: '0' }" :dropdownStyle="{ padding: '0' }">
              <a-icon slot="suffixIcon" type="caret-down" theme="filled" />
              <a-radio-group v-model="selectedRange" slot="dropdownRender" @change="rangeTypeHandleChange">
                <a-radio v-for="item in rangeValueOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </a-select>
            <a-select :value="busyLabelByValue(selectedBusy)" class="optionName" dropdownClassName="mapTypeList" :dropdownMenuStyle="{ color: '#363a44', padding: '0' }" :dropdownStyle="{ padding: '0' }">
              <a-icon slot="suffixIcon" type="caret-down" theme="filled" />
              <a-radio-group v-model="selectedBusy" slot="dropdownRender" @change="busyTypeHandleChange">
                <a-radio v-for="item in busyValueOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </a-select>
            <a-select :value="workLabelByValue(selectedWork)" class="optionName" dropdownClassName="mapTypeList" :dropdownMenuStyle="{ color: '#363a44', padding: '0' }" :dropdownStyle="{ padding: '0' }">
              <a-icon slot="suffixIcon" type="caret-down" theme="filled" />
              <a-radio-group v-model="selectedWork" slot="dropdownRender" @change="workTypeHandleChange">
                <a-radio v-for="item in workValueOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </a-select>
          </div>
          <div class="searchList">
            <div class="searchItem" v-for="(item, index) in MapList.data" :key="index">
              <div class="searchNum">{{ index + 1 }}</div>
              <div class="searchCenter">
                <div class="title">{{ item.hallName }}</div>
                <div class="address">
                  <span>{{ item.distance }}</span>
                  {{ item.hallAddress }}
                </div>
                <div class="time">
                  <span :class="{ busy: item.busyFlag === 1, same: item.busyFlag === 2, rest: item.busyFlag === 4 }">{{ busyFlag(item.busyFlag) }}</span>
                  {{ item.workTime }}
                </div>
                <div class="categoryName">
                  <span v-for="(categoryNamesItem, index) in item.categoryNames" :key="index" v-show="showAll || index < 6">{{ categoryNamesItem }}</span>
                  <span class="categoryMore" v-if="item.categoryNames.length > 6" @click="toggleMoreShow">{{ showAll ? "收起" : "展开" }}</span>
                </div>
              </div>
              <div class="searchNav">导航</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { mapState } from "vuex";
window._AMapSecurityConfig = {
  securityJsCode: "c4579f6e0553369c5745e90782ea75e6",
};
export default {
  name: "Mapview",
  data() {
    return {
      map: null,
      mapTypeValue: "地理位置",
      mapTypeOptions: [
        {
          value: "1",
          label: "地理位置",
        },
        {
          value: "2",
          label: "大厅名称",
        },
      ],
      selectedMapType: "1",
      rangeValue: "5km内",
      rangeValueOptions: [
        {
          value: "1",
          label: "距离小于5km",
        },
        {
          value: "2",
          label: "距离小于2km",
        },
        {
          value: "3",
          label: "距离小于1km",
        },
      ],
      selectedRange: "1",
      busyValue: "忙闲",
      busyValueOptions: [
        {
          value: "1",
          label: "闲忙",
        },
        {
          value: "2",
          label: "一般",
        },
        {
          value: "3",
          label: "繁忙",
        },
      ],
      selectedBusy: "1",
      workValue: "办事类型",
      workValueOptions: [
        {
          value: "1",
          label: "医疗健康",
        },
        {
          value: "2",
          label: "社保",
        },
        {
          value: "3",
          label: "公积金",
        },
      ],
      selectedWork: "1",
      mapValue: "",
      showAll: false,
      address: "浙江省人民政府",
    };
  },
  mounted() {
    this.initAMap();
  },
  methods: {
    initAMap() {
      AMapLoader.load({
        key: "84ea1dadc02f2621cde9b051ee06e16f", //设置您的key
        version: "2.0",
        plugins: ["AMap.ToolBar", "AMap.Driving", "AMap.Geolocation", "AMap.PlaceSearch", "AMap.AutoComplete", "AMap.Geocoder"],
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
            center: [120.15257500000001, 30.266619],
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
          const geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all",
          });
          // 添加定位插件事件监听
          geolocation.on("complete", (data) => {
            console.log("定位成功:", data, data.position.KL, data.position.kT);
            this.$store.dispatch("getMap", { longitude: data.position.KL, latitude: data.position.kT });
            // 获取地理名称
            geocoder.getAddress([data.position.KL, data.position.kT], (status, result) => {
              if (status === "complete" && result.info === "OK") {
                // result为对应的地理位置详细信息
                // console.log(result.regeocode);
                this.address = result.regeocode.formattedAddress;
              }
            });
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
            placeSearch.search(e.poi.name, (status, result) => {
              // 关键字查询查询成功的回调函数
              if (status === "complete" && result.info === "OK") {
                // 获取查询到的第一个地点的经纬度坐标
                if (result.poiList && result.poiList.pois[0]) {
                  const position = result.poiList.pois[0].location;
                  console.log("定位到的地址坐标：", position);
                }
              } else {
                console.log("查询失败");
              }
            });
            console.log(e.poi.adcode, e.poi.name);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    mapTypeHandleChange(e) {
      this.selectedMapType = e.target.value;
    },
    getLabelByValue(value) {
      const item = this.mapTypeOptions.find((option) => option.value === value);
      return item ? item.label : null;
    },
    rangeTypeHandleChange(e) {
      this.selectedRange = e.target.value;
    },
    rangeLabelByValue(value) {
      const item = this.rangeValueOptions.find((option) => option.value === value);
      return item ? item.label : null;
    },
    busyTypeHandleChange(e) {
      this.selectedRange = e.target.value;
    },
    busyLabelByValue(value) {
      const item = this.busyValueOptions.find((option) => option.value === value);
      return item ? item.label : null;
    },
    workTypeHandleChange(e) {
      this.selectedWork = e.target.value;
    },
    workLabelByValue(value) {
      const item = this.workValueOptions.find((option) => option.value === value);
      return item ? item.label : null;
    },
    close() {
      this.mapValue = "";
    },
    searchSubmit() {
      // this.$store.dispatch("reqMap", this.param);
    },
    busyFlag(index) {
      if (index === 1) {
        return "繁忙";
      } else if (index === 2) {
        return "一般";
      } else if (index === 3) {
        return "空闲";
      } else {
        return "休息";
      }
    },
    toggleMoreShow() {
      this.showAll = !this.showAll;
    },
  },
  computed: {
    ...mapState({
      MapList: (state) => state.MapList,
    }),
  },
};
</script>
<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
  position: absolute;
}
.searchMap {
  background: #fff;
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
  margin: 6px;
  text-align: center;
  background: #f3f5f9;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
}
.mapType ::v-deep .ant-select-selection,
.mapType ::v-deep .ant-select-selection__rendered {
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  color: #363a44;
  border: 0;
  background: #f3f5f9;
}
.mapTypeList {
  margin-top: 2px;
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
.searchContainer {
  width: 530px;
  height: 790px;
  padding: 24px;
}
.tips {
  font-weight: 500;
  font-size: 16px;
  color: #686b73;
  background: url("../assets/position_icon_location.png") no-repeat center left;
  background-size: 20px 20px;
  padding-left: 28px;
  margin-bottom: 20px;
}
.tips > b {
  font-weight: 600;
  font-size: 16px;
  color: #0366f1;
  margin: 0 2px;
}
.optionItem {
  display: flex;
  justify-content: space-between;
}
.optionName {
  width: 152px !important;
  height: 40px;
  line-height: 40px;
  color: #363a44;
  font-size: 16px;
  text-align: center;
  background: rgba(240, 243, 247, 0.4);
  border: 1px solid #e6edfb;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
}
.optionName ::v-deep .ant-select-selection,
.optionName ::v-deep .ant-select-selection__rendered {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #363a44;
  border: 0;
  margin-left: 0;
  background: #f3f5f9;
}

.searchItem {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(225, 225, 225, 0.5);
  padding: 21.5px 0 20.5px 0;
  cursor: pointer;
}
.searchItem:first-child {
  border-top: none;
}
.searchNum {
  width: 22px;
  height: 22px;
  background: #0366f1;
  border: 1.8375px solid #ffffff;
  border-radius: 50%;
  text-align: center;
  color: #fff;
  position: relative;
  z-index: 9;
}
.searchNum::before {
  content: "";
  position: absolute;
  top: 16px;
  left: 3.5px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #0366f1;
  z-index: -1;
}
.searchCenter {
  width: 410px;
}
.title {
  font-weight: 600;
  font-size: 16px;
  color: #363a44;
}
.address,
.time {
  font-weight: 400;
  font-size: 12px;
  color: #686b73;
  margin-top: 10px;
}
.address > span {
  position: relative;
  margin-right: 14px;
}
.address > span::before {
  content: "";
  position: absolute;
  top: 3px;
  left: 44px;
  width: 1px;
  height: 12px;
  background: #e1e1e1;
}
.time > span {
  width: 45px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: rgba(0, 181, 120, 0.1);
  border-radius: 1.66667px;
  display: inline-block;
  margin-right: 6px;
}
.busy {
  color: #e63633;
  background: rgba(230, 54, 51, 0.1) !important;
}
.same {
  color: #ff6a2a;
  background: rgba(255, 106, 42, 0.1) !important;
}
.rest {
  color: #686b73;
  background: #f3f5f9 !important;
}
.searchNav {
  font-weight: 500;
  font-size: 12px;
  color: #0366f1;
  background: url("../assets/navigation_icon.png") no-repeat;
  background-size: 12px 12px;
  background-position-y: 2px;
  padding-left: 15px;
}
.categoryName {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.categoryName > span {
  width: auto;
  height: 20px;
  line-height: 20px;
  text-align: center;
  padding: 0 11px;
  background: #edf4ff;
  border-radius: 1.66667px;
  margin-right: 8px;
  color: #0366f1;
  font-size: 12px;
  margin-top: 10px;
  display: inline-block;
}
.categoryName > span:first-child {
  margin-left: 0;
}
.categoryMore {
  width: 48px;
  position: absolute;
  right: 10px;
  background: #f3f5f9 !important;
  border-radius: 2px !important;
  color: #686b73 !important;
}
</style>
