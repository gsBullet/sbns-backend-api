const HeroBannerModel = require("../heroBanner/model/HeroBannerModel");
const MemberModel = require("../member/model/MemberModel");
const UnitModel = require("../unit/model/UnitModel");
const WardModel = require("../ward/model/WardModel");

module.exports = {
  heroBannerList: async (req, res) => {
    try {
      const heroBannerList = await HeroBannerModel.find({
        status: true,
      })
        .sort({ createdAt: -1 })
        .exec();

      const member = await MemberModel.find({
        organizationalValue: "Member",
      }).countDocuments();

      const ward = await WardModel.countDocuments({
        status: true,
      });

      const unit = await UnitModel.countDocuments({
        status: true,
      });

      return res.status(200).json({
        success: true,
        data: {
          heroBannerList,
          member,
          ward,
          unit,
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
