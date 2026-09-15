import { Component, inject, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UiIcon } from '@ci/data-types';
import { NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { SettingsService } from '../../../shared/services/settings.service';
import { CdkConnectedOverlay, CdkOverlayOrigin } from "@angular/cdk/overlay";
import { UiIconComponent } from "../../../shared/components/ui-icon/ui-icon.component";
import { TranslatePipe } from "@ngx-translate/core";

type NaviLinks = {
    path: RouterLink['routerLink'];
    uiIcon: UiIcon;
    text: string;
}[];

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CdkConnectedOverlay,
        RouterLinkActive,
        RouterLink,
        UiIconComponent,
        CdkOverlayOrigin,
        TranslatePipe
    ],

    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        '[class.open-menu]': 'isOpen',
        'class': 'app-header'
    }
})
export class HeaderComponent {
    naviLinks: NaviLinks = [
        {
            text: 'APP.NAV.JOURNAL',
            uiIcon: UiIcon.JOURNAL,
            path: 'journal/produce/crops',
        },
        {
            text: 'APP.NAV.CRAFTING',
            uiIcon: UiIcon.CRAFTING,
            path: 'crafting',
        },
        {
            text: 'APP.NAV.NPCS',
            uiIcon: UiIcon.PEOPLE,
            path: 'npcs',
        },
        {
            text: 'APP.NAV.LOCATIONS',
            uiIcon: UiIcon.MAP,
            path: 'locations',
        },
        {
            text: 'APP.NAV.MY_GUIDE',
            uiIcon: UiIcon.MY_CORAL,
            path: 'my',
        },
        {
            text: 'APP.NAV.ITEM_DATABASE',
            uiIcon: UiIcon.DATABASE,
            path: 'database',
        },
    ];
    isOpen = false;
    protected uiIcon = UiIcon;
    protected readonly isBeta = inject(SettingsService).getSettings().useBeta;
    readonly #router = inject(Router);

    constructor() {
        this.#router.events.pipe(filter((e) => e instanceof NavigationStart)).subscribe(() => {
            this.isOpen = false;
        });

    }
}
