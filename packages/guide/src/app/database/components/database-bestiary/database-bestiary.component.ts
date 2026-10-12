import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BaseDatabaseDetailPartComponent } from "../base-database-detail-part.component";
import { ExpandableComponent } from "../../../shared/components/expandable/expandable.component";
import { DatabaseHeaderButtonComponent } from "../database-header-button/database-header-button.component";
import { BestiaryTableComponent } from "../../../journal/components/tables/bestiary-table/bestiary-table.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-database-bestiary',
    templateUrl: './database-bestiary.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ExpandableComponent,
        DatabaseHeaderButtonComponent,
        BestiaryTableComponent,
        TranslatePipe
    ]
})
export class DatabaseBestiaryComponent extends BaseDatabaseDetailPartComponent {
}
