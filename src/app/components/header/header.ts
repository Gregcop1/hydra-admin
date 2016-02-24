import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES, Media, SidenavService} from 'ng2-material/all';

@Component({
    selector: 'header',
    templateUrl: './app/components/header/header.html',
    directives: [MATERIAL_DIRECTIVES]
})
export class HeaderCmp {
    constructor(public sidenav: SidenavService) {}

    /**
     * Toggle display of the sideNav depending on the size of the screen
     */
    toggleSideBarDisplay() {
        if (Media.hasMedia('sm')) {
            let sideNav = this.sidenav.find('left');
            if (sideNav.visible) {
                sideNav.hide();
            } else {
                sideNav.show();
            }
        }
    }
}
