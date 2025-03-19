export interface CreateAddressDto {
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  postalcode: string;
  street: string;
}
