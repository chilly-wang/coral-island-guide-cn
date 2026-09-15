import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ChancePerItem } from '@ci/data-types';
import { ItemIconComponent } from '../item-icon/item-icon.component';
import { LocalizedEntityNamePipe } from '../../pipes/localized-display.pipe';

@Component({
    selector: 'app-chance-per-item-list',
    templateUrl: './chance-per-item-list.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ItemIconComponent, LocalizedEntityNamePipe],
})
export class ChancePerItemListComponent {
    readonly chances = input.required<ChancePerItem[]>();
}
