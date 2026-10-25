import { AfterViewInit, Component, computed, effect, input, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MinimalItem, Season } from "@ci/data-types";

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    template: '',

})
export abstract class BaseTableComponent<T> implements AfterViewInit {

    matDataSource?: MatTableDataSource<T>;
    displayedColumns: string[] = [];
    displayHeaderColumns: string[] = [];
    readonly sort = viewChild(MatSort);
    sortingDataAccessor?: (item: T, property: string) => string | number
    dataSource = input.required<T[]>()
    /**
     * Pages often pass a freshly filtered array on every change detection
     * (e.g. the obtained/caught status filters). Treat arrays holding the same
     * items as equal so the table is not rebuilt each time.
     */
    protected _dataSource = computed<T[]>(() => this.dataSource(), { equal: sameItems });
    protected abstract readonly BASE_DISPLAY_COLUMNS: string[]

    constructor() {
        this.sortingDataAccessor = this.sortingDataAccessor?.bind(this);
        this.sortHelper = this.sortHelper.bind(this);

        effect(() => {
            this.setupDataSource(this._dataSource());
        });
    }

    ngAfterViewInit() {
        this.attachSort();
    }

    /** Connect the sort header to the current data source (also after it was rebuilt). */
    private attachSort() {
        const sort = this.sort();
        if (this.matDataSource && sort) {
            if (this.sortingDataAccessor)
                this.matDataSource.sortingDataAccessor = this.sortingDataAccessor as MatTableDataSource<T>['sortingDataAccessor'];
            this.matDataSource.sort = sort;
        }
    }


    protected setupDataSource(dataSource: T[]) {
        this.matDataSource = new MatTableDataSource(dataSource);
        this.displayedColumns = [...this.BASE_DISPLAY_COLUMNS];

        this.displayHeaderColumns = this.displayedColumns.filter(column => column !== 'icon')
        // A rebuilt data source keeps the column/direction the user picked.
        this.attachSort();
    }

    protected sortHelper<T extends MinimalItem & {
        sellPrice?: number
    }>(item: T | undefined | Season[], property?: string): string | number | null {

        if (!item) return null;

        if (Array.isArray(item)) {
            if (item.includes("Spring")) return 1;
            if (item.includes("Summer")) return 2;
            if (item.includes("Fall")) return 3;
            if (item.includes("Fall")) return 4;
            return 5;
        }


        switch (property) {

            case 'outputName':
            case 'displayName':
                return item.displayName

            case 'sellPrice':
                return item.sellPrice ?? -1

            default:
                return null;
        }
    }

}

function sameItems<T>(a: T[], b: T[]): boolean {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
