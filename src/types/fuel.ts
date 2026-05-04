export interface FuelMetadata {
  runningDate?: string;
  petroCardBalance?: string; // This will be the Closing Balance
  openingBalance?: string;
  vehicleCode?: string;
  vehicleNo?: string;
  startKm?: string;
  endKm?: string;
  totalKm?: string;
  totalDiesel?: string;
  ratePerLitre?: string;
  totalAmount?: string;
  averageKm?: string;
  remarks?: string;
  [key: string]: unknown;
}

export interface FuelRecord {
  _id: string;
  title: string;
  documentType: "Fuel";
  files: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  metadata: FuelMetadata;
  createdAt: string;
  updatedAt: string;
}
