import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewForm = ({ noteId, existingReview, refreshReviews }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setComment(existingReview.comment);
      setRating(existingReview.rating || '');
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `/api/notes/${noteId}/reviews`,
        { comment, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      refreshReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        placeholder="Leave a helpful comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <select
        className="border rounded p-2 w-full"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
      >
        <option value="" disabled>Select Star Rating (required)</option>
        {[1, 2, 3, 4, 5].map(num => (
          <option key={num} value={num}>{num} ★</option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {existingReview ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
