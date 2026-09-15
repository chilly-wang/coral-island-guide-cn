import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RequirementEntry } from "@ci/data-types";
import { RequirementsComponent } from "../requirements/requirements.component";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-requirements-list',
    templateUrl: './requirements-list.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        RequirementsComponent,
        TranslatePipe
    ]
})
export class RequirementsListComponent {
    readonly requirements = input.required<RequirementEntry>()
}
