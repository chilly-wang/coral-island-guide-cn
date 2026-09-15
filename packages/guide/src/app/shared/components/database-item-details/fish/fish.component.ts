import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { getTruthyValues } from "@ci/util";
import { Fish } from '@ci/data-types';
import { LocalizedDisplayPipe } from "../../../pipes/localized-display.pipe";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-fish',
    imports: [LocalizedDisplayPipe, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './fish.component.html'
})
export class FishComponent {
    readonly fish = input.required<Omit<Fish, 'item'>>();

    protected readonly getTruthyValues = getTruthyValues;

}
