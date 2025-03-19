import { Address } from "./address.entity";
import { BaseEntity, ICreateBaseEntityProps, ID } from "./base.entity";
import { DigitalContent } from "./digital-content.entity";
import { Maintenance } from "./maintenance.entity";
import {
  AdSpaceStatus,
  AdSpaceType,
  AdSpaceVisibility,
} from "../enums/ad-space.enum";

export interface ICreateAdSpaceProps extends ICreateBaseEntityProps {
  id: ID;
  name: string;
  type: AdSpaceType;
  visibility: AdSpaceVisibility;
  status: AdSpaceStatus;
  addressId?: string;
  address?: Address;
  contents?: DigitalContent[];
  maintenance?: Maintenance[];
}

export class AdSpace extends BaseEntity {
  constructor({
    id,
    createdAt,
    updatedAt,
    name,
    type,
    visibility,
    status,
    addressId,
    address,
    contents,
    maintenance,
  }: ICreateAdSpaceProps) {
    super({ id, createdAt, updatedAt });
    this._name = name;
    this._type = type;
    this._visibility = visibility;
    this._status = status;
    this._addressId = addressId ?? null;
    this._address = address ?? null;
    this._contents = contents ?? [];
    this._maintenance = maintenance ?? [];
  }

  private _name: string;
  private _type: AdSpaceType;
  private _visibility: AdSpaceVisibility;
  private _status: AdSpaceStatus;
  private _addressId: string | null;
  private _address: Address | null;
  private _contents: DigitalContent[];
  private _maintenance: Maintenance[];

  get name(): string {
    return this._name;
  }

  get type(): AdSpaceType {
    return this._type;
  }

  get visibility(): AdSpaceVisibility {
    return this._visibility;
  }

  get status(): AdSpaceStatus {
    return this._status;
  }

  get addressId(): string | null {
    return this._addressId;
  }

  get address(): Address | null {
    return this._address;
  }

  get contents(): DigitalContent[] {
    return this._contents;
  }

  get maintenance(): Maintenance[] {
    return this._maintenance;
  }
}
