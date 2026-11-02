import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CapturedChecklistService } from '../../../core/services/checklists/captured-checklist.service';
import { GachaChecklistService } from '../../../core/services/checklists/gacha-checklist.service';
import { BoughtChecklistService } from '../../../core/services/checklists/bought-checklist.service';
import { AttractionsChecklistService } from '../../../core/services/checklists/attractions-checklist.service';

/** Which checklist the toggle writes to; "captured" also treats museum donations as obtained. */
export type CollectionChecklist = 'captured' | 'gacha' | 'bought' | 'attractions';

/** Toggle label and checked / unchecked status labels for each wording. */
const WORDINGS = {
    caught: { toggle: 'APP.COLLECTION.TOGGLE', checked: 'APP.COLLECTION.CAPTURED', unchecked: 'APP.COLLECTION.UNCAPTURED' },
    obtained: { toggle: 'APP.COLLECTION.TOGGLE', checked: 'APP.COLLECTION.OBTAINED_CAPTURED', unchecked: 'APP.COLLECTION.OBTAINED_UNCAPTURED' },
    completed: { toggle: 'APP.COLLECTION.TOGGLE_COMPLETED', checked: 'APP.COLLECTION.COMPLETED', unchecked: 'APP.COLLECTION.NOT_COMPLETED' },
};

@Component({
    selector: 'app-capture-toggle',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslatePipe],
    template: `<button type="button" class="rounded-lg px-2 py-1 min-w-8 min-h-8 whitespace-nowrap text-sm border border-current disabled:opacity-60"
        [attr.aria-pressed]="isChecked()"
        [attr.aria-label]="(labels().toggle | translate) + ' ' + itemName()"
        [title]="title() | translate"
        [disabled]="isDonated()"
        (click)="toggle($event)">
        {{ isChecked() ? '✓' : '○' }}
        @if (!compact()) {
            {{ statusLabel() | translate }}
        }
    </button>`,
})
export class CaptureToggleComponent {
    readonly itemId = input.required<string>();
    readonly itemName = input('');
    readonly compact = input(false);
    readonly checklist = input<CollectionChecklist>('captured');
    /** "caught" for fish and critters, "completed" for attractions, "obtained" for everything else. */
    readonly wording = input<keyof typeof WORDINGS>('caught');

    readonly #captures = inject(CapturedChecklistService);
    readonly #services = {
        captured: this.#captures,
        gacha: inject(GachaChecklistService),
        bought: inject(BoughtChecklistService),
        attractions: inject(AttractionsChecklistService),
    };

    protected labels() {
        return WORDINGS[this.wording()];
    }

    protected isDonated(): boolean {
        return this.checklist() === 'captured' && this.#captures.isDonated(this.itemId());
    }

    protected isChecked(): boolean {
        return this.isDonated() || this.#services[this.checklist()].isChecked(this.itemId());
    }

    protected statusLabel(): string {
        return this.isChecked() ? this.labels().checked : this.labels().unchecked;
    }

    protected title(): string {
        return this.isDonated() ? 'APP.COLLECTION.DONATED_IMPLIES_OBTAINED' : this.statusLabel();
    }

    toggle(event: Event): void {
        event.stopPropagation();
        this.#services[this.checklist()].toggle(this.itemId());
    }
}
