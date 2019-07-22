var express = require('express');
var router = express.Router();
const Users = require('../models/users');

// 登录
router.post('/login', (req, res) => {
  let params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  Users.findOne(params)
  .then(doc => {
    if (doc) {
      req.session.userId = doc.userId;
      req.session.userName = doc.userName;
      req.session.userPwd = doc.userPwd;
      res.json({
        status: 0,
        msg: '',
        result: ''
      });
      return;
    }
    res.json({
      status: 1,
      msg: '用户名或密码错误',
      result: ''
    })
  })
  .catch(err => {
    res.json({
      status: 1,
      msg: err.message
    })
  })
});

// 退出登录
router.post('/logout', (req, res) => {
  // 清除cookie
  console.log('a',req.session);
  req.session.destroy(err => {
    if (err) {
      res.json({
        status: 1,
        msg: '退出登录失败',
        result: ''
      });
      return;
    }
    res.clearCookie('sessionId');
    res.json({
      status: 0,
      msg: '退出登录成功',
      result: ''
    })
  });
});

// 验证登录
router.get('/checkLogin', (req, res) => {
  if (req.session.userId) {
    res.json({
      status: 0,
      msg: '已登录',
      result: {
        userName: req.session.userName
      }
    });
    return;
  }
  res.json({
    status: 1,
    msg: '未登录',
    result: ''
  });
});

// 购物车
router.get('/cart', (req, res) => {
  const userId = req.session.userId;
  Users.findOne({userId})
  .then(doc => {
    if (doc) {
      res.json({
        status: 0,
        msg: '',
        result: doc.cartList
      })
    }
  })
  .catch(err => {
    res.json({
      status: 1,
      msg: err.message
    })
  })
});

// 购物车删除
router.post('/cart/del', (req, res) => {
  const userId = req.session.userId;
  const productId = req.body.productId;
  Users.update({userId},{$pull: {cartList: {productId}}})
  .then(doc => {
    res.json({
      status: 0,
      msg: '',
      result: ''
    })
  }).catch(err => {
    res.json({
      status: 1,
      msg: err.message
    })
  })
});

// 购物车修改
router.post('/cart/edit', (req, res) => {
  const userId = req.session.userId;
  const productId = req.body.productId;
  const productNum = req.body.productNum;
  const checked = req.body.checked;
  Users.update({'userId': userId, 'cartList.productId': productId}, {'cartList.$.productNum': productNum, 'cartList.$.checked': checked})
  .then(doc => {
    res.json({
      status: 0,
      msg: '',
      result: ''
    })
  })
  .catch(err => {
    res.json({
      status: 1,
      msg: err.message
    })
  })
});

// 全选
router.post('/cart/selectAll', (req, res) => {
  const userId = req.session.userId;
  const selectAll = req.body.selectAll;
  Users.findOne({userId})
  .then(doc => {
    if (doc) {
      doc.cartList.forEach(item => {
        item.checked = selectAll ? '1' : '0';
      });
      doc.save()
      .then(doc2 => {
        res.json({
          status: 0,
          msg: '',
          result: ''
        })
      })
      .catch(err2 => {
        res.json({
          status: 1,
          msg: err2.message
        })
      })
    }
  })
  .catch(err => {
    res.json({
      status: 1,
      msg: err.message
    })
  })
});
module.exports = router;
