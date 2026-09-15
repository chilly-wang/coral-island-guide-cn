import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-processing-time',
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './processing-time.component.html',
    imports: [TranslatePipe],

})
export class ProcessingTimeComponent {
    readonly processingTime = input.required<{ day: number; time: { minutes: number; hours: number } }>()

}
