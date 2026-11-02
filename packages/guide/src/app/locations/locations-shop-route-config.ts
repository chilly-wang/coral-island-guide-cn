import { ShopName } from "@ci/data-types";
import { Type } from "@angular/core";
import { BlacksmithComponent } from "./components/shops/blacksmith/blacksmith.component";
import { LabComponent } from "./components/shops/lab/lab.component";
import { GeneralStoreComponent } from "./components/shops/general-store/general-store.component";
import { CarpenterComponent } from "./components/shops/carpenter/carpenter.component";
import { MerfolkGeneralStoreComponent } from "./components/shops/merfolk-general-store/merfolk-general-store.component";
import { OracleChamberComponent } from "./components/shops/oracle-chamber/oracle-chamber.component";
import { PetShopComponent } from "./components/pet-shop/pet-shop.component";
import { RanchComponent } from "./components/ranch/ranch.component";
import { BeachShackComponent } from "./components/shops/beach-shack/beach-shack.component";
import { ConcernedMonkeyComponent } from "./components/shops/concerned-monkey/concerned-monkey.component";
import { BosComponent } from "./components/shops/bos/bos.component";
import { BensCaravanComponent } from "./components/shops/bens-caravan/bens-caravan.component";
import { SocketAndPanComponent } from "./components/shops/socket-and-pan/socket-and-pan.component";
import { WhiteFlamingoComponent } from "./components/shops/white-flamingo/white-flamingo.component";
import { CoffeeComponent } from "./components/shops/coffee/coffee.component";
import { TavernComponent } from "./components/shops/tavern/tavern.component";
import { Route } from "@angular/router";

/**
 * The sidebar lists the shops in this order (most important first), land shops and
 * underwater (Merfolk Kingdom) shops in separate groups.
 */
export const shopRouteConfig: ({ name: ShopName, underwater?: true, betaOnly?: true, liveOnly?: true } & ({ component: Type<any>, } | {
    loadComponent: Route['loadComponent']
}))[] = [
    // Upgrades and buildings
    {
        name: 'blacksmith',
        component: BlacksmithComponent
    },
    {
        name: 'lab',
        component: LabComponent,
    },
    {
        name: 'carpenter',
        component: CarpenterComponent,
    },
    {
        name: 'beach-shack',
        component: BeachShackComponent,
    },
    // Everyday shopping
    {
        name: 'general-store',
        component: GeneralStoreComponent,
    },
    {
        name: 'ranch',
        component: RanchComponent,
    },
    {
        name: 'socket-and-pan',
        component: SocketAndPanComponent,
    },
    {
        name: 'bos',
        component: BosComponent,
    },
    {
        name: 'pet-shop',
        component: PetShopComponent,
    },
    // Seasonal and special
    {
        name: 'bens-caravan',
        component: BensCaravanComponent,
    },
    {
        name: 'concerned-monkey',
        component: ConcernedMonkeyComponent,
    },
    // Furniture and clothing
    {
        name: 'furniture-store',
        loadComponent: () => import('./components/shops/furniture-store.component').then(c => c.FurnitureStoreComponent),
    },
    {
        name: 'white-flamingo',
        component: WhiteFlamingoComponent,
    },
    // Food and drink
    {
        name: 'tavern',
        component: TavernComponent,
    },
    {
        name: 'coffee',
        component: CoffeeComponent,
    },
    {
        name: 'taco-truck',
        loadComponent: () => import('./components/shops/taco-truck.component').then(c => c.TacoTruckComponent),
    },
    {
        name: 'ramen-shop',
        loadComponent: () => import('./components/shops/ramen-shop.component').then(c => c.RamenShopComponent),
    },
    // Underwater
    {
        name: 'oracle-chamber',
        underwater: true,
        component: OracleChamberComponent,
    },
    {
        name: 'merfolk-general-store',
        underwater: true,
        component: MerfolkGeneralStoreComponent,
    },
    {
        name: 'underwater-ranch',
        underwater: true,
        loadComponent: () => import('./components/underwater-ranch/underwater-ranch.component').then(c => c.UnderwaterRanchComponent),
    },
    {
        name: 'sales-cart-stall',
        underwater: true,
        loadComponent: () => import('./components/shops/sales-cart-stall.component').then(c => c.SalesCartStallComponent),
    },
    {
        name: 'tidal-threads',
        underwater: true,
        loadComponent: () => import('./components/shops/tidal-threads.component').then(c => c.TidalThreadsComponent),
    },
]
