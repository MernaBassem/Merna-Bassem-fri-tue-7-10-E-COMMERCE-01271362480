export class ApiFeatures {
  constructor(mongooseQuery, query) {
    this.mongooseQuery = mongooseQuery;
    this.query = query;
  }

  // Sort
  sort() {
    if (this.query.sort) {
      this.mongooseQuery.sort(this.query.sort);
    }
    return this;
  }

  // Paginate
  paginate() {
    const { limit = 2, page = 1 } = this.query;
    const skip = (page - 1) * limit;
    this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }

  // Filter
  filter() {
    const { page = 1, limit = 2, sort, ...filters } = this.query;
    
    let queryStr = JSON.stringify(filters);
    queryStr = queryStr.replace(
      /\b(lt|gt|lte|gte|regex|ne|eq)\b/g,
      (match) => `$${match}`
    );

    const parsedFilters = JSON.parse(queryStr);
    this.mongooseQuery.find(parsedFilters);
    
    return this;
  }
}
