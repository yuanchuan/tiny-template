# Tiny-template

A tiny template engine without using `eval` or `new Function`, but with limited feature support.  Used for situations where the Javascript execution environment is restricted like in the Google-chrome-extension apps.  

## Installation

Install from [npm](https://npmjs.org/):

```bash
npm install tiny-template
```

Or through [component](http://component.io/):

```bash
component install yuanchuan/tiny-template
```

## Syntax

The interpolate tags are similar to the default settings of [Underscore](http://documentcloud.github.io/underscore/#template) templates:

`<% ... %>` begins the code statement

`<%= .. %>` indicates the variable

`<% end %>`  ends the code statment


## Supported code statement

### 1. each

```html
<ul>
  <% each (array, el, i) %>
    <li> <%= el %>, <%= i %><li>
  <% end %>
</ul>
```

### 2. if

```html
<% if (bool) %>
  <p>hello<p>
<% end %>
```

## API

### .parse(string)

Given the template `string`:  

```html
<% each (array, el, i) %>
  <span><%= el %>, <%= i %></span>
<% end %>
```

Will output:  

```javascript
{
  "block": [
    {
      "operator": {
        "name": "each",
        "data": "array",
        "args": [ "el", "i" ]
      },
      "block": [
        {
          "text": "\n  <span>"
        },
        {
          "variable": "el"
        },
        {
          "text": ", "
        },
        {
          "variable": "i"
        },
        {
          "text": "</span>\n"
        }
      ]
    }
  ]
}

```

### .compile(string, dataObj)

Given the template `string`
  
```html
<% each (array, el, i) %>
  <span><%= el %>, <%= i %></span>
<% end %>
```

And the `dataObj`

```javascript
{
  array: ['a', 'b', 'c']
}
```

Will output

```html
<span>a, 0</span>
<span>b, 1</span>
<span>c, 2</span>
```

## TODO

* support object traverse in `each`
* support object scope variables like `obj.something` 
* support custom interpolate tags
* support common comparison in `if` like `if ( a == 1 )` 
* exeption handling



## License

MIT
