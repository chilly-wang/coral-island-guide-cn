import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Consumable } from "@ci/data-types";
import { TranslatePipe } from "@ngx-translate/core";
import { LocalizedDisplayPipe } from "../../../pipes/localized-display.pipe";

@Component({
    selector: 'app-consumable',
    imports: [TranslatePipe, LocalizedDisplayPipe],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './consumable.component.html'
})
export class ConsumableComponent {

    readonly consumable = input.required<Consumable>();
}
