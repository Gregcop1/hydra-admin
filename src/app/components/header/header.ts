import {Component, OnInit} from 'angular2/core';
import {MATERIAL_DIRECTIVES, Media, SidenavService} from 'ng2-material/all';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {SchemaService} from '../../services/schema/schema';

@Component({
    selector: 'header',
    templateUrl: './app/components/header/header.html',
    directives: [MATERIAL_DIRECTIVES]
})
export class HeaderCmp implements OnInit {
    title: Observable<string>;

    constructor(private _sidenav: SidenavService, private _schemaService: SchemaService, private _media: Media) {}

    /**
     * Toggle display of the sideNav depending on the size of the screen
     */
    toggleSideBarDisplay(): void {
        if (this._media.hasMedia('sm')) {
            let sideNav = this._sidenav.find('left');
            if (sideNav.visible) {
                sideNav.hide();
            } else {
                sideNav.show();
            }
        }
    }

    /**
     * Init services
     */
    ngOnInit(): void {
        this._schemaService.schema$
          .filter(schema => null !== schema)
          .subscribe(schema => this.title = schema.title);
    }
}
