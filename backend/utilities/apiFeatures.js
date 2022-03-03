class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtrovanie
    const queryObj = { ...this.queryString }; //vytvoril som hard copy z req.query
    const excludedFields = ['page', 'sort', 'limit', 'fields']; //excludnem tie, ktoré nepoužívam pri tomto query, ale ktore sa tam vseobecne mozu vyskytnut
    excludedFields.forEach((el) => delete queryObj[el]); //ak sa tam nachádzaju nejake z excludedFields tak ich najdem a vymazem

    // 1B) Pokročilé filtrovanie
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //gte,lte,lt,gt replacnem za $gte,$lte,$lt,$gt ... \b je tam na to že len presne tie chcem (nie že nejaké slovo bude obsahovať gte a aj to replacnem) .. g - bude sa opakovať pri všetkých výskytoch, nie len pri prvom. funkcia replace akceptuje callback funkcie takže preto match

    this.query = this.query.find(JSON.parse(queryStr)); //vracia objekt Query - dokumentácia

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); //chyba tu
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
      //sort('price ratings') //ratings je tam na to, že ak price sa rovna tak usporiada ešte podľa rating, teda drtuhé kritérium sortovania
    } else {
      this.query = this.query.sort('-createdAt'); //ak nezadáme explicitne sort, tak budú default sortnuté podľa createdAt - desc
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
    const skip = (page - 1) * limit; //prepocitavanie novej stranky a jej kontentu
    // page=2&limit=10 , 1-10 page1 a na page 2 11-20
    this.query = this.query.skip(skip).limit(limit);

    return this; //musí byť kvôli tomu aby chaining fungoval
  }
}

module.exports = APIFeatures;
