import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { DatabaseItem } from "@ci/data-types";
import { TranslatePipe } from "@ngx-translate/core";
import { RouterLink } from "@angular/router";
import { MoneyComponent } from "../../money/money.component";
import { LocalizedDisplayPipe } from "../../../pipes/localized-display.pipe";

@Component({
    selector: 'app-buy-at',
    imports: [TranslatePipe, RouterLink, MoneyComponent, LocalizedDisplayPipe],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './buy-at.component.html'
})
export class BuyAtComponent {

    readonly buyAt = input.required<DatabaseItem['buyAt']>();
}
