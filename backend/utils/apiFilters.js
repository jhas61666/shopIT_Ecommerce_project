class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Search by keyword safely
 search() {
    const keyword = this.queryStr.keyword && this.queryStr.keyword.trim() !== ""
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filters: price and ratings
  filters() {
    const queryCopy = { ...this.queryStr };
    const fieldsToRemove = ["keyword", "page"];
    fieldsToRemove.forEach((el) => delete queryCopy[el]);

    const queryObj = {};

    Object.keys(queryCopy).forEach((key) => {
      if (key.startsWith("price[")) {
        const operator = key.match(/price\[(.*)\]/)[1]; // gte, lte, etc
        queryObj.price = queryObj.price || {};
        queryObj.price[`$${operator}`] = Number(queryCopy[key]) || 0;
      } else if (key === "ratings[gte]") {
        queryObj.ratings = { $gte: Number(queryCopy[key]) || 0 };
      } else {
        queryObj[key] = queryCopy[key];
      }
    });

    this.query = this.query.find(queryObj);
    return this;
  }

  // Pagination
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;
