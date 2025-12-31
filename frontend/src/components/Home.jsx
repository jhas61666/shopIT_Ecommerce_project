import React, { useEffect } from "react";
import MetaData from "./layout/MetaData";
import { useGetProductsQuery } from "../redux/api/productsApi.js";
import ProductItem from "./product/ProductItem.jsx";
import Loader from "./layout/Loader.jsx";
import toast from "react-hot-toast";
import CustomPagination from "./layout/CustomPagination.jsx";
import { useSearchParams } from "react-router-dom";
import Filters from "./layout/Filters.jsx";

const Home = () => {
  const [searchParams] = useSearchParams();

  // URL params
  const page = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const ratings = searchParams.get("ratings[gte]");

  const params = { page, keyword };
  if (min) params.min = Number(min);
  if (max) params.max = Number(max);
  if (category) params.category = category;
  if (ratings) params.ratings = Number(ratings);

  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  useEffect(() => {
    if (isError) toast.error(error?.data?.message || "Something went wrong");
  }, [isError]);

  const columnSize = keyword ? 4 : 3;

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Buy Best Product Online"} />
      <div className="row">
        {(keyword || min || max || category || ratings) && (
          <div className="col-6 col-md-3 mt-5">
            <Filters />
          </div>
        )}
        <div
          className={
            keyword || min || max || category || ratings
              ? "col-12 col-sm-6 col-md-9"
              : "col-12 col-sm-6 col-md-12"
          }
        >
          <h1 id="products_heading" className="text-secondary">
            {keyword
              ? `${data?.products?.length} Products found with keyword: ${keyword}`
              : "Latest Products"}
          </h1>

          <section id="products" className="mt-5">
            <div className="row">
              {data?.products?.map((product) => (
                <ProductItem
                  key={product._id}
                  product={product}
                  columnSize={columnSize}
                />
              ))}
            </div>
          </section>

          <CustomPagination
            resPerPage={data?.resPerPage}
            filteredProductsCount={data?.filteredProductsCount}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
