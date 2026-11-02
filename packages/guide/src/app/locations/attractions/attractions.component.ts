import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatabaseService } from "../../shared/services/database.service";
import { TranslatePipe } from "@ngx-translate/core";
import { SettingsService } from "../../shared/services/settings.service";
import { ItemIconComponent } from "../../shared/components/item-icon/item-icon.component";
import { ListDetailContainerComponent } from "../../shared/components/list-detail-container/list-detail-container.component";
import { BaseTabbedSelectableContainerComponent } from "../../shared/components/base-tabbed-selectable-container/base-tabbed-selectable-container.component";
import { type Attraction } from "@ci/data-types";
import { AttractionComponent } from "./attraction/attraction.component";
import { ConfigService } from "../../core/services/config.service";
import { CaptureToggleComponent } from "../../shared/components/capture-toggle/capture-toggle.component";
import { CollectionStatus, collectionStatusOptions, matchesCollectionStatus, StatusFilterComponent } from "../../shared/components/status-filter/status-filter.component";
import { AttractionsChecklistService } from "../../core/services/checklists/attractions-checklist.service";

/** Town attractions with completed toggles; also used as the My Coral Guide attractions checklist. */
@Component({
    selector: 'app-attractions',
    imports: [
        TranslatePipe,
        ItemIconComponent,
        ListDetailContainerComponent,
        AttractionComponent,
        CaptureToggleComponent,
        StatusFilterComponent
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './attractions.component.html'
})
export class AttractionsComponent extends BaseTabbedSelectableContainerComponent<Attraction> {
    attractions = inject(DatabaseService).fetchAttractions();
    protected readonly useBeta = inject(SettingsService).getSettings().useBeta;

    protected readonly iconsPath = inject(ConfigService).config().iconPath;

    protected readonly completed = inject(AttractionsChecklistService);
    protected readonly statusFilter = signal<CollectionStatus>('ALL');
    protected readonly statusFilters = collectionStatusOptions('APP.COLLECTION.COMPLETED', 'APP.COLLECTION.NOT_COMPLETED');

    protected filterByStatus(attractions: Attraction[]): Attraction[] {
        return attractions.filter(attraction => matchesCollectionStatus(this.statusFilter(), this.completed.isChecked(attraction.key)));
    }

    protected completedCount(attractions: Attraction[]): number {
        return attractions.filter(attraction => this.completed.isChecked(attraction.key)).length;
    }
}
