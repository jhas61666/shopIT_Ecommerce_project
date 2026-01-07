import React from 'react';

const ListReviews = ({ reviews }) => {
  return (
    <div className="reviews w-75">
      <h3>Other's Reviews:</h3>
      <hr />
      
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review?._id} className="review-card my-3">
            <div className="row">
              <div className="col-1">
                <img
                  src={review?.user?.avatar ? review?.user?.avatar?.url : "/images/default_avatar.jpg"}
                  alt={review?.user?.name}
                  width="50"
                  height="50"
                  className="rounded-circle"
                />
              </div>
              <div className="col-11">
                {/* Dynamic Star Ratings */}
                <div className="star-ratings">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fa fa-star ${star <= review?.rating ? 'orange' : 'star-active'}`}
                    ></i>
                  ))}
                </div>
                
                <p className="review_user">by {review?.user?.name}</p>
                <p className="review_comment">{review?.comment}</p>
              </div>
            </div>
            <hr />
          </div>
        ))
      ) : (
        <p className="mt-5">No reviews yet.</p>
      )}
    </div>
  );
};

export default ListReviews;