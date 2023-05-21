import requests from '@/utils/axios'

export const reqMap = (param) => requests({
  url: '/jpaas-zjservice-server/open-api/zwdt/getNearlyOfflineHallList',
  method: 'post',
  data: param
})
