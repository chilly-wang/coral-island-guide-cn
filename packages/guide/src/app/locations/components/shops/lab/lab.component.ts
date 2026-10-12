import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ShopName } from "@ci/data-types";
import { BaseDevelopShopComponent, DEVELOP_SHOP_IMPORTS } from "../../base-develop-shop/base-develop-shop.component";

@Component({
    selector: 'app-lab',
    templateUrl: '../../base-develop-shop/base-develop-shop.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [...DEVELOP_SHOP_IMPORTS]
})
export class LabComponent extends BaseDevelopShopComponent {

    protected shopName: ShopName = "lab";

    constructor() {
        super();
        this.shopItemData$ = this._database.fetchShopItemData$(this.shopName);
        this.openingHours$ = this._database.fetchOpeningHours$(this.shopName);
        this.itemProcessing$ = this._database.fetchShopProcessItems$(this.shopName);
        this.itemUpgrade$ = this._database.fetchItemUpgradeData$(this.shopName);
        this.developEquipment$ = this._database.fetchDevelopEquipment$(this.shopName);
    }

}
