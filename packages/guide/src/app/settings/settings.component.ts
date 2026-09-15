import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoughtChecklistService } from '../core/services/checklists/bought-checklist.service';
import { CookingRecipesChecklistService } from '../core/services/checklists/cooking-recipes-checklist.service';
import { CraftedChecklistService } from '../core/services/checklists/crafted-checklist.service';
import { DefeatedChecklistService } from '../core/services/checklists/defeated-checklist.service';
import { HeartEventsChecklistService } from '../core/services/checklists/heart-events-checklist.service';
import { MuseumChecklistService } from '../core/services/checklists/museum-checklist.service';
import { OfferingChecklistService } from '../core/services/checklists/offering-checklist.service';
import { OrchestraZonesChecklistService } from '../core/services/checklists/orchestra-zones-checklist.service';
import { ShippedChecklistService } from '../core/services/checklists/shipped-checklist.service';
import { LocalDataResetService } from '../core/services/local-data-reset.service';
import { ToDoService } from '../core/services/to-do.service';
import { CardComponent } from '../shared/components/card/card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { UserDataActionsComponent } from '../my-coral-guide/user-data-actions/user-data-actions.component';
import {
    ResetConfirmationDialogComponent,
    ResetConfirmationDialogData,
} from './reset-confirmation-dialog/reset-confirmation-dialog.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CardComponent, TranslatePipe, UserDataActionsComponent],
})
export class SettingsComponent {
    readonly #dialog = inject(MatDialog);
    readonly #toDo = inject(ToDoService);
    readonly #localDataReset = inject(LocalDataResetService);
    readonly #checklists = [
        inject(BoughtChecklistService),
        inject(CookingRecipesChecklistService),
        inject(CraftedChecklistService),
        inject(DefeatedChecklistService),
        inject(HeartEventsChecklistService),
        inject(MuseumChecklistService),
        inject(OfferingChecklistService),
        inject(OrchestraZonesChecklistService),
        inject(ShippedChecklistService),
    ];

    protected confirmToDoReset(): void {
        this.#confirmReset(
            {
                titleKey: 'APP.SETTINGS.TODO.CONFIRM_TITLE',
                textKey: 'APP.SETTINGS.TODO.CONFIRM_TEXT',
            },
            () => this.#toDo.resetLiveToDo(),
        );
    }

    protected confirmChecklistReset(): void {
        this.#confirmReset(
            {
                titleKey: 'APP.SETTINGS.CHECKLIST.CONFIRM_TITLE',
                textKey: 'APP.SETTINGS.CHECKLIST.CONFIRM_TEXT',
            },
            () => this.#checklists.forEach((checklist) => checklist.resetLiveChecklist()),
        );
    }

    protected confirmLocalDataReset(): void {
        this.#confirmReset(
            {
                titleKey: 'APP.SETTINGS.LOCAL_DATA.CONFIRM_TITLE',
                textKey: 'APP.SETTINGS.LOCAL_DATA.CONFIRM_TEXT',
            },
            () => {
                this.#localDataReset.resetAll();
                location.reload();
            },
        );
    }

    #confirmReset(data: ResetConfirmationDialogData, reset: () => void): void {
        const dialogRef = this.#dialog.open(ResetConfirmationDialogComponent, {
            data,
            hasBackdrop: true,
            width: '500px',
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) reset();
        });
    }
}
