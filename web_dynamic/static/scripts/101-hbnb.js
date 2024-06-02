document.addEventListener('DOMContentLoaded', (event) => {
    const toggleReviewsSpan = document.getElementById('toggle_reviews');
    const reviewsDiv = document.getElementById('reviews');

    toggleReviewsSpan.addEventListener('click', () => {
        if (toggleReviewsSpan.textContent === 'show') {
            fetch('/api/v1/places/<place_id>/reviews') // Adjust the endpoint as necessary
                .then(response => response.json())
                .then(reviews => {
                    reviews.forEach(review => {
                        const reviewElement = document.createElement('div');
                        reviewElement.className = 'review';
                        reviewElement.innerHTML = `
                            <h3>${review.user.first_name} ${review.user.last_name}</h3>
                            <p>${review.text}</p>
                            <p>${review.created_at}</p>
                        `;
                        reviewsDiv.appendChild(reviewElement);
                    });
                    toggleReviewsSpan.textContent = 'hide';
                });
        } else {
            while (reviewsDiv.firstChild) {
                reviewsDiv.removeChild(reviewsDiv.firstChild);
            }
            toggleReviewsSpan.textContent = 'show';
        }
    });
});

