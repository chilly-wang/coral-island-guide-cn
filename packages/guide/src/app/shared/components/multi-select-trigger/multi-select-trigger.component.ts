import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-multi-select-trigger',
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './multi-select-trigger.component.html',
    imports: [TranslatePipe]
})
export class MultiSelectTriggerComponent {
    readonly values = input.required<string[] | number[]>()
    readonly translationPrefix = input<string>();
}
