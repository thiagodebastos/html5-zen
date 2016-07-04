## Overview
**HTML5 Zen** is a HTML5 Starter Kit is a somewhat opinionated work-in-progress boilerplate for HTML5 Development that takes the stress out and peace in. Included are tools for building static HTML5 websites in the most relaxing, peaceful and heartwarming way possible.

### Features

> Multi-platform boilerplate

Although a work in progress, this repo aims to contain a major template from each ad provider as listed above. Just swap out bits and pieces. Currently the repo only includes importable stylesheet includes for various banner sizes.

> Cross-device Synchronisation

Synchronise clicks, scrolls, forms and live-reload across multiple devices on the fly as you code. Powered by [BrowserSync](http://browsersync.io).

> Built in HTTP Server

Test pages easily in your local environment with one command: `gulp`.

> Performance Optimisation with a build process powered by [Gulp](http://gulpjs.com/).

Minify and concatenate JavaScript, CSS, HTML and images to keep your pages lean and your code readable.

> Stylus Support

Compile [Stylus](https://learnboost.github.io/stylus/) into CSS with ease, with support for variables, mixins and more.
Stylus has been chosen for its ability to incorporate syntax of most other preprocessors. This means that if you start to work on a project where the previous developer has used Sass indented syntax, but you like Less syntax, you can do so and it will just work.

Also, performance-wise Stylus performs really well, and it is natively created in NodeJS.

> Local Area Network Sharing

Ever been in a situation where a producer, designer, creative, janitor, Bob, Anthony's cat or your Aunty sends an email asking for `thing x` to be moved to the right by `x pixels`, so you do it, zip up the files, send them over and wait an hour for a response? Well, that just wont do. From now on, send them the external link [ which will look something like http://192.168.130.81:7878/] to your current project, get them on the phone if you have to, make the amends and have them watch it happen from their end. No more emails, no more firebreathing, just zen.


### Quickstart
- Clone or [download](https://gitlab.mcsaatchi.com.au/MAKE/banner-zen/repository/archive.zip) this repository and build on what is included in the `source` directory.
- ` git clone git@gitlab.mcsaatchi.com.au:MAKE/html5-banner-starter.git`
- `cd html5-banner-starter` (or whatever you named the folder)
- `npm install`

And you are ready to go, run with `gulp` to start the built in HTTP server in a new browser page.

### Workflow
- Put on some sound-blocking headphones, and switch to [3 Hours of Healing Zen Music](https://www.youtube.com/watch?v=LGiH6oUDXVg)
-
-

[I'm working on it!]


### Gulp Tasks
#### `gulp css`

#### `gulp serve`

#### `gulp images`
Minify images with
imagemin-pngquant
imagemin-svgo
imagemin-gifsicle
imagemin-jpegtran


## TODO:
- add bower
- add [gulp-inject](https://www.npmjs.com/package/gulp-inject) to inject bower components into html
