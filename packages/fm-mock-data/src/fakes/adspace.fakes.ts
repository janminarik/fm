import { en, Faker } from "@faker-js/faker";
import { AdSpaceStatus, AdSpaceType, AdSpaceVisibility } from "@repo/fm-domain";

import { BaseFake } from "./base.fake";

export class AdSpaceFake extends BaseFake {
  private _adSpaceType = Object.values(AdSpaceType);
  private _adSpaceVisibility = Object.values(AdSpaceVisibility);
  private _adSpaceStatus = Object.values(AdSpaceStatus);

  constructor() {
    super();
    this.faker = new Faker({ locale: [en] });
  }

  adSpaceType(): AdSpaceType {
    return this.faker.helpers.arrayElement(this._adSpaceType);
  }

  adSpaceVisibility(): AdSpaceVisibility {
    return this.faker.helpers.arrayElement(this._adSpaceVisibility);
  }

  adSpaceStatus(): AdSpaceStatus {
    return this.faker.helpers.arrayElement(this._adSpaceStatus);
  }

  name(): string {
    return `${this.faker.internet.domainName()}-${this.faker.number.int(9999)}`;
  }
}
