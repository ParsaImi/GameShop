const catchAsync = require("./../utils/catchAsync")
const AppError = require("./../utils/appErrors")
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res , next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if(!doc){
            return next(new AppError("no doc with this id !" , 404))
        }
        res.json({
          data: null
        });
    });


    exports.updateOne = Model => catchAsync(async (req, res , next) => {
      const updatedModel = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators : true
      });
      if(!updatedModel){
        return next(new AppError("this id is not define (not correct)" , 404))
      }
      res.status(200).json({
        status: 'ok',
        data: {
          updateTo: updatedModel,
        },
      });
  });


  exports.createOne = Model => catchAsync (async (req, res ,next) => {
  
    const userIdeal = req.body;
    const newDoc = await Model.create(userIdeal);
    res.json({
      status: 'ok',
      data: {
        doc: newDoc,
      },
    });
});


exports.getOne = (Model , popOptions) =>  catchAsync(async (req, res , next) => {
  let query =  Model.findById(req.params.id);
  if(popOptions) query.populate(popOptions);
  const doc = await query
  res.status(200).json({
    data: {
      doc
    },
  });
});


exports.getAll = Model => catchAsync(async (req, res, next) => {

    let filter = {}
    if(req.params.tourId){
        filter = {tour : req.params.tourId}
    }

  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sorting()
    .filterFields()
    .pagination();
  const allDocs = await features.query;
  res.json({
    numberOfDocs : allDocs.length,
    data: {
      data : allDocs,
    },
  });
});