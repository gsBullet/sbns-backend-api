const HeroBannerModel = require("../heroBanner/model/HeroBannerModel");
const CounterModel = require("../ManpowerCount/model/CounterModel");
const MemberModel = require("../member/model/MemberModel");
const UnitModel = require("../unit/model/UnitModel");
const WardModel = require("../ward/model/WardModel");

module.exports = {
  heroBannerList: async (req, res) => {
    try {
      const heroBannerList = await HeroBannerModel.find({
        status: true,
      })
        .select("-__v -_id")
        .sort({ createdAt: -1 })
        .exec();

      const sbnsCounter = await CounterModel.findOne({})
        .sort({ createdAt: -1 })
        .select("-__v -_id")
        .exec();

      return res.status(200).json({
        success: true,
        data: {
          heroBannerList,
          sbnsCounter,
        },
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },
};
