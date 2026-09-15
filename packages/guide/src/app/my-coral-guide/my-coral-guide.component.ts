import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UiIcon } from "@ci/data-types";
import { SidebarContainerComponent } from "../shared/components/sidebar-container/sidebar-container.component";
import { ModuleSidebarItemComponent } from "../shared/components/module-sidebar-item/module-sidebar-item.component";
import { RouterOutlet } from "@angular/router";
import { ModuleSidebarComponent } from "../shared/components/module-sidebar/module-sidebar.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-my-coral-guide',
    templateUrl: './my-coral-guide.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        SidebarContainerComponent,
        ModuleSidebarComponent,
        ModuleSidebarItemComponent,
        RouterOutlet,
        TranslatePipe
    ]
})
export class MyCoralGuideComponent {

    protected uiIcon = UiIcon

}
