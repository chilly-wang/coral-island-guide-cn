import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UiIcon } from '@ci/data-types';
import { ModuleSidebarComponent } from "../shared/components/module-sidebar/module-sidebar.component";
import { SidebarContainerComponent } from "../shared/components/sidebar-container/sidebar-container.component";
import { ModuleSidebarItemComponent } from "../shared/components/module-sidebar-item/module-sidebar-item.component";
import { RouterOutlet } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-journal',
    templateUrl: './journal.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ModuleSidebarComponent,
        SidebarContainerComponent,
        ModuleSidebarItemComponent,
        RouterOutlet,
        TranslatePipe
    ]
})
export class JournalComponent {

    UI_ICONS = UiIcon;
}
