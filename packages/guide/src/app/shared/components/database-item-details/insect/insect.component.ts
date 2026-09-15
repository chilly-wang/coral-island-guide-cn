import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { getTruthyValues } from "@ci/util";
import { Critter } from "@ci/data-types";
import { LocalizedDisplayPipe } from "../../../pipes/localized-display.pipe";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-insect',
    imports: [LocalizedDisplayPipe, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './insect.component.html'
})
export class InsectComponent {

    readonly critter = input.required<Critter>();

    protected readonly getTruthyValues = getTruthyValues;
}
