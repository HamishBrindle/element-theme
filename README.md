# element-theme-js

> Customized for a specific Vue project - I don't recommend using this, but if you must, I hope the examples make some sense. Good luck 🙏

## Description
>For general description of how the original works, see [element-theme](https://github.com/ElementUI/element-theme).

**The reason for this fork was to modify the gulp-pipeline it uses for compiling Element UI's theme on the fly alongside a global
stylesheet written in JS.**

Essentially, it combines SCSS  with JS object(s) into a combined stylesheet that can be used in the element-theme template you generate. Here's the general flow:
 1. Generate an Element UI SCSS template-stylesheet (made with `et --init [file path]`)
 
 2. Create a JS file with your global styles in nested objects (examples below on what this might look like)
 
 3. Put your JS variables (that will be turned to SCSS variables) into your generated template-stylesheet
 
 4. Create a file called `element-theme.config.js` in your root. This is where element-theme options will go
 
 5. Specify your files in the `element-theme.config.js` (as seen in the config at the bottom) in their respective fields
 
 6. Provide `element-theme.config.js` with a "config" path, which is where you will expect a newly-concatenated file named `_combined.scss` (the compilation process will use this sheet to create CSS files for your Element UI components)
 
 7. Provide `element-theme.config.js` with an "out" path, which is where all your newly generated CSS files will be generated and accessed for the components (specified in your babel config)
 
 8. Specify in your `babel.config.js` where your newly generated CSS files are.

This allows us to **modify app styles in one place** and those styles are **accessible in both SCSS** and JS from anywhere in the app.

## Examples
We provide a JS file of styles that look something like this:
```js
const defaultTheme = {
  colors: {
    primary: '#162752',
    secondary: '#7F8FA4',
    warning: '#E6A23C',
    success: '#0F9D58',
    danger: '#DB4437',
    info: '#909399',
    wht: '#FFFFFF',
    blk: '#000000',
  },
  breakpoints: {
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1920px',
  },
  fonts: {
    primary: '\'Futura-PT\'',
  },
};

module.exports = defaultTheme;

```

Then we get SCSS variables that look like this:
```scss
$colors: (
  primary: #1e3570,
  secondary: #7F8FA4,
  warning: #E6A23C,
  success: #0F9D58,
  danger: #DB4437,
  info: #909399,
  wht: #FFFFFF,
  blk: #000000,
);
$breakpoints: (
  sm: 768px,
  md: 992px,
  lg: 1200px,
  xl: 1920px,
);
$fonts: (
  futura: "Futura-PT",
);
```

These can be used in your source element-theme SCSS file like so:
```scss
/* Color
-------------------------- */
$--color-primary: map-get($colors, primary) !default;
$--color-success: map-get($colors, success) !default;
$--color-warning: map-get($colors, warning) !default;
$--color-danger: map-get($colors, danger) !default;
$--color-info: map-get($colors, info) !default;
$--color-white: map-get($colors, wht) !default;
$--color-black: map-get($colors, blk) !default;

/* Break-point
--------------------------*/
$--sm: map-get($breakpoints, sm) !default;
$--md: map-get($breakpoints, md) !default;
$--lg: map-get($breakpoints, lg) !default;
$--xl: map-get($breakpoints, xl) !default;
```

> Don't expect much from the JS-to-SCSS conversion going on here, it's extremely rudimentary, and I woudln't expect it to hold up with more complex tooling

## Config
Here are some (highly specific for my project) examples of what your config files may look like:

### element-theme.config.js

The configuration for this should look something like this in element-theme.config.js:
```js
// element-theme.config.js
module.exports = {
    // Optional
    browsers: ["ie > 9", "last 2 versions"],
    components: ["button", "input"],
    minimize: false,
    
    // Required ()
    out: "./<path-to-styles>/element-ui/css",
    config: "./<path-to-styles>/element-ui/scss/generated", // where `_combined.scss` will go
    sassVariables: "./<path-to-styles>/element-ui/scss/_element-ui.scss",
    jsVariables: "./<path-to-styles>/theme/index.js",
    
    // Dont change
    theme: "element-theme-chalk"
}
```

### babel.config.js

Your babel config should reflect a change in path for where your app can access your custom Element UI theme:
```javascript
plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        
        // Path specified in element-theme.config.js
        styleLibraryName: '~src/assets/styles/vendor/element-ui/css',
      },
    ],
  ],
```

## Misc
Some additional reading or additions that can be made to make better use of this workflow:
- [Sharing variables between JS and Sass ](https://itnext.io/sharing-variables-between-js-and-sass-using-webpack-sass-loader-713f51fa7fa0) - use JS/JSON styles in your SCSS
- [Using SASS Maps](https://www.sitepoint.com/using-sass-maps/) - the syntax seen above (`map-get`)
- [Deep Get/Set in Maps](https://css-tricks.com/snippets/sass/deep-getset-maps/) - if you find youself with more than one layer of nested values in your SCSS maps

## License
MIT
