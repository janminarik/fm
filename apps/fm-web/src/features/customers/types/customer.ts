import { TEntityBase } from "../../../shared/utils/reduxUtils";

export interface Address {
  city: string;
  country: string;
  customerId: string;
  id: string;
  state?: string;
  street: string;
  zipCode: string;
}

export interface CreateCustomer {
  email: string;
  firstName: string;
  id?: string;
  isVerified: boolean;
  lastName: string;
  phoneNumber?: string;
}

export interface Customer extends TEntityBase<string> {
  createdAt: Date;
  email: string;
  firstName: string;
  id: string;
  isVerified: boolean;
  lastName: string;
  phoneNumber?: string;
  updatedAt: Date;
}

export interface CustomerDetail {
  customerId: string;
  id: string;
  newsletterSubscribed: boolean;
  preferredCurrency: string;
  preferredLanguage: string;
}

export interface OrderHistory {
  customerId: string;
  date: Date;
  id: string;
  orderId: string;
  totalAmount: number;
}
