/**
 * Format a date string to a human-readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string (e.g., "September 21, 2023")
 */
export function toDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Format a date to include time
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date and time string
 */
export function toDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
} 