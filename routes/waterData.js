const express = require('express');
const router = express.Router();
const WaterData = require('../models/WaterData')
const WaterDataMember = require('../models/WaterDataMember')


isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// get the value associated to the key
router.get('/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.waterData = await WaterData.find({})
      res.render('waterData');
});

router.get('/:memberId',
  isLoggedIn,
  async (req, res, next) => {
      const memberId = req.params.memberId
      res.locals.water = await WaterData.findOne({_id:memberId})
      res.locals.amounts = await WaterDataMember.find({memberId:memberId})
      res.render('waterData2');
});

router.get('/remove/:memberId',
  isLoggedIn,
  async (req,res,next) => {
      await WaterData.remove({_id:req.params.memberId})
      await WaterData.remove({memberId:req.params.memberId})
      res.redirect('/water')
})



router.post('/',
  isLoggedIn,
  async (req, res, next) => {
    const waternew = parseFloat(req.body.water)
      const water = new WaterData(
        {name:req.body.name,
         water:waternew,
         createdAt: new Date(),
         ownerId: req.user._id,
        })
      await water.save();
      res.redirect('/water')
});

router.post('/addWater/:memberId',
  isLoggedIn,
  async (req, res, next) => {
    const wateramount = parseFloat(req.body.water)
      const waterdata =
      {amount:wateramount,
       memberId:req.params.memberId,
       createdAt: new Date(),
       ownerId: req.user._id,
      }
      console.log("waterdata = ")
      console.dir(waterdata)
      const waterdata2 = new WaterDataMember(waterdata)
      await waterdata2.save();
      res.redirect('/water/'+req.params.memberId)
});

module.exports = router;
