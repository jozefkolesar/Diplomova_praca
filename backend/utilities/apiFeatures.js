class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //Funkcie pre filtrovanie, limitovanie, stránkovanie a sortovanie
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields']; //excludnem tie, ktoré nepoužívam pri tomto query, ale ktore sa tam vseobecne mozu vyskytnut
    excludedFields.forEach((el) => delete queryObj[el]); //ak sa tam nachádzaju nejake z excludedFields tak ich najdem a vymazem

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); //projecting
    } else {
      this.query = this.query.select('-__v'); //excludnem -__v field
    }
    return this;
  }

  paginate() {
    const page = this.queryString * 1 || 1; // || 1 je default.
    const limit = this.queryString.limit * 1 || 100; //100 default
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this; //musí byť kvôli tomu aby chaining fungoval
  }
}

module.exports = APIFeatures;
