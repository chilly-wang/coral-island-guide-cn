import { booleanAttribute, Component, input, ChangeDetectionStrategy } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { DatabaseItem } from '@ci/data-types';
import { ItemIconComponent } from '../../item-icon/item-icon.component';
import { IsMinimalItemPipe } from '../../../pipes/is-minimal-item.pipe';
import { LocalizedEntityNamePipe } from '../../../pipes/localized-display.pipe';
import { LocalizedDisplayPipe } from '../../../pipes/localized-display.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-animal-produce',
    imports: [LocalizedEntityNamePipe, LocalizedDisplayPipe, TranslatePipe, KeyValuePipe, ItemIconComponent, IsMinimalItemPipe],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './animal-produce.component.html',
})
export class AnimalProduceComponent {
    readonly animal = input.required<NonNullable<DatabaseItem['producedByAnimal']>>();
    readonly shownItemId = input<string>();
    readonly hideAnimal = input(false, { transform: booleanAttribute });
}
