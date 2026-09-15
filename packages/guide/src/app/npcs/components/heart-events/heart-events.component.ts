import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { HeartEvent } from "@ci/data-types";
import { HeartEventTriggerComponent } from "../heart-event-trigger/heart-event-trigger.component";
import { ExpandableComponent } from "../../../shared/components/expandable/expandable.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-heart-events',
    templateUrl: './heart-events.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        HeartEventTriggerComponent,
        ExpandableComponent,
        TranslatePipe
    ]
})
export class HeartEventsComponent {

    readonly heartEvents = input.required<HeartEvent[]>();

}
