export type InquiryStatus = "new" | "contacted" | "closed";

export type Inquiry = {
  id: string;
  car_id: string | null;
  phone: string;
  message: string;
  source: string;
  status: InquiryStatus;
  created_at: string;
};
