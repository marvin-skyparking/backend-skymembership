import { DateTime } from 'luxon';

// Get current time in Asia/Jakarta timezone
export const DateTimes = DateTime.now().setZone('Asia/Jakarta').toString();
