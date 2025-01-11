import React, { useState, useEffect } from "react";
import { FaStar, FaTimes } from "react-icons/fa";

const ReviewForm: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Open and close the modal
  const toggleModal = () => setIsOpen(!isOpen);

  // Check if a review was previously submitted
  useEffect(() => {
    const submitted = localStorage.getItem("hasSubmittedReview");
    if (submitted === "true") {
      setHasSubmitted(true);
    }
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(
      "Thank you for your review! It will be published once our team reviews it."
    );
    setRating(0);
    setReviewText("");
    setImage(null);
    setHasSubmitted(true);
    localStorage.setItem("hasSubmittedReview", "true");
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Don't show the floating button if the review has been submitted
  if (hasSubmitted && !isOpen) return null;

  return (
    <>
      {/* Floating Button to open the modal */}
      {!hasSubmitted && (
        <button
          onClick={toggleModal}
          className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-md hover:bg-blue-700 transition-all"
        >
          Leave a Review
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Leave a Review
            </h2>

            {feedback ? (
              <p className="text-green-600 text-center">{feedback}</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Star Rating */}
                <div className="flex items-center mb-4">
                  <span className="text-gray-600 mr-4">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-xl ${
                        rating >= star ? "text-yellow-500" : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>

                {/* Review Text */}
                <div className="mb-4">
                  <label htmlFor="review" className="block text-gray-600 mb-2">
                    Your Review (100 characters or less):
                  </label>
                  <textarea
                    id="review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    maxLength={100}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    rows={3}
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2">
                    Upload Your Photo (optional):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-gray-600 border border-gray-300 p-2 rounded-md focus:outline-none"
                  />
                  {image && (
                    <p className="mt-2 text-sm text-gray-500">{image.name}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
                  disabled={rating === 0 || reviewText.trim() === ""}
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewForm;
