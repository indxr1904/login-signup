const catchAsync = require("./catchasync");
const AppError = require("./../utils/appError");

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.findById(req.params.id);
    if (!docs) {
      next(new AppError("No User find with the id", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        docs,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.find();

    res.status(200).json({
      status: "success",
      result: docs.length,
      data: {
        docs,
      },
    });
  });
