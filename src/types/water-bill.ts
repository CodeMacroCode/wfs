export interface WaterBillMetadata {
  accountName: string;
  accountNumber: string;
  billDate?: string;
  dueDate?: string;
  billFrom?: string;
  billTo?: string;
  isFromAverage?: boolean;
  isToAverage?: boolean;
  isAverage?: boolean;
  connectionSize?: string;
  billPeriod?: string;
  oldReading?: string;
  newReading?: string;
  actualReading?: string;
  unit?: string;
  costPerUnit?: string;
  currentWaterCharges?: string;
  sewerageCess?: string;
  sewerageCessPercentage?: string;
  maintenanceCharges?: string;
  meterRentals?: string;
  garbageCharges?: string;
  sundryCharges?: string;
  arrears?: string;
  totalAmount?: string;
  adjPrevBill?: string;
  mcTax?: string;
  latePaymentSurcharge?: string;
  paidAmount?: string;
  paidOn?: string;
  paidUnitRate?: string;
  unitRemarks?: string;
  remarks?: string;
  [key: string]: unknown;
}

export interface WaterBillRecord {
  _id: string;
  title: string;
  documentType: "Water";
  files: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  metadata: WaterBillMetadata;
  createdAt: string;
  updatedAt: string;
}
