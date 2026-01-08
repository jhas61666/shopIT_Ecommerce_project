import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import this
import { toast } from 'react-hot-toast';
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';
import AdminLayout from '../layout/AdminLayout';
import { useDeleteReviewMutation, useLazyGetProductReviewsQuery } from '../../redux/api/productsApi';

const ProductReviews = () => {
  const [productId, setProductId] = useState("");
  const [searchParams, setSearchParams] = useSearchParams(); // Initialize searchParams

  const [getProductReviews, { data, isLoading, error }] = useLazyGetProductReviewsQuery();
  const [deleteReview, { isSuccess, error: deleteError, isLoading: isDeleteLoading }] = useDeleteReviewMutation();

  // 1. Get productId from URL on component mount/refresh
  useEffect(() => {
    const id = searchParams.get("productId");
    if (id) {
      setProductId(id);
      getProductReviews(id); // Auto-trigger search on refresh
    }
  }, [searchParams]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Review Deleted Successfully");
    }
  }, [error, deleteError, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (productId) {
      // 2. Set the ID in the URL instead of just calling the query
      setSearchParams({ productId });
    }
  };

  const deleteReviewHandler = (id) => {
    deleteReview({ productId, id });
  };

  return (
    <AdminLayout>
      <MetaData title={"Product Reviews"} />
      <div className="row justify-content-center my-5">
        <div className="col-6">
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label htmlFor="productId_field" className="form-label">
                Enter Product ID
              </label>
              <input
                type="text"
                id="productId_field"
                className="form-control"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <button
              id="search_button"
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={isLoading}
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      {isLoading ? <Loader /> : (
        data?.reviews?.length > 0 ? (
          <table className="table table-bordered table-striped mt-5">
            <thead>
              <tr>
                <th>Review ID</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.reviews?.map((review) => (
                <tr key={review?._id}>
                  <td>{review?._id}</td>
                  <td>{review?.rating}</td>
                  <td>{review?.comment}</td>
                  <td>{review?.user?.name}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger ms-2"
                      onClick={() => deleteReviewHandler(review?._id)}
                      disabled={isDeleteLoading}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-5 text-center">No Reviews Found</p>
        )
      )}
    </AdminLayout>
  );
};

export default ProductReviews;