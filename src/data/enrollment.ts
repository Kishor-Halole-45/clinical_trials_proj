import type { EnrollmentMetric } from '../types'

export const enrollmentSummary: EnrollmentMetric = {
  label: 'Portfolio Enrollment',
  actual: 1284,
  target: 2000,
  completion: 64,
  velocity: 73,
  screened: 1775,
  randomized: 1284,
  screeningToEnrollment: 72,
}

export const siteEnrollmentData = [
  { site: 'New Delhi', actual: 128, target: 150 },
  { site: 'Bengaluru', actual: 118, target: 140 },
  { site: 'Pune', actual: 96, target: 110 },
  { site: 'Jaipur', actual: 105, target: 120 },
  { site: 'Bhopal', actual: 88, target: 100 },
  { site: 'Hyderabad', actual: 92, target: 108 },
  { site: 'Chennai', actual: 103, target: 112 },
  { site: 'Lucknow', actual: 90, target: 105 },
]

export const enrollmentTrendData = [
  { date: 'Jan', target: 150, actual: 122 },
  { date: 'Feb', target: 165, actual: 138 },
  { date: 'Mar', target: 190, actual: 154 },
  { date: 'Apr', target: 210, actual: 169 },
  { date: 'May', target: 236, actual: 183 },
  { date: 'Jun', target: 260, actual: 206 },
  { date: 'Jul', target: 285, actual: 228 },
  { date: 'Aug', target: 310, actual: 256 },
  { date: 'Sep', target: 340, actual: 284 },
  { date: 'Oct', target: 370, actual: 313 },
  { date: 'Nov', target: 400, actual: 346 },
  { date: 'Dec', target: 430, actual: 382 },
]

export const enrollmentComparisonRows = [
  { site: 'New Delhi', target: 150, actual: 128, progress: 85, status: 'On Track' },
  { site: 'Bengaluru', target: 140, actual: 118, progress: 84, status: 'On Track' },
  { site: 'Pune', target: 110, actual: 96, progress: 87, status: 'On Track' },
  { site: 'Jaipur', target: 120, actual: 105, progress: 88, status: 'Healthy' },
  { site: 'Bhopal', target: 100, actual: 88, progress: 88, status: 'Healthy' },
  { site: 'Hyderabad', target: 108, actual: 92, progress: 85, status: 'Watch' },
  { site: 'Chennai', target: 112, actual: 103, progress: 92, status: 'Healthy' },
  { site: 'Lucknow', target: 105, actual: 90, progress: 86, status: 'Watch' },
]
