import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { Effect, EffectMetaForType, MinimalItem } from '@ci/data-types';
import { ItemIconComponent } from '../item-icon/item-icon.component';
import { MoneyComponent } from '../money/money.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicGameTextService } from '../../services/dynamic-game-text.service';
import { LocalizedDisplayPipe, LocalizedEntityNamePipe } from '../../pipes/localized-display.pipe';

@Component({
    selector: 'app-effect',
    templateUrl: './effect.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ItemIconComponent,
        MoneyComponent,
        RouterLink,
        TranslatePipe,
        LocalizedDisplayPipe,
        LocalizedEntityNamePipe,
    ],
})
export class EffectComponent {
    readonly effect = input.required<Effect>();
    protected readonly dynamicText = inject(DynamicGameTextService);

    hasMinimalItem(effectMeta: EffectMetaForType<'RemoveItemFromInventory'>): effectMeta is {
        item: MinimalItem;
        quantity: number;
    } {
        return 'item' in effectMeta;
    }
}
