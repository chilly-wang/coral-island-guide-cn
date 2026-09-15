import { Component, input, model, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Seasons, Weathers } from '@ci/data-types';
import { FilterForm } from '../../types/filter-form.type';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MultiSelectTriggerComponent } from '../multi-select-trigger/multi-select-trigger.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDisplayPipe } from '../../pipes/localized-display.pipe';

@Component({
    selector: 'app-data-filter',
    templateUrl: './data-filter.component.html',
    imports: [
        MatFormField,
        MatLabel,
        MatSelect,
        MatSelectTrigger,
        MatOption,
        ReactiveFormsModule,
        MultiSelectTriggerComponent,
        TranslatePipe,
        LocalizedDisplayPipe,
    ],

    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        class: 'my-3 flex gap-x-3 gap-y-4 flex-wrap',
    },
})
export class DataFilterComponent {
    readonly parentFormGroup = input<FormGroup<FilterForm>>();
    readonly locations = input<string[]>([]);
    readonly showTable = model(false);
    readonly showMap = model(false);
    readonly enableMapView = input(false);
    protected readonly Seasons = Seasons;
    protected readonly Weathers = Weathers;

    setShowTable(showTable: boolean): void {
        this.showMap.set(false);
        this.showTable.set(showTable);
        if (this.parentFormGroup()?.contains('showTable'))
            this.parentFormGroup()?.get('showTable')?.setValue(showTable);
    }

    setShowMap(): void {
        this.showMap.set(true);
    }
}
