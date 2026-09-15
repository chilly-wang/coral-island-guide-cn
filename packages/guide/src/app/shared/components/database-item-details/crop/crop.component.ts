import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { BaseCrop, Crop, FruitPlant, FruitTree } from '@ci/data-types';
import { ItemIconComponent } from '../../item-icon/item-icon.component';
import { IsBaseCropPipe } from '../../../pipes/is-base-crop.pipe';
import { MoneyComponent } from '../../money/money.component';
import { IsCropPipe } from '../../../pipes/is-crop.pipe';
import { MaxPipe } from '../../../pipes/max.pipe';
import { LocalizedDisplayPipe } from '../../../pipes/localized-display.pipe';
import { TranslatePipe } from '@ngx-translate/core';

import { LocalizedEntityNamePipe } from '../../../pipes/localized-display.pipe';

@Component({
    selector: 'app-crop',
    imports: [
        LocalizedEntityNamePipe,
        ItemIconComponent,
        IsBaseCropPipe,
        MoneyComponent,
        IsCropPipe,
        MaxPipe,
        LocalizedDisplayPipe,
        TranslatePipe,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './crop.component.html',
})
export class CropComponent {
    readonly item = input.required<BaseCrop | Crop | FruitPlant | FruitTree>();
}
