import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CapturedChecklistService } from '../../../core/services/checklists/captured-checklist.service';

@Component({
    selector: 'app-capture-toggle',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslatePipe],
    template: `<button type="button" class="rounded-lg px-2 py-1 min-w-8 min-h-8 whitespace-nowrap text-sm border border-current"
        [attr.aria-pressed]="captures.isChecked(itemId())"
        [attr.aria-label]="('APP.COLLECTION.TOGGLE' | translate) + ' ' + itemName()"
        [title]="(captures.isChecked(itemId()) ? 'APP.COLLECTION.CAPTURED' : 'APP.COLLECTION.UNCAPTURED') | translate"
        (click)="toggle($event)">
        {{ captures.isChecked(itemId()) ? '✓' : '○' }}
        @if (!compact()) {
            {{ (captures.isChecked(itemId()) ? 'APP.COLLECTION.CAPTURED' : 'APP.COLLECTION.UNCAPTURED') | translate }}
        }
    </button>`,
})
export class CaptureToggleComponent {
    readonly itemId = input.required<string>();
    readonly itemName = input('');
    readonly compact = input(false);
    readonly captures = inject(CapturedChecklistService);

    toggle(event: Event): void {
        event.stopPropagation();
        this.captures.toggle(this.itemId());
    }
}
