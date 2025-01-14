// import CheckInHistory from '../models/check_in_history_model';
// import {CheckInHistoryAttributes } from '../models/check_in_history_model';
// import { Op } from 'sequelize';

// export async function upsertCheckInHistory(data: CheckInHistoryAttributes) {
//   const {
//     user_id,
//     plate_number,
//     location_name,
//     location_code,
//     status_member,
//     tariff,
//     check_in_time,
//     gate_in_time,
//     checkout_time,
//     gate_out_time,
//   } = data;

//   try {
//     // Step 1: Check if there is an existing record with no checkout and gate-out time (an ongoing check-in)
//     const existingRecord = await CheckInHistory.findOne({
//       where: {
//         user_id,
//         plate_number,
//         checkout_time: { [Op.is]: null },  // Check for null value in checkout_time
//         gate_out_time: { [Op.is]: null },   // Check for null value in gate_out_time
//       },
//     });

//     if (existingRecord) {
//       // Step 2: Handle existing record (must be in valid state)
//       if (existingRecord.gate_in_time && !existingRecord.checkout_time) {
//         // If gate-in exists but checkout is missing, update the checkout and gate-out times
//         if (checkout_time && !existingRecord.checkout_time) {
//           existingRecord.checkout_time = checkout_time; // Set checkout time
//           existingRecord.gate_out_time = gate_out_time; // Set gate-out time after checkout
//           await existingRecord.save();
//           return existingRecord;
//         } else {
//           throw new Error("Checkout time and gate-out time are required after gate-in.");
//         }
//       }

//       // If no valid transition, prevent processing further
//       throw new Error("Invalid transition. Please check the sequence of actions.");
//     } else {
//       // Step 3: No ongoing record found, create a new one
//       if (!gate_in_time) {
//         // If check-in time exists, proceed with creating a new record
//         const newCheckInHistory = await CheckInHistory.create({
//           user_id,
//           plate_number,
//           location_name,
//           location_code,
//           status_member,
//           tariff,
//           check_in_time, // check-in time
//           gate_in_time,  // gate-in time
//           checkout_time, // checkout time if provided
//           gate_out_time, // gate-out time if provided
//         });

//         return newCheckInHistory;
//       } else {
//         throw new Error("Gate-in cannot occur before check-in.");
//       }
//     }
//   } catch (error) {
//     console.error("Error upserting check-in history:", error);
//     throw new Error('Failed to upsert check-in history');
//   }
// }
