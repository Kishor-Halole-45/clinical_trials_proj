import type { MonitoringRecord } from '../types'

export const monitoringRecords: MonitoringRecord[] = [
  { id: 'MON-001', study: 'AIIA-AYU-001', site: 'New Delhi', monitor: 'Dr. Rohan Iyer', visitType: 'Initiation', plannedDate: '2026-09-12', actualDate: '2026-09-14', findings: 2, status: 'Completed' },
  { id: 'MON-002', study: 'AIIA-AYU-003', site: 'Jaipur', monitor: 'Dr. Aditi Rao', visitType: 'Routine', plannedDate: '2026-09-10', actualDate: '2026-09-11', findings: 1, status: 'Completed' },
  { id: 'MON-003', study: 'AIIA-AYU-006', site: 'Patna', monitor: 'Dr. Kunal Das', visitType: 'Remote', plannedDate: '2026-09-09', actualDate: '2026-09-18', findings: 4, status: 'Overdue' },
  { id: 'MON-004', study: 'AIIA-AYU-010', site: 'Nagpur', monitor: 'Dr. Nidhi Shah', visitType: 'Close-out', plannedDate: '2026-09-14', actualDate: undefined, findings: 6, status: 'Scheduled' },
  { id: 'MON-005', study: 'AIIA-AYU-005', site: 'Indore', monitor: 'Dr. Surya Kapoor', visitType: 'Data Review', plannedDate: '2026-09-16', actualDate: '2026-09-17', findings: 1, status: 'Completed' },
  { id: 'MON-006', study: 'AIIA-AYU-002', site: 'Kerala', monitor: 'Dr. Pankaj Sen', visitType: 'Routine', plannedDate: '2026-09-18', actualDate: undefined, findings: 2, status: 'Scheduled' },
  { id: 'MON-007', study: 'AIIA-AYU-004', site: 'Karnataka', monitor: 'Dr. Rakesh Sinha', visitType: 'Safety', plannedDate: '2026-09-20', actualDate: undefined, findings: 5, status: 'Scheduled' },
  { id: 'MON-008', study: 'AIIA-AYU-009', site: 'Hyderabad', monitor: 'Dr. Mehul Desai', visitType: 'Routine', plannedDate: '2026-09-08', actualDate: '2026-09-10', findings: 3, status: 'Completed' },
  { id: 'MON-009', study: 'AIIA-AYU-008', site: 'Shillong', monitor: 'Dr. Tanvi Patil', visitType: 'Audit', plannedDate: '2026-09-12', actualDate: '2026-09-15', findings: 2, status: 'Completed' },
  { id: 'MON-010', study: 'AIIA-AYU-007', site: 'Chennai', monitor: 'Dr. Aditya Iyer', visitType: 'Monitoring', plannedDate: '2026-09-22', actualDate: undefined, findings: 1, status: 'Scheduled' },
  { id: 'MON-011', study: 'AIIA-AYU-001', site: 'Bhopal', monitor: 'Dr. Rohan Iyer', visitType: 'Routine', plannedDate: '2026-09-11', actualDate: '2026-09-13', findings: 2, status: 'Completed' },
  { id: 'MON-012', study: 'AIIA-AYU-003', site: 'Maharashtra', monitor: 'Dr. Kunal Das', visitType: 'Monitoring', plannedDate: '2026-09-19', actualDate: undefined, findings: 4, status: 'Scheduled' },
  { id: 'MON-013', study: 'AIIA-AYU-006', site: 'Ahmedabad', monitor: 'Dr. Namita Shah', visitType: 'Site Assessment', plannedDate: '2026-09-17', actualDate: '2026-09-21', findings: 2, status: 'Completed' },
  { id: 'MON-014', study: 'AIIA-AYU-010', site: 'Bhubaneswar', monitor: 'Dr. Nidhi Shah', visitType: 'Routine', plannedDate: '2026-09-13', actualDate: undefined, findings: 5, status: 'Overdue' },
  { id: 'MON-015', study: 'AIIA-AYU-005', site: 'Lucknow', monitor: 'Dr. Surya Kapoor', visitType: 'Initiation', plannedDate: '2026-09-15', actualDate: '2026-09-19', findings: 1, status: 'Completed' },
  { id: 'MON-016', study: 'AIIA-AYU-002', site: 'Trivandrum', monitor: 'Dr. Pankaj Sen', visitType: 'Routine', plannedDate: '2026-09-23', actualDate: undefined, findings: 2, status: 'Scheduled' },
  { id: 'MON-017', study: 'AIIA-AYU-009', site: 'Noida', monitor: 'Dr. Mehul Desai', visitType: 'Audit', plannedDate: '2026-09-21', actualDate: undefined, findings: 3, status: 'Scheduled' },
  { id: 'MON-018', study: 'AIIA-AYU-008', site: 'Raipur', monitor: 'Dr. Tanvi Patil', visitType: 'Routine', plannedDate: '2026-09-26', actualDate: undefined, findings: 2, status: 'Scheduled' },
  { id: 'MON-019', study: 'AIIA-AYU-007', site: 'Agra', monitor: 'Dr. Aditya Iyer', visitType: 'Routine', plannedDate: '2026-09-07', actualDate: '2026-09-09', findings: 1, status: 'Completed' },
  { id: 'MON-020', study: 'AIIA-AYU-010', site: 'Pune', monitor: 'Dr. Nidhi Shah', visitType: 'Safety', plannedDate: '2026-09-25', actualDate: undefined, findings: 6, status: 'Scheduled' },
]
