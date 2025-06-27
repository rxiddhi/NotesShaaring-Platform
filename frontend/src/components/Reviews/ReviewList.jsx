import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';

const ReviewList = ({ noteId, currentUserId }) => {
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchReviews = React.useCallback(async () => {
    try {
        const res = await axios.get(`/api/notes/${noteId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [noteId]);

  const handleDelete = async () => {
    if (window.confirm('Delete your review?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/notes/${noteId}/reviews`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditing(null);
        fetchReviews();
      } catch (err) {
        console.error(err);
        alert('Failed to delete review.');
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const currentUserReview = reviews.find(r => r.user._id === currentUserId);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">⭐ Reviews</h3>

      {currentUserId ? (
        <div className="mb-4 p-4 bg-blue-50 rounded">
          {editing && (
            <p className="mb-2 font-medium text-blue-800">Update Your Review</p>
          )}
          {!currentUserReview && !editing && (
            <p className="mb-2 font-medium text-blue-800">Add a Review</p>
          )}
          {/* Only show form if adding or editing */}
          {(!currentUserReview || editing) ? (
            <ReviewForm
              noteId={noteId}
              existingReview={editing || null}
              refreshReviews={() => { fetchReviews(); setEditing(null); }}
            />
          ) : (
            <div className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <strong>{currentUserReview.user.name}</strong>
                <span className="text-yellow-500">{'★'.repeat(currentUserReview.rating || 0)}</span>
              </div>
              <p className="mt-1">{currentUserReview.comment}</p>
              <div className="text-xs text-gray-500">
                {new Date(currentUserReview.createdAt).toLocaleString()}
                {currentUserReview.updatedAt && currentUserReview.updatedAt !== currentUserReview.createdAt && ' (edited)'}
              </div>
              <div className="text-right space-x-2 mt-1">
                <button
                  onClick={() => setEditing(currentUserReview)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">🔒 Please login to leave a review.</p>
      )}

      <div className="mt-4 space-y-4">
        {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
        {reviews.filter(r => r.user._id !== currentUserId).map((review) => (
          <div key={review._id} className="border rounded p-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <strong>{review.user.name}</strong>
              <span className="text-yellow-500">{'★'.repeat(review.rating || 0)}</span>
            </div>
            <p className="mt-1">{review.comment}</p>
            <div className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleString()}
              {review.updatedAt && review.updatedAt !== review.createdAt && ' (edited)'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
