/**
 * Recommendation priority helpers and icon selectors
 */

export function getRecommendationPriorityBadgeVariant(priority: 'low' | 'medium' | 'high') {
  switch (priority) {
    case 'high':
      return 'amber';
    case 'medium':
      return 'coral';
    case 'low':
    default:
      return 'teal';
  }
}
