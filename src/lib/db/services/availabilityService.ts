import { ObjectId } from "mongodb";
import { getDatabase } from "../mongodb";
import {
  CalendarDay,
  CreateBlockDto,
  MonthAvailabilityResponse,
  BlockedDateRecord,
} from "../../types/availability";

function formatDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateStr(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Generates month calendar days synthesizing confirmed/pending bookings and manual blockouts
 */
export async function getMonthAvailability(
  year: number,
  month: number // 1-indexed (1 = Jan, 12 = Dec)
): Promise<MonthAvailabilityResponse> {
  const db = await getDatabase();

  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  // Calendar Grid Start: previous Sunday
  const gridStart = new Date(firstDayOfMonth);
  gridStart.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  // Calendar Grid End: following Saturday
  const gridEnd = new Date(lastDayOfMonth);
  const daysUntilSaturday = 6 - lastDayOfMonth.getDay();
  gridEnd.setDate(lastDayOfMonth.getDate() + daysUntilSaturday);

  const gridStartStr = formatDateStr(gridStart);
  const gridEndStr = formatDateStr(gridEnd);
  const todayStr = formatDateStr(new Date());

  // 1. Fetch relevant bookings (confirmed, completed, pending)
  let bookings: any[] = [];
  try {
    bookings = await db
      .collection("bookings")
      .find({
        status: { $in: ["confirmed", "completed", "pending"] },
        checkIn: { $lte: gridEndStr },
        checkOut: { $gt: gridStartStr },
      })
      .toArray();
  } catch {
    bookings = [];
  }

  // 2. Fetch manual date blocks
  let blocks: any[] = [];
  try {
    blocks = await db
      .collection("blocked_dates")
      .find({
        startDate: { $lte: gridEndStr },
        endDate: { $gte: gridStartStr },
      })
      .toArray();
  } catch {
    blocks = [];
  }

  // Create date lookup maps
  // Date -> booking
  const bookingDateMap = new Map<string, any>();
  bookings.forEach((b) => {
    const start = parseDateStr(b.checkIn);
    const end = parseDateStr(b.checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dStr = formatDateStr(d);
      bookingDateMap.set(dStr, b);
    }
  });

  // Date -> block
  const blockDateMap = new Map<string, any>();
  blocks.forEach((blk) => {
    const start = parseDateStr(blk.startDate);
    const end = parseDateStr(blk.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dStr = formatDateStr(d);
      blockDateMap.set(dStr, blk);
    }
  });

  // Build grid days
  const days: CalendarDay[] = [];
  let availableCount = 0;
  let bookedCount = 0;
  let blockedCount = 0;
  let pendingCount = 0;

  for (
    let curr = new Date(gridStart);
    curr <= gridEnd;
    curr.setDate(curr.getDate() + 1)
  ) {
    const dStr = formatDateStr(curr);
    const isCurrentMonth = curr.getMonth() === month - 1;
    const isToday = dStr === todayStr;

    let status: "available" | "booked" | "blocked" | "pending" = "available";
    let bookingDetails = undefined;
    let blockDetails = undefined;

    const matchedBooking = bookingDateMap.get(dStr);
    const matchedBlock = blockDateMap.get(dStr);

    if (matchedBooking) {
      if (matchedBooking.status === "pending") {
        status = "pending";
      } else {
        status = "booked";
      }
      bookingDetails = {
        id: matchedBooking._id.toString(),
        bookingRef: matchedBooking.bookingRef || "REF",
        guestName: matchedBooking.guestName,
        checkIn: matchedBooking.checkIn,
        checkOut: matchedBooking.checkOut,
        status: matchedBooking.status,
      };
    } else if (matchedBlock) {
      status = "blocked";
      blockDetails = {
        id: matchedBlock._id.toString(),
        reason: matchedBlock.reason,
        notes: matchedBlock.notes,
        startDate: matchedBlock.startDate,
        endDate: matchedBlock.endDate,
      };
    }

    if (isCurrentMonth) {
      if (status === "booked") bookedCount++;
      else if (status === "blocked") blockedCount++;
      else if (status === "pending") pendingCount++;
      else availableCount++;
    }

    days.push({
      date: dStr,
      dayOfMonth: curr.getDate(),
      isCurrentMonth,
      isToday,
      status,
      bookingDetails,
      blockDetails,
    });
  }

  return {
    year,
    month,
    monthName: MONTH_NAMES[month - 1] || "Month",
    days,
    summary: {
      totalDays: lastDayOfMonth.getDate(),
      availableCount,
      bookedCount,
      blockedCount,
      pendingCount,
    },
  };
}

/**
 * Creates a manual date blockout
 */
export async function createDateBlock(
  dto: CreateBlockDto
): Promise<BlockedDateRecord> {
  const db = await getDatabase();

  if (dto.endDate < dto.startDate) {
    throw new Error("End date cannot precede start date.");
  }

  // Conflict check: ensure dates don't overlap with an already confirmed booking
  const conflictingBooking = await db.collection("bookings").findOne({
    status: { $in: ["confirmed", "completed"] },
    checkIn: { $lte: dto.endDate },
    checkOut: { $gt: dto.startDate },
  });

  if (conflictingBooking) {
    throw new Error(
      `Cannot block dates: Overlaps with confirmed reservation ${conflictingBooking.bookingRef} for ${conflictingBooking.guestName} (${conflictingBooking.checkIn} to ${conflictingBooking.checkOut}).`
    );
  }

  // Compute all individual date strings
  const dates: string[] = [];
  const start = parseDateStr(dto.startDate);
  const end = parseDateStr(dto.endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(formatDateStr(d));
  }

  const now = new Date().toISOString();
  const doc = {
    startDate: dto.startDate,
    endDate: dto.endDate,
    dates,
    reason: dto.reason,
    notes: dto.notes ? dto.notes.trim() : "",
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("blocked_dates").insertOne(doc);

  // Log activity
  try {
    await db.collection("activities").insertOne({
      type: "date_blocked",
      title: `Dates Blocked: ${dto.reason}`,
      description: `Blocked villa dates from ${dto.startDate} to ${dto.endDate} for ${dto.reason}.`,
      timestamp: now,
      createdAt: now,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }

  return {
    _id: result.insertedId.toString(),
    ...doc,
  };
}

/**
 * Releases / unblocks dates
 */
export async function deleteDateBlock(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;

  const db = await getDatabase();
  const block = await db
    .collection("blocked_dates")
    .findOne({ _id: new ObjectId(id) });
  if (!block) return false;

  await db.collection("blocked_dates").deleteOne({ _id: new ObjectId(id) });

  const now = new Date().toISOString();
  try {
    await db.collection("activities").insertOne({
      type: "date_released",
      title: "Dates Unblocked",
      description: `Released block for ${block.startDate} to ${block.endDate} (${block.reason}).`,
      timestamp: now,
      createdAt: now,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }

  return true;
}
