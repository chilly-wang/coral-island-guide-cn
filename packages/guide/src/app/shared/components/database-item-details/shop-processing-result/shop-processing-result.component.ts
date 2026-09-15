import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { DatabaseItem } from '@ci/data-types';
import { ItemIconComponent } from '../../item-icon/item-icon.component';
import { LocalizedEntityNamePipe } from '../../../pipes/localized-display.pipe';

@Component({
    selector: 'app-shop-processing-result',
    imports: [LocalizedEntityNamePipe, ItemIconComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './shop-processing-result.component.html',
})
export class ShopProcessingResultComponent {
    readonly itemProcessData = input.required<DatabaseItem['chanceAsProcessResult']>();
}
