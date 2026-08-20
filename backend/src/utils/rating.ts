export function withRating<T extends { reviews: { rating: number }[] }>({ reviews, ...resource }: T) {
  return {
    ...resource,
    avgRating: reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null,
    reviewCount: reviews.length,
  };
}
