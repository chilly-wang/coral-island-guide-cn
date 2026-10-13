import { BaseTabbedSelectableContainerComponent } from "../../shared/components/base-tabbed-selectable-container/base-tabbed-selectable-container.component";
import { FormControl, FormRecord } from "@angular/forms";
import { Component, OnInit, ChangeDetectionStrategy, signal } from "@angular/core";
import { Observable, take, tap } from "rxjs";
import { MinimalItem } from "@ci/data-types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BaseChecklistService } from "../../core/services/checklists/base-checklist.service";
import { CollectionStatus, collectionStatusOptions, matchesCollectionStatus } from "../../shared/components/status-filter/status-filter.component";

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    template: '',

})
export abstract class BaseItemChecklistComponent extends BaseTabbedSelectableContainerComponent<any> implements OnInit {
    checklistForm: FormRecord<FormControl<boolean>> = new FormRecord<FormControl<boolean>>({})
    protected abstract checklistService: BaseChecklistService;
    protected abstract checklistDefinition$: Observable<Record<string, MinimalItem[]>>;

    /** "All / checked / unchecked" filter; pages can override the labels (e.g. donated for the museum). */
    readonly statusFilter = signal<CollectionStatus>('ALL');
    statusFilters = collectionStatusOptions('APP.COLLECTION.OBTAINED_CAPTURED', 'APP.COLLECTION.OBTAINED_UNCAPTURED');

    filterByStatus(entries: MinimalItem[]): MinimalItem[] {
        return entries.filter(entry => matchesCollectionStatus(this.statusFilter(), !!this.checklistForm.get(entry.id)?.value));
    }

    protected constructor() {
        super();

        this.checklistForm.valueChanges.pipe(
            takeUntilDestroyed()
        ).subscribe({
            next: value => {
                const checkedItems: string[] = [];

                Object.keys(value).forEach(key => {
                    if (value[key]) checkedItems.push(key)
                })

                this.checklistService.set(checkedItems);
            }
        })

    }

    ngOnInit(): void {
        this.checklistDefinition$ = this.checklistDefinition$.pipe(
            take(1),
            tap(checklist => {
                const keys = Object.keys(checklist);
                keys.forEach(key => {
                    checklist[key].forEach(item => {
                        this.checklistForm.addControl(item.id, new FormControl<boolean>(this.checklistService.isChecked(item.id), {nonNullable: true}), {emitEvent: false})
                    });
                })

                this.activateTabFromRoute(keys)

            })
        );
    }

}
