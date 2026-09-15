import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DatabaseService } from './shared/services/database.service';
import { combineLatest, Observable } from 'rxjs';
import { SettingsService } from './shared/services/settings.service';
import { UserDataService } from './core/services/user-data.service';
import { HeaderComponent } from './core/components/header/header.component';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FooterComponent } from './core/components/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
import { AvailableLanguage, AvailableLanguages } from '@ci/data-types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HeaderComponent, AsyncPipe, RouterOutlet, MatProgressSpinner, FooterComponent],
})
export class AppComponent {
    prefetchData$: Observable<any>;
    #databaseService = inject(DatabaseService);
    #settingsService = inject(SettingsService);

    constructor() {
        const settings = this.#settingsService.getSettings();
        const usedLang: AvailableLanguage = 'en';
        const translate = inject(TranslateService);
        translate.addLangs([...AvailableLanguages]);
        translate.setFallbackLang(usedLang);
        translate.use(settings.language ?? usedLang);
        inject(UserDataService).read();

        this.prefetchData$ = combineLatest([
            this.#databaseService.fetchItems$(),
            this.#databaseService.fetchTagBasedItems$(),
            this.#databaseService.fetchProcessorMapping$(),
            this.#databaseService.fetchCookingUtensilMapping$(),
        ]);
    }
}
