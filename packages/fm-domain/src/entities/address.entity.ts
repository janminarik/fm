import { BaseEntity, ICreateBaseEntityProps } from "./base.entity";

export interface ICreateAddressProps extends ICreateBaseEntityProps {
  street: string;
  city: string;
  postalcode: string;
  country: string;
}

export class Address extends BaseEntity {
  constructor({
    id,
    createdAt,
    updatedAt,
    street,
    city,
    postalcode,
    country,
  }: ICreateAddressProps) {
    super({ id, createdAt, updatedAt });
    this._street = street;
    this._city = city;
    this._postalcode = postalcode;
    this._country = country;
  }

  private _street: string;
  private _city: string;
  private _postalcode: string;
  private _country: string;

  get street(): string {
    return this._street;
  }

  get city(): string {
    return this._city;
  }

  get postalcode(): string {
    return this._postalcode;
  }

  get country(): string {
    return this._country;
  }
}
