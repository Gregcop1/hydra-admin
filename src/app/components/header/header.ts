import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES, Media, SidenavService} from 'ng2-material/all';

@Component({
    selector: 'header',
    templateUrl: './app/components/header/header.html',
    directives: [MATERIAL_DIRECTIVES]
})
export class HeaderCmp {
    constructor(public sidenav: SidenavService) {}

    toggleSideBarDisplay(name) {
        if (Media.hasMedia('sm')) {
            let sideNav = this.sidenav.find(name);
            if (sideNav.visible) {
                sideNav.hide(name);
            } else {
                sideNav.show(name);
            }
        }
    }
}
