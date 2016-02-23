import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {MATERIAL_DIRECTIVES, Media} from 'ng2-material/all';
import {EntrypointService} from '../../services/entrypoints/entrypoints';

@Component({
    selector: 'sidebar',
    templateUrl: './app/components/sidebar/sidebar.html',
    directives: [CORE_DIRECTIVES, MATERIAL_DIRECTIVES]
})
export class SideBarCmp {

    navigationItems: Array<any> = [];

    constructor(private entrypointService: EntrypointService) {
        this._getNavigationItems();
    }

    hasMedia(breakSize: string): boolean {
        return Media.hasMedia(breakSize);
    }

    private _getNavigationItems(): void {
        this.entrypointService.getEntryPoints().subscribe((items: any) => {
            for (let key in items) {
                this.navigationItems.push({
                    label: key,
                    link: items[key]
                });
            }
        });
    }
}
