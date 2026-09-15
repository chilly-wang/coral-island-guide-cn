import { Component, inject, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { GameVersionService } from '../../injection-tokens/version.injection-token';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styles: [
        `
            .app-footer footer {
                background-color: rgba(0, 0, 0, 0.75);
                min-height: var(--cg-min-footer-height);
            }
        `,
    ],
    host: {
        class: 'app-footer',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgOptimizedImage, TranslatePipe],
})
export class FooterComponent {
    protected version = inject(GameVersionService).value();
}
