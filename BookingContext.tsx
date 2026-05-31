import { createContext, useContext, useState } from "react";

export interface BookingFormData {
  paymentType: "private-pay" | "insurance" | "";
  insuranceId: string;
  pickupAddress: string;
  pickupUnit: string;
  dropoffAddress: string;
  facilityName: string;
  date: string;
  pickupTime: string;
  tripType: "one-way" | "round-trip" | "recurring";
  returnTime: string;
  assistanceType: "ambulatory" | "wheelchair-own" | "wheelchair-provided" | "stretcher";
  oxygenTank: boolean;
  companions: string;
  passengerName: string;
  passengerDob: string;
  bookerName: string;
  bookerPhone: string;
  bookerEmail: string;
  relationship: "self" | "child" | "case-manager" | "facility-coordinator";
}

const defaultFormData: BookingFormData = {
  paymentType: "",
  insuranceId: "",
  pickupAddress: "",
  pickupUnit: "",
  dropoffAddress: "",
  facilityName: "",
  date: "",
  pickupTime: "",
  tripType: "one-way",
  returnTime: "",
  assistanceType: "ambulatory",
  oxygenTank: false,
  companions: "0",
  passengerName: "",
  passengerDob: "",
  bookerName: "",
  bookerPhone: "",
  bookerEmail: "",
  relationship: "self",
};

interface BookingContextType {
  formData: BookingFormData;
  setFormData: (data: Partial<BookingFormData>) => void;
  resetFormData: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormDataState] = useState<BookingFormData>(defaultFormData);

  const setFormData = (data: Partial<BookingFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormDataState(defaultFormData);
  };

  return (
    <BookingContext.Provider value={{ formData, setFormData, resetFormData }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
