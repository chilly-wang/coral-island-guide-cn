import { inject, Pipe, PipeTransform } from '@angular/core';
import { SpecificDate } from "@ci/data-types";
import { TranslateService } from "@ngx-translate/core";
import { DisplayTranslationService } from "./localized-display.pipe";

@Pipe({
    name: 'ingameDate',
    pure: false
})
export class IngameDatePipe implements PipeTransform {
    private readonly translate = inject(TranslateService);
    private readonly display = inject(DisplayTranslationService);

    transform(value: SpecificDate): string {
        const params = {day: value.day, season: this.display.translate(value.season, 'season'), year: value.year};
        return this.translate.instant(value.year < 0 ? 'APP.DATE.DAY_SEASON' : 'APP.DATE.WITH_YEAR', params);
    }
}
