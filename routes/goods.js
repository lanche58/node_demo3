const express = require('express');
const mongoose = require('mongoose');
const Goods = require('../models/goods');
const router = express.Router();
// 链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/node_demo3', { useNewUrlParser: true }); 
// 监听数据库
// 链接成功
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected success.');
});
// 链接失败
mongoose.connection.on('error', () => {
    console.log('MongoDB connected fail.');
});
// 链接断开
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connected disconnected.');
});
// get请求
router.get('/', (req, res) => {
    // 获取前端传递过来的参数
    // 排序
    const sort = req.param('sort');
    // 分页
    const page = parseInt(req.param('page'));
    const pageSize = parseInt(req.param('pageSize'));
    const skip = (page - 1) * pageSize;
    // 按价格查询
    const minPrice = parseInt(req.param('minPrice'));
    const maxPrice = parseInt(req.param('maxPrice'));
    // 查询条件
    const params = {};
    if (maxPrice) {
        params.salePrice = {
            $gt: minPrice,
            $lt: maxPrice
        }
    }
    Goods.find(params)
    // 对哪个字段进行排序
    .sort({'salePrice': sort})
    // 跳过多少条
    .skip(skip)
    // 取多少条
    .limit(pageSize)
    .exec((err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: err.message
            })
        } else {
            res.json({
                status: 0,
                msg: '查询成功',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});
module.exports = router;