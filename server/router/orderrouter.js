const express = require("express");
//定义路由级中间件
const router = express.Router();
//引入数据模型模块
const Ord = require("../models/ordSchema");
const Med = require("../models/medSchema");

router.post("/order", (req, res) => {
  console.log(req.body);
  Ord.create(req.body, (err, hero) => {
    if (err) {
      res.json(err);
    } else {
      res.json(hero);
    }
  });
  }
);

 //查找所有订单
router.get("/order", (req, res) => {
  Ord.find({})
    .sort({ update_at: -1 })
    .then(heros => {
      res.json(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
  }
);

 //查找最近三个月的订单
router.get("/getOrdinThreeMonth", (req, res) => {
  let nowdate = new Date();
  let curmonth = (nowdate.getMonth()+1) % 12;
  let startMon = (curmonth-2) % 12;
  if(startMon<10)
    startMon = '0' + startMon;
  let endMon = (curmonth + 1) % 12;
  if(endMon == 0)
    endMon = '12';
  if(endMon<10)
    endMon = '0' + endMon;
  let start = nowdate.getFullYear() + '/' + startMon;
  let end = nowdate.getFullYear() + '/' + endMon;
  console.log(start);
  console.log(end);
  Ord.find({"date":{$gte: start, $lte: end},
            "editable": false,
            "type": "收入"})
    .sort({ update_at: -1 })
    .then(heros => {
      res.json(heros);
      console.log(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
  }
);

//查找一个date range的订单
router.get("/getOrderStatement", (req, res) => {
  //console.log(req.query.startDate);
  let start = req.query.startDate;
  let end = req.query.endDate;
  console.log(start);
  console.log(end);
  Ord.find({"date":{$gte: start, $lte: end},
            "editable": false})
    .sort({ update_at: -1 })
    .then(heros => {
      console.log("asgsdh");
      res.json(heros);
      console.log(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
  }
);


  //删除一条订单数据
router.delete("/order/:id", (req, res) => {
  Ord.findOneAndRemove({
    _id: req.params.id
  })
    .then(hero => res.send(`${hero.title}删除成功`))
    .catch(err => res.json(err));
  }
);

//更新订单状态
router.put("/updateOrdstatus/:id", (req, res) => {
  Ord.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        editable: false,
      }
    },
    {
      new: true
    }
  )
    .then(hero => res.json(hero))
    .catch(err => res.json(err));
});

//更新药品的库存
router.put("/order", (req, res) => {
  let errstr;
  let dose = req.body.dose;
  let arr = [];
  arr = req.body.medary;
  arr.forEach(element => {
    //console.log(element.medname);
    var tempMedname;
    var tempChangeCount;
    var index=0;
    while(index<4){
      if(index == 0){
        if(typeof(element.medname1) == "undefined")
          break;
        tempMedname = element.medname1;
        tempChangeCount = -1*element.count1*dose
        index = index + 1;
      }
      else if(index==1){
        if(typeof(element.medname2) == "undefined")
          break;
        tempMedname = element.medname2;
        tempChangeCount = -1*element.count2*dose
        index = index + 1;
      }
      else if(index==2){
        if(typeof(element.medname3) == "undefined")
          break;
        tempMedname = element.medname3;
        tempChangeCount = -1*element.count3*dose
        index = index + 1;
      }
      else if(index==3){
        if(typeof(element.medname4) == "undefined")
          break;
        tempMedname = element.medname4;
        tempChangeCount = -1*element.count4*dose
        index = index + 1;
      }
      console.log(tempMedname + '  count change:' +  tempChangeCount);
      Med.findOneAndUpdate({
        medname: tempMedname},
        {$inc: {count: tempChangeCount}})
        .catch(err => {
          errstr = err;
          console.log(err);
        });
    }
    })
  if(errstr){
    res.json(errstr);
  }
  else{
    res.send('更新成功');
  }
  
  
  /*Med.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        medname: req.body.medname,
        alias: req.body.alias,
        spec: req.body.spec,
        count: req.body.count,
        baseprice: req.body.baseprice,
        sellprice: req.body.sellprice,
        profit: req.body.profit
      }
    },
    {
      new: true
    }
  )
    .then(hero => res.json(hero))
    .catch(err => res.json(err));*/
});

module.exports = router;