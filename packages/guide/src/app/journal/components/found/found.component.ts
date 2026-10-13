import { AfterViewInit, Component, computed, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { BaseJournalPageComponent } from '../base-journal-page/base-journal-page.component';
import { Item } from '@ci/data-types';
import { FormGroup } from "@angular/forms";
import { FilterForm } from "../../../shared/types/filter-form.type";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ToDoContext } from "../../../core/types/to-do-context.type";
import { startWith } from "rxjs";
import { ListDetailContainerComponent } from "../../../shared/components/list-detail-container/list-detail-container.component";
import { DatabaseItemDetailsComponent } from "../../../shared/components/database-item-details/database-item-details.component";
import { DbItemFoundComponent } from "../../../shared/components/database-item-details/found/db-item-found.component";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { DataFilterComponent } from "../../../shared/components/data-filter/data-filter.component";
import { ItemIconComponent } from "../../../shared/components/item-icon/item-icon.component";
import { AsyncPipe } from "@angular/common";
import { NonSpecializedTableComponent } from "../../../shared/components/non-specialized-table/non-specialized-table.component";
import { TranslatePipe } from "@ngx-translate/core";
import { CapturedChecklistService } from "../../../core/services/checklists/captured-checklist.service";
import { CaptureToggleComponent } from "../../../shared/components/capture-toggle/capture-toggle.component";
import { CollectionStatus, collectionStatusOptions, matchesCollectionStatus, StatusFilterComponent } from "../../../shared/components/status-filter/status-filter.component";
import { LocalizedEntityNamePipe } from "../../../shared/pipes/localized-display.pipe";

@Component({
    selector: 'app-found',
    templateUrl: './found.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ListDetailContainerComponent,
        DatabaseItemDetailsComponent,
        MatTab,
        MatTabGroup,
        DbItemFoundComponent,
        DataFilterComponent,
        ItemIconComponent,
        AsyncPipe,
        NonSpecializedTableComponent,
        TranslatePipe,
        CaptureToggleComponent,
        StatusFilterComponent,
        LocalizedEntityNamePipe,
    ]
})
export class FoundComponent extends BaseJournalPageComponent<Item> implements AfterViewInit {

    readonly captures = inject(CapturedChecklistService);
    readonly obtainedFilter = signal<CollectionStatus>('ALL');
    readonly obtainedFilters = collectionStatusOptions('APP.COLLECTION.OBTAINED_CAPTURED', 'APP.COLLECTION.OBTAINED_UNCAPTURED');

    /** Donated items count as obtained (see CapturedChecklistService). */
    filterObtained(entries: Item[]): Item[] {
        return entries.filter(entry => matchesCollectionStatus(this.obtainedFilter(), this.captures.isObtained(entry.id)));
    }

    contextsPerTab: ToDoContext[] = [
        "journal_artifacts",
        "journal_gems",
        "journal_fossils",
        "journal_scavangables"
    ]

    toDoContext = computed<ToDoContext | undefined>(() => {
        const selectedTabIndex = this.selectedTabIndex()
        return this.contextsPerTab[selectedTabIndex]
    });

    constructor() {
        super(new FormGroup<FilterForm>({}));

        this.tabs = [
            {
                title: 'Artifacts',
                translationKey: 'APP.JOURNAL_TABS.ARTIFACTS',
                data: this.getFilteredJournalData(
                    this._database.fetchJournalOrder$('journal-artifacts'),
                    this._database.fetchItems$(),
                    0
                )
            }, {
                title: 'Gems',
                translationKey: 'APP.JOURNAL_TABS.GEMS',
                data: this.getFilteredJournalData(
                    this._database.fetchJournalOrder$('journal-gems'),
                    this._database.fetchItems$(),
                    1
                )
            }, {
                title: 'Fossils',
                translationKey: 'APP.JOURNAL_TABS.FOSSILS',
                data: this.getFilteredJournalData(
                    this._database.fetchJournalOrder$('journal-fossils'),
                    this._database.fetchItems$(),
                    2
                )
            }, {
                title: 'Scavangables',
                translationKey: 'APP.JOURNAL_TABS.SCAVENGABLES',
                data: this.getFilteredJournalData(
                    this._database.fetchJournalOrder$('journal-scavangable'),
                    this._database.fetchItems$(),
                    3
                )
            },
        ];

        this.activateTabFromRoute(this.tabs.map(tab => tab.title));

    }

    ngAfterViewInit(): void {

        const matTabGroup = this.matTabGroup();
        matTabGroup?.selectedIndexChange.pipe(
            takeUntilDestroyed(this.destroyRef),
            startWith(matTabGroup?.selectedIndex ?? 0)
        ).subscribe({
            next: (selectedTabIndex) => {
                this.selectedTabIndex.set(selectedTabIndex)
            }
        })
    }
}
