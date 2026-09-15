import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inventory',
    },
    {
        path: '',
        loadComponent: () => import('./crafting.component').then(m => m.CraftingComponent),
        children: [
            {
                path: 'inventory',
                loadComponent: () => import('./components/inventory/inventory.component').then(m => m.InventoryComponent),
                title: 'APP.ROUTE.INVENTORY_CRAFTING'
            },
            {path: 'artisan', redirectTo: 'artisan/', pathMatch: 'full'},
            {
                path: 'artisan/:tabName',
                loadComponent: () => import('./components/processor/processor.component').then(m => m.ProcessorComponent),
                title: 'APP.ROUTE.ARTISAN_CRAFTING'
            },
            {path: 'cooking', redirectTo: 'cooking/', pathMatch: 'full'},
            {
                path: 'cooking/:tabName',
                loadComponent: () => import('./components/cooking/cooking.component').then(m => m.CookingComponent),
                title: 'APP.ROUTE.COOKING_CRAFTING'
            },
            {
                path: 'mixing',
                loadComponent: () => import('./mixing/mixing.component').then(c => c.MixingComponent),
                title: 'APP.ROUTE.MIXING_CRAFTING'
            },
        ]
    },

];
