import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DatabaseService } from '../../../shared/services/database.service';
import { ItemIconComponent } from '../../../shared/components/item-icon/item-icon.component';
import { TranslatePipe } from '@ngx-translate/core';

import { LocalizedEntityNamePipe } from '../../../shared/pipes/localized-display.pipe';

@Component({
    selector: 'app-achievements',
    templateUrl: './achievements.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [LocalizedEntityNamePipe, ItemIconComponent, TranslatePipe],
})
export class AchievementsComponent {
    protected readonly achievements = inject(DatabaseService).fetchAchievements();
}
