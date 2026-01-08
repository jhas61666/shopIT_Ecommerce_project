import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  keepUnusedDataFor: 30,
  tagTypes: ["Product", "AdminProducts", "Reviews"],
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
    getAdminProducts: builder.query({
      query: () => `/admin/products`,
      providesTags: ["AdminProducts"],
    }),
    createProduct: builder.mutation({
      query(body) {
        return {
          url: "/admin/products",
          method: "POST",
          body,
        }
      },
      invalidatesTags: ['AdminProducts']
    }),
    updateProduct: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}`,
          method: "PUT",
          body,
        }
      },
      invalidatesTags: ['AdminProducts', 'Product'],
    }),
    uploadProductImages: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}/upload_images`,
          method: "PUT",
          body,
        }
      },
      invalidatesTags: ['Product'],
    }),
    deleteProductImage: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}/delete_image`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query(id) {
        return {
          url: `/admin/products/${id}`,
          method: "DELETE",

        };
      },
      invalidatesTags: ["AdminProducts"],
    }),
    getProductReviews: builder.query({
      query: (id) => `/reviews?id=${id}`,
      providesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query({ productId, id }) {
        return {
          url: `/admin/reviews?productId=${productId}&id=${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSubmitReviewMutation,
  useCanUserReviewQuery,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
  useLazyGetProductReviewsQuery,
  useDeleteReviewMutation,
} = productApi;
