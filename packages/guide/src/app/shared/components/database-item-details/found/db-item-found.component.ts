import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { DatabaseItem } from "@ci/data-types";
import { ShopProcessingResultComponent } from "../shop-processing-result/shop-processing-result.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-db-item-found',
    imports: [
        ShopProcessingResultComponent,
        TranslatePipe
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './db-item-found.component.html'
})
export class DbItemFoundComponent {
    details = input.required<DatabaseItem>()
}
