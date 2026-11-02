import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
import { BaseShopComponent } from "../base-shop/base-shop.component";
import { ItemUpgradeData, ShopItemData, ShopName } from "@ci/data-types";
import { MappedAnimalShopData } from "../../types/mapped-animal-shop-data.type";
import { AsyncPipe } from "@angular/common";
import { UiIconComponent } from "../../../shared/components/ui-icon/ui-icon.component";
import { ListDetailContainerComponent } from "../../../shared/components/list-detail-container/list-detail-container.component";
import { ShopItemDataDetailsComponent } from "../shop-item-data-details/shop-item-data-details.component";
import { AnimalDetailsComponent } from "../animal-details/animal-details.component";
import { CardComponent } from "../../../shared/components/card/card.component";
import { OpeningHoursComponent } from "../opening-hours/opening-hours.component";
import { DataFilterComponent } from "../../../shared/components/data-filter/data-filter.component";
import { ItemIconComponent } from "../../../shared/components/item-icon/item-icon.component";
import { ShopItemDataTableComponent } from "../tables/shop-item-data-table/shop-item-data-table.component";
import { AnimalMoodTableComponent } from "../tables/animal-mood-table/animal-mood-table.component";
import { ItemUpgradeDetailsComponent } from "../item-upgrade-details/item-upgrade-details.component";
import { ItemUpgradeTableComponent } from "../tables/item-upgrade-table/item-upgrade-table.component";
import { merge } from "../../../shared/util/http-resource-merge";

@Component({
    selector: 'app-underwater-ranch',
    templateUrl: './underwater-ranch.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AsyncPipe, UiIconComponent, ListDetailContainerComponent, ShopItemDataDetailsComponent, AnimalDetailsComponent, CardComponent, OpeningHoursComponent, DataFilterComponent, ItemIconComponent, ShopItemDataTableComponent, AnimalMoodTableComponent, ItemUpgradeDetailsComponent, ItemUpgradeTableComponent]
})
export class UnderwaterRanchComponent extends BaseShopComponent {

    override upgradeHeaderText = 'APP.SHOP.BUILDINGS';
    protected shopName: ShopName = "underwater-ranch";
    protected selectedAnimal?: MappedAnimalShopData
    protected sizeByMood = this._database.fetchAnimalMoodData();
    #animalRequests = merge(this._database.fetchAnimals(), this._database.fetchAnimalShopData(this.shopName))
    animalData = computed<MappedAnimalShopData[] | null>(() => {
        const values = this.#animalRequests.values();
        if (!values) return null;
        const [animals, shopData] = values;

        return shopData.map(shopEntry => {
            const {animalKey, ...rest} = shopEntry;
            const animal = animals.find(animal => animal.key.toLocaleLowerCase() === animalKey?.toLocaleLowerCase());
            return {...rest, animal, iconName: animal?.variants.find(variant => variant.variant === shopEntry.variant)?.icons?.adult ?? animal?.variants?.[0]?.icons?.adult ?? null}

        });
    })

    constructor() {
        super();
        this.shopItemData$ = this._database.fetchShopItemData$(this.shopName);
        this.openingHours$ = this._database.fetchOpeningHours$(this.shopName);
        this.itemUpgrade$ = this._database.fetchItemUpgradeData$(this.shopName);
    }

    override showDetails(selectedEntry: ShopItemData) {
        super.showDetails(selectedEntry);
        this.selectedAnimal = undefined;
    }

    override showItemUpgradeDetails(selectedEntry?: ItemUpgradeData) {
        super.showItemUpgradeDetails(selectedEntry);
        this.selectedAnimal = undefined;
    }

    showAnimal(shopItem: MappedAnimalShopData) {
        this.selectedAnimal = shopItem;
        this.selectedEntity = undefined;
        this.selectedItemUpgrade = undefined;
        this.listDetail.open()
    }
}
