export type InquiryStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "resolved"
  | "archived";

export interface InquiryNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface CustomerInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  checkIn?: string; // YYYY-MM-DD
  checkOut?: string; // YYYY-MM-DD
  guests?: number;
  status: InquiryStatus;
  isRead: boolean;
  notes: InquiryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryDto {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export interface UpdateInquiryDto {
  status?: InquiryStatus;
  isRead?: boolean;
  addNote?: string;
}

export interface InquiryFilterOptions {
  status?: InquiryStatus | "all";
  readStatus?: "all" | "read" | "unread";
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface InquiryStats {
  total: number;
  unread: number;
  newCount: number;
  contactedCount: number;
  inProgressCount: number;
  resolvedCount: number;
  archivedCount: number;
}
