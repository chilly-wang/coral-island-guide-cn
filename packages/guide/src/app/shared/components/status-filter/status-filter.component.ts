import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export type CollectionStatus = 'ALL' | 'CHECKED' | 'UNCHECKED';

/** Row of toggle buttons such as "All / Obtained / Not obtained". */
@Component({
    selector: 'app-status-filter',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslatePipe],
    host: { class: 'flex flex-wrap gap-2 mb-5' },
    template: `
        @for (option of options(); track option.value) {
            <button type="button" class="btn whitespace-nowrap" [class.btn-secondary]="value() === option.value"
                    [attr.aria-pressed]="value() === option.value" (click)="value.set(option.value)">{{ option.label | translate }}</button>
        }
    `,
})
export class StatusFilterComponent<T extends string = CollectionStatus> {
    readonly value = model.required<T>();
    readonly options = input.required<{ value: T, label: string }[]>();
}

/** Options for the common "All / checked / unchecked" filter. */
export function collectionStatusOptions(checkedLabel: string, uncheckedLabel: string): { value: CollectionStatus, label: string }[] {
    return [
        { value: 'ALL', label: 'APP.COLLECTION.ALL' },
        { value: 'CHECKED', label: checkedLabel },
        { value: 'UNCHECKED', label: uncheckedLabel },
    ];
}

export function matchesCollectionStatus(status: CollectionStatus, checked: boolean): boolean {
    return status === 'ALL' || checked === (status === 'CHECKED');
}
