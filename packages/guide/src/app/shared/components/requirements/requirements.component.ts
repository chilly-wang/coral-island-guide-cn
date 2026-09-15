import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { Requirement } from '@ci/data-types';
import { ItemIconComponent } from '../item-icon/item-icon.component';
import { RouterLink } from '@angular/router';
import { InlineMinimalItemComponent } from '../inline-minimal-item/inline-minimal-item.component';
import { IngameDatePipe } from '../../pipes/ingame-date.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicGameTextService } from '../../services/dynamic-game-text.service';
import { LocalizedEntityNamePipe } from '../../pipes/localized-display.pipe';

@Component({
    selector: 'app-requirements',
    templateUrl: './requirements.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ItemIconComponent,
        RouterLink,
        InlineMinimalItemComponent,
        IngameDatePipe,
        TranslatePipe,
        LocalizedEntityNamePipe,
    ],
})
export class RequirementsComponent {
    readonly requirement = input.required<Requirement>();
    protected readonly dynamicText = inject(DynamicGameTextService);
}
