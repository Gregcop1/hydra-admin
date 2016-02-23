import {join} from 'path';
import {APP_SRC} from '../config';

export = function buildCSSDev(gulp, plugins) {
    return function () {
        return gulp.src([
                join(APP_SRC, 'assets/css/main.scss'),
            ])
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass().on('error', plugins.sass.logError))
            .pipe(plugins.sourcemaps.write('./'))
            .pipe(gulp.dest(join(APP_SRC, 'assets/')));
    };
};
