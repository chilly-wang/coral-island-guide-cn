import { booleanAttribute, Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookingRecipe } from '@ci/data-types';
import { DatabaseService } from '../../../services/database.service';
import { RouterLink } from '@angular/router';
import { ItemIconComponent } from '../../item-icon/item-icon.component';
import { ItemListComponent } from '../../item-list/item-list.component';
import { CookingRecipeIngredientsPipe } from '../../../pipes/cooking-recipe-ingredients.pipe';
import { CastToMinimalItemArrayPipe } from '../../../pipes/cast-to-minimal-item-array.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDisplayPipe } from '../../../pipes/localized-display.pipe';

import { LocalizedEntityNamePipe } from '../../../pipes/localized-display.pipe';

@Component({
    selector: 'app-cooking-recipe',
    imports: [
        LocalizedEntityNamePipe,
        CommonModule,
        RouterLink,
        ItemIconComponent,
        ItemListComponent,
        CookingRecipeIngredientsPipe,
        CastToMinimalItemArrayPipe,
        TranslatePipe,
        LocalizedDisplayPipe,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './cooking-recipe.component.html',
})
export class CookingRecipeComponent {
    readonly cookingRecipe = input.required<CookingRecipe>();
    readonly showUtensil = input(false, { transform: booleanAttribute });

    protected cookingUtensilMapping = inject(DatabaseService).getCookingUtensilMapping();
}
