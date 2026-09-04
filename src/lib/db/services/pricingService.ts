import { ObjectId } from "mongodb";
import { getDatabase } from "../mongodb";
import {
  BaseRateConfig,
  SeasonalRule,
  AdditionalCharge,
  CreateSeasonDto,
  CreateChargeDto,
} from "../../types/pricing";

const DEFAULT_BASE_RATE: BaseRateConfig = {
  villaName: "Villa B on the Sea (5-Bedroom Estate)",
  nightlyRate: 2500,
  minStay: 3,
  currency: "USD",
  updatedAt: new Date().toISOString(),
};

const DEFAULT_CHARGES: Array<Omit<AdditionalCharge, "_id">> = [
  {
    name: "Government Tourism Levy",
    amount: 13,
    type: "percentage",
    description: "Standard Anguilla island tourism tax",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Villa Staff Service Charge",
    amount: 10,
    type: "percentage",
    description: "Villa concierge and butler service gratuity",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Departure Cleaning Fee",
    amount: 450,
    type: "fixed",
    description: "Deep sanitized departure cleaning",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// --- 1. Base Rate Service ---

export async function getBaseRate(): Promise<BaseRateConfig> {
  const db = await getDatabase();
  const existing = await db.collection("pricing_base").findOne({});

  if (existing) {
    return {
      villaName: existing.villaName || DEFAULT_BASE_RATE.villaName,
      nightlyRate: Number(existing.nightlyRate) || DEFAULT_BASE_RATE.nightlyRate,
      minStay: Number(existing.minStay) || DEFAULT_BASE_RATE.minStay,
      currency: existing.currency || "USD",
      updatedAt: existing.updatedAt || new Date().toISOString(),
    };
  }

  // Insert default base rate if not present
  await db.collection("pricing_base").insertOne(DEFAULT_BASE_RATE);
  return DEFAULT_BASE_RATE;
}

export async function updateBaseRate(
  data: Partial<BaseRateConfig>
): Promise<BaseRateConfig> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const updateFields: any = {
    updatedAt: now,
  };

  if (data.villaName !== undefined) updateFields.villaName = data.villaName.trim();
  if (data.nightlyRate !== undefined) updateFields.nightlyRate = Math.max(0, Number(data.nightlyRate));
  if (data.minStay !== undefined) updateFields.minStay = Math.max(1, Number(data.minStay));
  if (data.currency !== undefined) updateFields.currency = data.currency.trim().toUpperCase();

  await db.collection("pricing_base").updateOne(
    {},
    { $set: updateFields },
    { upsert: true }
  );

  return getBaseRate();
}

// --- 2. Seasonal Rules Service ---

export async function checkSeasonConflict(
  startDate: string,
  endDate: string,
  excludeId?: string
): Promise<{ hasConflict: boolean; conflictingSeason?: any }> {
  const db = await getDatabase();

  const query: any = {
    isActive: true,
    // Overlap: existing.startDate <= newEndDate AND existing.endDate >= newStartDate
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  };

  if (excludeId && ObjectId.isValid(excludeId)) {
    query._id = { $ne: new ObjectId(excludeId) };
  }

  const conflictingSeason = await db.collection("pricing_seasons").findOne(query);

  return {
    hasConflict: !!conflictingSeason,
    conflictingSeason: conflictingSeason || undefined,
  };
}

export async function listSeasonalRules(): Promise<SeasonalRule[]> {
  const db = await getDatabase();
  const docs = await db
    .collection("pricing_seasons")
    .find({})
    .sort({ startDate: 1 })
    .toArray();

  return docs.map((doc) => ({
    _id: doc._id.toString(),
    name: doc.name,
    startDate: doc.startDate,
    endDate: doc.endDate,
    nightlyRate: Number(doc.nightlyRate),
    minStay: Number(doc.minStay),
    description: doc.description || "",
    isActive: doc.isActive !== false,
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || new Date().toISOString(),
  }));
}

export async function createSeasonalRule(
  dto: CreateSeasonDto
): Promise<SeasonalRule> {
  const db = await getDatabase();

  if (dto.endDate <= dto.startDate) {
    throw new Error("Season end date must be strictly after start date.");
  }

  if (dto.nightlyRate < 0) {
    throw new Error("Nightly rate cannot be negative.");
  }

  // Conflict check if active
  if (dto.isActive !== false) {
    const { hasConflict, conflictingSeason } = await checkSeasonConflict(
      dto.startDate,
      dto.endDate
    );
    if (hasConflict) {
      throw new Error(
        `Date range conflicts with active season "${conflictingSeason.name}" (${conflictingSeason.startDate} to ${conflictingSeason.endDate}).`
      );
    }
  }

  const now = new Date().toISOString();
  const newDoc = {
    name: dto.name.trim(),
    startDate: dto.startDate,
    endDate: dto.endDate,
    nightlyRate: Number(dto.nightlyRate),
    minStay: Math.max(1, Number(dto.minStay) || 3),
    description: dto.description ? dto.description.trim() : "",
    isActive: dto.isActive !== false,
    createdAt: now,
    updatedAt: now,
  };

  const res = await db.collection("pricing_seasons").insertOne(newDoc);

  return {
    _id: res.insertedId.toString(),
    ...newDoc,
  };
}

export async function updateSeasonalRule(
  id: string,
  dto: Partial<CreateSeasonDto>
): Promise<SeasonalRule | null> {
  if (!ObjectId.isValid(id)) return null;

  const db = await getDatabase();
  const existing = await db
    .collection("pricing_seasons")
    .findOne({ _id: new ObjectId(id) });
  if (!existing) return null;

  const targetStart = dto.startDate || existing.startDate;
  const targetEnd = dto.endDate || existing.endDate;
  const targetActive = dto.isActive !== undefined ? dto.isActive : existing.isActive;

  if (targetEnd <= targetStart) {
    throw new Error("Season end date must be strictly after start date.");
  }

  // Collision check if target status is active
  if (targetActive) {
    const { hasConflict, conflictingSeason } = await checkSeasonConflict(
      targetStart,
      targetEnd,
      id
    );
    if (hasConflict) {
      throw new Error(
        `Date range conflicts with active season "${conflictingSeason.name}" (${conflictingSeason.startDate} to ${conflictingSeason.endDate}).`
      );
    }
  }

  const now = new Date().toISOString();
  const updateFields: any = {
    updatedAt: now,
  };

  if (dto.name !== undefined) updateFields.name = dto.name.trim();
  if (dto.startDate !== undefined) updateFields.startDate = dto.startDate;
  if (dto.endDate !== undefined) updateFields.endDate = dto.endDate;
  if (dto.nightlyRate !== undefined) updateFields.nightlyRate = Math.max(0, Number(dto.nightlyRate));
  if (dto.minStay !== undefined) updateFields.minStay = Math.max(1, Number(dto.minStay));
  if (dto.description !== undefined) updateFields.description = dto.description.trim();
  if (dto.isActive !== undefined) updateFields.isActive = dto.isActive;

  await db
    .collection("pricing_seasons")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

  const updated = await db
    .collection("pricing_seasons")
    .findOne({ _id: new ObjectId(id) });
  if (!updated) return null;

  return {
    _id: updated._id.toString(),
    name: updated.name,
    startDate: updated.startDate,
    endDate: updated.endDate,
    nightlyRate: Number(updated.nightlyRate),
    minStay: Number(updated.minStay),
    description: updated.description || "",
    isActive: updated.isActive,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

export async function deleteSeasonalRule(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDatabase();
  const res = await db
    .collection("pricing_seasons")
    .deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

// --- 3. Additional Charges Service ---

export async function listAdditionalCharges(): Promise<AdditionalCharge[]> {
  const db = await getDatabase();
  const count = await db.collection("pricing_charges").countDocuments();

  if (count === 0) {
    // Seed initial villa fee defaults
    await db.collection("pricing_charges").insertMany(DEFAULT_CHARGES as any);
  }

  const docs = await db
    .collection("pricing_charges")
    .find({})
    .sort({ createdAt: 1 })
    .toArray();

  return docs.map((doc) => ({
    _id: doc._id.toString(),
    name: doc.name,
    amount: Number(doc.amount),
    type: doc.type,
    description: doc.description || "",
    isActive: doc.isActive !== false,
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || new Date().toISOString(),
  }));
}

export async function createAdditionalCharge(
  dto: CreateChargeDto
): Promise<AdditionalCharge> {
  const db = await getDatabase();

  if (!dto.name || !dto.name.trim()) {
    throw new Error("Charge name is required.");
  }

  if (dto.amount < 0) {
    throw new Error("Charge amount cannot be negative.");
  }

  const now = new Date().toISOString();
  const newDoc = {
    name: dto.name.trim(),
    amount: Number(dto.amount),
    type: dto.type,
    description: dto.description ? dto.description.trim() : "",
    isActive: dto.isActive !== false,
    createdAt: now,
    updatedAt: now,
  };

  const res = await db.collection("pricing_charges").insertOne(newDoc);

  return {
    _id: res.insertedId.toString(),
    ...newDoc,
  };
}

export async function updateAdditionalCharge(
  id: string,
  dto: Partial<CreateChargeDto>
): Promise<AdditionalCharge | null> {
  if (!ObjectId.isValid(id)) return null;

  const db = await getDatabase();
  const now = new Date().toISOString();
  const updateFields: any = {
    updatedAt: now,
  };

  if (dto.name !== undefined) updateFields.name = dto.name.trim();
  if (dto.amount !== undefined) updateFields.amount = Math.max(0, Number(dto.amount));
  if (dto.type !== undefined) updateFields.type = dto.type;
  if (dto.description !== undefined) updateFields.description = dto.description.trim();
  if (dto.isActive !== undefined) updateFields.isActive = dto.isActive;

  await db
    .collection("pricing_charges")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

  const updated = await db
    .collection("pricing_charges")
    .findOne({ _id: new ObjectId(id) });
  if (!updated) return null;

  return {
    _id: updated._id.toString(),
    name: updated.name,
    amount: Number(updated.amount),
    type: updated.type,
    description: updated.description || "",
    isActive: updated.isActive,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

export async function deleteAdditionalCharge(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDatabase();
  const res = await db
    .collection("pricing_charges")
    .deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}
