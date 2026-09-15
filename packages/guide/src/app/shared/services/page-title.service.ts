import { inject, Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DisplayTranslationService } from "../pipes/localized-display.pipe";

@Injectable({
    providedIn: 'root'
})
export class PageTitleService extends TitleStrategy {

    private title: Title = inject(Title)
    private translate = inject(TranslateService)
    private display = inject(DisplayTranslationService)
    private routerState?: RouterStateSnapshot;

    constructor() {
        super();
        this.translate.onLangChange.subscribe(() => this.setTranslatedTitle());
    }

    override updateTitle(routerState: RouterStateSnapshot) {
        this.routerState = routerState;
        this.setTranslatedTitle();
    }

    private setTranslatedTitle(): void {
        if (!this.routerState) return;
        const title = this.buildTitle(this.routerState);

        if (title !== undefined) {
            const translatedTitle = title
                .split(' - ')
                .map(part => part.startsWith('APP.') ? this.translate.instant(part) : this.display.translate(part, 'route'))
                .join(' - ');
            this.title.setTitle(`${translatedTitle} - Coral Guide`);
        } else {
            this.title.setTitle(`Coral Guide`);
        }
    }
}
