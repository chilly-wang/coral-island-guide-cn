import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { DatabaseItem } from "@ci/data-types";
import { ItemListComponent } from "../../item-list/item-list.component";
import { CraftingRecipeIngredientsPipe } from "../../../pipes/crafting-recipe-ingredients.pipe";
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDisplayPipe } from '../../../pipes/localized-display.pipe';

@Component({
    selector: 'app-inventory-crafting',
    imports: [
        ItemListComponent,
        CraftingRecipeIngredientsPipe,
        TranslatePipe,
        LocalizedDisplayPipe
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './inventory-crafting.component.html'
})
export class InventoryCraftingComponent {
    readonly details = input.required<DatabaseItem>();
}
