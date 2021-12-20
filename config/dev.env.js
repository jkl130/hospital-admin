'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://34.197.17.87:8081/coupons-management/"'
  //BASE_API: '"http://39.98.53.2:3332/scrapy/"'
  // BASE_API: '"http://161.117.81.243:8080/coupons-management/"'
  // BASE_API: '"http://3.83.123.228:9093/coupons-management/"'
  // BASE_API: '"https://api.voucherpa.xyz/coupons-management/"'
  // BASE_API: '"http://localhost:8080/coupons/"'
  // BASE_API: '"http://3.86.27.209:3333/cannabis/"'
  // BASE_API: '"http://192.168.1.10:8080/coupons/"'
  // BASE_API: '"http://localhost/cm/"'
  BASE_API: '"http://localhost/api2/"'
});