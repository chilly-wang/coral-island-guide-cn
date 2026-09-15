import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from '../shared/components/card/card.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-error-404',
    imports: [CardComponent, TranslatePipe],
    templateUrl: './error-404.component.html',
    host: {
        class: 'app-error container mx-auto my-10 block',
    },
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None,
})
export class Error404Component {}
