"use client"

/**
 * Format a date for task notifications
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Today", "Tomorrow", "In 2 days", "2 days ago", "May 15")
 */
export function formatNotificationDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays > 1 && diffDays <= 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < 0 && diffDays >= -7) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

/**
 * Format time from a date string
 * @param dateString ISO date string
 * @returns Formatted time string (e.g., "09:30 AM")
 */
export function formatNotificationTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get appropriate CSS class based on task status and due date
 */
export function getNotificationPriorityClass(dueDate: string, status: string): string {
  const date = new Date(dueDate);
  const now = new Date();
  
  // If task is already overdue, show as high priority (red)
  if (date < now && status !== 'COMPLETED') {
    return "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400";
  }
  
  // If task is due within 24 hours, show as medium priority (orange)
  const oneDayFromNow = new Date(now);
  oneDayFromNow.setHours(now.getHours() + 24);
  
  if (date < oneDayFromNow && status !== 'COMPLETED') {
    return "text-warning-700 bg-warning-50 dark:bg-warning-500/15 dark:text-orange-400";
  }
  
  // Otherwise, show as normal priority (blue/brand)
  return "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400";
}
