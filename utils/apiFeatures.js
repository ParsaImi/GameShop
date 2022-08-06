class APIFeatures {
    constructor(query , queryString){
    this.query = query;
    this.queryString = queryString
    }

     filter(){ 
      const queryObj = { ...this.queryString};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });
    // Advance filtering

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );


    //Show
    this.query = this.query.find(JSON.parse(queryString))
    // let query = Tour.find(JSON.parse(queryString));
      
      return this;
     }

     sorting(){
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-price');
      }
      return this;
     }

     filterFields(){
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this
     }

    pagination(){
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this
     }

    ////////////mongoss//////req.query
}

module.exports = APIFeatures