import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  keepUnusedDataFor: 30,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => {
        const queryParams = {
          page: params.page,
          keyword: params.keyword,
        };

        if (params.category) queryParams.category = params.category;
        if (params.min !== undefined)
          queryParams["price[gte]"] = params.min;
        if (params.max !== undefined)
          queryParams["price[lte]"] = params.max;
        if (params.ratings !== undefined)
          queryParams["ratings[gte]"] = params.ratings;

        console.log("API PARAMS:", queryParams);
        return {
          url: "/products",
          params: queryParams,
        };
      },

    }),

    getProductDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ['Product'],
    }),
    submitReview: builder.mutation({
      query(body) {
        return {
          url: "/reviews",
          method: "PUT",
          body,
        }
      },
      invalidatesTags: ['Product']
    }),
    canUserReview: builder.query({
      query: (productId) => `/can_review/?productId=${productId}`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSubmitReviewMutation,
  useCanUserReviewQuery,
} = productApi;
