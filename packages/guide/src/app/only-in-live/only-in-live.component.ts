import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CardComponent } from "../shared/components/card/card.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-only-in-live',
    imports: [RouterLink, CardComponent, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './only-in-live.component.html'
})
export class OnlyInBLiveComponent {
}
