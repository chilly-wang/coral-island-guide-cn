import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ShopName } from "@ci/data-types";
import { BaseDevelopShopComponent, DEVELOP_SHOP_IMPORTS } from "../../base-develop-shop/base-develop-shop.component";

/** Cho Oyu's Oracle Chamber (神谕室) in the Merfolk Kingdom. */
@Component({
    selector: 'app-oracle-chamber',
    templateUrl: '../../base-develop-shop/base-develop-shop.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [...DEVELOP_SHOP_IMPORTS]
})
export class OracleChamberComponent extends BaseDevelopShopComponent {

    protected shopName: ShopName = "oracle-chamber";
    protected override developEquipmentHeaderText = 'APP.SHOP.UNDERWATER_CRAFTING_LAB';

    constructor() {
        super();
        this.shopItemData$ = this._database.fetchShopItemData$(this.shopName);
        this.tailShopItemData$ = this._database.fetchShopItemData$('oracle-chamber-tail' as ShopName);
        this.openingHours$ = this._database.fetchOpeningHours$(this.shopName);
        this.itemUpgrade$ = this._database.fetchItemUpgradeData$(this.shopName);
        this.developEquipment$ = this._database.fetchDevelopEquipment$(this.shopName);
    }

}
