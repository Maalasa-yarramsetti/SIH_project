import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext'; // <-- IMPORT THE AUTH HOOK
import './ReviewsSection.css';

// Mock data
const mockReviews = [
    { id: 1, author: 'Tourist A', rating: 5, comment: 'Absolutely breathtaking! A must-visit for spiritual seekers.' },
    { id: 2, author: 'Traveler B', rating: 4, comment: 'Very peaceful and well-maintained. The murals are incredible.' }
];

const ReviewsSection = ({ monasteryId }) => {
    const { user } = useAuth(); // <-- GET THE CURRENT USER
    const [reviews, setReviews] = useState(mockReviews);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment && newRating > 0) {
            const newReview = {
                id: Date.now(),
                author: user.username, // <-- USE THE LOGGED-IN USER'S NAME
                rating: newRating,
                comment: newComment
            };
            setReviews([newReview, ...reviews]);
            setNewComment('');
            setNewRating(0);
            alert('Thank you for your review!');
        } else {
            alert('Please provide a rating and a comment.');
        }
    };

    return (
        <div className="reviews-section">
            <h2>Visitor Reviews & Ratings</h2>
            
            <div className="review-form-container">
                <h3>Add Your Review as {user.username}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="rating-input">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <FaStar 
                                    key={index}
                                    className="star" 
                                    color={ratingValue <= (hoverRating || newRating) ? "#ffc107" : "#e4e5e9"}
                                    onClick={() => setNewRating(ratingValue)}
                                    onMouseEnter={() => setHoverRating(ratingValue)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            );
                        })}
                    </div>
                    <textarea 
                        placeholder="Share your experience..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button type="submit">Submit Review</button>
                </form>
            </div>

            <div className="reviews-list">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-author">{review.author}</div>
                        <div className="review-rating">
                            {[...Array(review.rating)].map((_, i) => <FaStar key={i} color="#ffc107" />)}
                        </div>
                        <p className="review-comment">"{review.comment}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsSection;