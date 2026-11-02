import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
    FestivalDisplayNames,
    FestivalIcons,
    FestivalName,
    ShopDisplayNames,
    ShopIcons,
    ShopName,
    UiIcon
} from "@ci/data-types";
import { shopRouteConfig } from "./locations-shop-route-config";
import { festivalRouteConfig } from "./locations-festival-route-config";
import { SettingsService } from "../shared/services/settings.service";
import { SidebarContainerComponent } from "../shared/components/sidebar-container/sidebar-container.component";
import { ModuleSidebarItemComponent } from "../shared/components/module-sidebar-item/module-sidebar-item.component";
import { RouterOutlet } from "@angular/router";
import { ModuleSidebarComponent } from "../shared/components/module-sidebar/module-sidebar.component";
import { TranslatePipe } from "@ngx-translate/core";
import { LocalizedDisplayPipe } from "../shared/pipes/localized-display.pipe";

@Component({
    selector: 'app-locations',
    templateUrl: './locations.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        SidebarContainerComponent,
        ModuleSidebarComponent,
        ModuleSidebarItemComponent,
        RouterOutlet,
        TranslatePipe,
        LocalizedDisplayPipe
    ]
})
export class LocationsComponent {
    protected uiIcon = UiIcon;
    protected readonly SHOP_DISPLAY_NAMES = ShopDisplayNames;
    protected readonly SHOP_ICONS = ShopIcons;
    protected readonly FESTIVAL_DISPLAY_NAMES = FestivalDisplayNames;
    protected readonly FESTIVAL_ICONS = FestivalIcons;

    protected isBeta = inject(SettingsService).getSettings().useBeta

    // Kept in config order (most important first) rather than sorted by name.
    #shops = shopRouteConfig.filter(c => this.isBeta ? true : !c.betaOnly)
    protected landShops: ShopName[] = this.#shops.filter(c => !c.underwater).map(c => c.name)
    protected underwaterShops: ShopName[] = this.#shops.filter(c => c.underwater).map(c => c.name)

    protected festivals: FestivalName[] = festivalRouteConfig
        .map(c => c.data.name)
        .sort((a, b) => FestivalDisplayNames[a].localeCompare(FestivalDisplayNames[b]))
}
