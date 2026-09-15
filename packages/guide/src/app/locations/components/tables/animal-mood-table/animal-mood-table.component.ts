import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ProductSizeByMood } from "@ci/data-types";
import { ResponsiveTableComponent } from "../../../../shared/components/responsive-table/responsive-table.component";
import { MatTableModule } from "@angular/material/table";
import { SlicePipe } from "@angular/common";
import { TranslatePipe } from "@ngx-translate/core";
import { LocalizedDisplayPipe } from "../../../../shared/pipes/localized-display.pipe";

@Component({
    selector: 'app-animal-mood-table',
    templateUrl: './animal-mood-table.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ResponsiveTableComponent,
        SlicePipe,
        MatTableModule,
        TranslatePipe,
        LocalizedDisplayPipe
    ]
})
export class AnimalMoodTableComponent {

    readonly productSizeByMood = input.required<ProductSizeByMood[]>();
    protected displayHeaderColumns: string[] = [
        'hearts',
        'badSmall',
        'badLarge',
        'neutralSmall',
        'neutralLarge',
        'happySmall',
        'happyLarge'
    ]


}
