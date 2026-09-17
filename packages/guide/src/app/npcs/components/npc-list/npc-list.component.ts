import { Component, signal, computed, inject, viewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { NpcFavoritesService } from '../../../core/services/npc-favorites.service';
import { DatabaseService } from '../../../shared/services/database.service';
import { UiIcon } from '@ci/data-types';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { NpcFilterComponent } from '../../npc-filter/npc-filter.component';
import { filterNPCs } from '../../filter-npcs.function';
import { RouterLink } from '@angular/router';
import { UiIconComponent } from '../../../shared/components/ui-icon/ui-icon.component';
import { NpcHeadPortraitComponent } from '../../../shared/components/npc-head-portrait/npc-head-portrait.component';
import { IngameDatePipe } from '../../../shared/pipes/ingame-date.pipe';
import { NgClass } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

import { LocalizedEntityNamePipe } from '../../../shared/pipes/localized-display.pipe';
import { EntitySearchService } from '../../../shared/services/entity-search.service';

@Component({
    selector: 'app-npc-list',
    templateUrl: './npc-list.component.html',
    styleUrls: ['./npc-list.component.scss'],
    encapsulation: ViewEncapsulation.None,

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        LocalizedEntityNamePipe,
        RouterLink,
        NpcFilterComponent,
        UiIconComponent,
        NpcHeadPortraitComponent,
        IngameDatePipe,
        NgClass,
        MatProgressSpinner,
        MatTooltip,
        TranslatePipe,
    ],
})
export class NpcListComponent {
    readonly favorites = inject(NpcFavoritesService);
    readonly romanceOnly = signal(false);
    npcFilter = viewChild(NpcFilterComponent);
    protected readonly uiIcon = UiIcon;
    readonly #entitySearch = inject(EntitySearchService);
    #searchValueChanges = computed(() => this.npcFilter()?.searchValueChanges() ?? '');
    #sortValueChanges = computed(() => this.npcFilter()?.sortValueChanges() ?? 'default');
    #filterNPCs = filterNPCs;
    readonly #database = inject(DatabaseService);
    readonly #npcList = toSignal(
        this.#database.fetchNPCs$().pipe(
            catchError(() => of([])),
        ),
    );
    protected filteredAndSortedNpcs = computed(() => {
        const npcs = this.#npcList() ?? [];
        if (!this.#searchValueChanges || !this.#sortValueChanges) return npcs;
        const searchValue = this.#searchValueChanges();
        const sortValue = this.#sortValueChanges();

        const filtered = this.#filterNPCs(
            npcs,
            searchValue,
            sortValue,
            (npc) => this.#entitySearch.getLocalizedName(npc),
            (npc) => this.#entitySearch.getSearchTerms(npc),
        ).filter(npc => !this.romanceOnly() || npc.isDateable);
        const pinned = new Set(this.favorites.keys());
        return [...filtered.filter(npc => pinned.has(npc.key)), ...filtered.filter(npc => !pinned.has(npc.key))];
    });
}
