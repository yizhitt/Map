// 对于axios进行二次封装
import axios from 'axios';

// 1:利于axios对象的方法create，去创建一个axios实例
// 2:request就是axios，稍微配置一下
const requests = axios.create({
  // 配置对象
  // 基础路径，发请求的时候，路径当中会出现api
  baseURL: 'https://www.zjzwfw.gov.cn/zjservice/item/runonce',
  // 代表请求超时的时间
  timeout: 5000,
});
// 请求拦截器：在发请求之前，请求拦截器可以检测到；可以在请求发出去之前做一些事情
requests.interceptors.request.use((config) => {
  // config：配置对象，对象里面与一个属性很重要，headers请求头
  return config
});

// 响应拦截器
requests.interceptors.response.use((res) => {
  // 成功的回调函数：服务器响应数据回来以后，响应拦截器可以检测到；可以做一些事情
  return res.data;
}, (error) => {
  // 响应失败的回调函数
  console.log(error)
  return Promise.reject(new Error('falie'));
})

// 对外暴露
export default requests;