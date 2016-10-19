const elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(mix => {
	mix.sass(['normalize.css', 'app.scss']);
	mix.webpack('main.ts');
	mix.version(['css/app.css', 'js/bundle.js']);
	mix.browserSync({
		proxy: '127.0.0.1'
	});
});
