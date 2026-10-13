import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CapturedChecklistService } from '../../../core/services/checklists/captured-checklist.service';
import { GachaChecklistService } from '../../../core/services/checklists/gacha-checklist.service';
import { BoughtChecklistService } from '../../../core/services/checklists/bought-checklist.service';

/** Which checklist the toggle writes to; "captured" also treats museum donations as obtained. */
export type CollectionChecklist = 'captured' | 'gacha' | 'bought';

@Component({
    selector: 'app-capture-toggle',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslatePipe],
    template: `<button type="button" class="rounded-lg px-2 py-1 min-w-8 min-h-8 whitespace-nowrap text-sm border border-current disabled:opacity-60"
        [attr.aria-pressed]="isChecked()"
        [attr.aria-label]="('APP.COLLECTION.TOGGLE' | translate) + ' ' + itemName()"
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
    /** "caught" for fish and critters, "obtained" for everything else. */
    readonly wording = input<'caught' | 'obtained'>('caught');

    readonly #captures = inject(CapturedChecklistService);
    readonly #services = {
        captured: this.#captures,
        gacha: inject(GachaChecklistService),
        bought: inject(BoughtChecklistService),
    };

    protected isDonated(): boolean {
        return this.checklist() === 'captured' && this.#captures.isDonated(this.itemId());
    }

    protected isChecked(): boolean {
        return this.isDonated() || this.#services[this.checklist()].isChecked(this.itemId());
    }

    protected statusLabel(): string {
        const prefix = this.wording() === 'caught' ? 'APP.COLLECTION.' : 'APP.COLLECTION.OBTAINED_';
        return prefix + (this.isChecked() ? 'CAPTURED' : 'UNCAPTURED');
    }

    protected title(): string {
        return this.isDonated() ? 'APP.COLLECTION.DONATED_IMPLIES_OBTAINED' : this.statusLabel();
    }

    toggle(event: Event): void {
        event.stopPropagation();
        this.#services[this.checklist()].toggle(this.itemId());
    }
}
