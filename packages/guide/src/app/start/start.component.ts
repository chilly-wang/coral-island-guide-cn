import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from '../shared/components/card/card.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    imports: [CardComponent, TranslatePipe],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        class: 'app-start container block mx-auto my-10',
    },
})
export class StartComponent {}
