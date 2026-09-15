import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
} from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

export type ResetConfirmationDialogData = {
    titleKey: string;
    textKey: string;
};

@Component({
    selector: 'app-reset-confirmation-dialog',
    templateUrl: './reset-confirmation-dialog.component.html',
    imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class ResetConfirmationDialogComponent {
    protected readonly dialogData = inject<ResetConfirmationDialogData>(MAT_DIALOG_DATA);
}
