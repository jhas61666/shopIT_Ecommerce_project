import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "../../constants/constants";
import StarRatings from "react-star-ratings";

const Filters = () => {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Load min/max from URL on mount
  useEffect(() => {
    if (searchParams.has("min")) setMin(searchParams.get("min"));
    if (searchParams.has("max")) setMax(searchParams.get("max"));
  }, [searchParams]);

  // PRICE FILTER
  const handlePriceSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    min ? params.set("min", min) : params.delete("min");
    max ? params.set("max", max) : params.delete("max");

    params.set("page", 1); // reset page
    navigate(`${window.location.pathname}?${params.toString()}`);
  };

  // CATEGORY & RATINGS FILTER
  const handleCheckboxClick = (checkbox) => {
    const checkboxes = document.getElementsByName(checkbox.name);
    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false; // single select
    });

    const params = new URLSearchParams(searchParams);
    checkbox.checked
      ? params.set(checkbox.name, checkbox.value)
      : params.delete(checkbox.name);

    params.set("page", 1);
    navigate(`${window.location.pathname}?${params.toString()}`);
  };

  // CHECK IF CHECKED
  const isChecked = (type, value) => {
    return searchParams.get(type) === String(value);
  };

  return (
    <div className="border p-3 filter">
      <h3>Filters</h3>
      <hr />

      {/* PRICE FILTER */}
      <h5 className="filter-heading mb-3">Price</h5>
      <form onSubmit={handlePriceSubmit}>
        <div className="row g-2">
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Min ($)"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Max ($)"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary w-100">
              GO
            </button>
          </div>
        </div>
      </form>

      <hr />

      {/* CATEGORY FILTER */}
      <h5 className="mb-3">Category</h5>
      {PRODUCT_CATEGORIES.map((category) => (
        <div className="form-check" key={category}>
          <input
            className="form-check-input"
            type="checkbox"
            name="category"
            value={category}
            id={`category-${category}`}
            defaultChecked={isChecked("category", category)}
            onChange={(e) => handleCheckboxClick(e.target)}
          />
          <label className="form-check-label" htmlFor={`category-${category}`}>
            {category}
          </label>
        </div>
      ))}

      <hr />

      {/* RATINGS FILTER */}
      <h5 className="mb-3">Ratings</h5>
      {[5, 4, 3, 2, 1].map((rating) => (
        <div className="form-check" key={rating}>
          <input
            className="form-check-input"
            type="checkbox"
            name="ratings[gte]"
            value={rating}
            id={`rating-${rating}`}
            defaultChecked={isChecked("ratings[gte]", rating)}
            onChange={(e) => handleCheckboxClick(e.target)}
          />
          <label className="form-check-label" htmlFor={`rating-${rating}`}>
            <StarRatings
              rating={rating}
              starRatedColor="#ffb829"
              numberOfStars={5}
              starDimension="21px"
              starSpacing="1px"
              name={`rating-${rating}`}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default Filters;
