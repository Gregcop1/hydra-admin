import {Component, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {MATERIAL_DIRECTIVES, Media} from 'ng2-material/all';
import {SchemaService} from '../../services/schema/schema';

@Component({
    selector: 'sidebar',
    templateUrl: './app/components/sidebar/sidebar.html',
    directives: [CORE_DIRECTIVES, MATERIAL_DIRECTIVES]
})
export class SideBarCmp implements OnInit {

    models: Array<any> = [];

    constructor(private schemaService: SchemaService) {}

    /**
     * Check for media size
     *
     * @param breakSize
     *
     * @returns {boolean}
     */
    hasMedia(breakSize: string): boolean {
        return Media.hasMedia(breakSize);
    }

    /**
     * Init services
     */
    ngOnInit(): void {
        this._getNavigationItems();
    }

    /**
     * Get navigation's items
     *
     * @private
     */
    _getNavigationItems(): void {
        this.schemaService.schema$.subscribe(schema => this.models = schema.models);
        this.schemaService.getSchema();
    }
}
