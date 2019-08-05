const hsluv = require('hsluv')

const hsla = (hue, saturation, light, a = 1) => {
  const floatToInt = f => Math.round(f * 255)
  const [h, s, l] = hsluv.hsluvToRgb([hue, saturation, light])
  const colorString = `rgba(${floatToInt(h)}, ${floatToInt(s)}, ${floatToInt(l)}, ${a})`
  return colorString
}




/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
const config = {
  theme: {
    extend: {
      colors: {
        "current-color": "currentColor",
        transparent: "transparent",

        "current-color": "currentColor",
        "text": "#442C2E",
        "surface": "#f7f7f8",

        "mirage": hsla(229,22,11,1),
        "black-pearl": hsla(235,16,14,1),
        "ebony-clay": hsla(233,19,19,1),
        "zircon": hsla(179,16,89,1),

        "on-light-muted":     hsla(0,0,0,.38),
        "on-light-secondary": hsla(0,0,0,.54),
        "on-light-primary":   hsla(0,0,0,.87),

        "on-dark-muted":     hsla(0,0,100,.5),
        "on-dark-secondary": hsla(0,0,100,.8),
        "on-dark-primary":   hsla(0,0,100,1),

        "primary-dark": hsla(250,100,10,1),
        "primary": hsla(250,100,15,1),
        "primary-light": hsla(250,100,30,1),

        "secondary-dark": "#c8b900",
        "secondary": hsla(128,0,100,1),
        "secondary-light": "#ffff72",

        "red-lightest": hsla(10, 100, 90),
        "red-lighter": hsla(10, 100, 80),
        "red-light": hsla(10, 100, 43),
        "red": hsla(10, 100, 38),
        "red-dark": hsla(10, 100, 33),

        "orange-lightest": hsla(30, 100, 90),
        "orange-light": hsla(30, 100, 60),
        "orange": hsla(30, 100, 55),
        "orange-dark": hsla(30, 100, 50),

        "yellow-lightest": hsla(60, 100, 90),
        "yellow-light": hsla(60, 100, 85),
        "yellow": hsla(60, 100, 80),
        "yellow-dark": hsla(60, 100, 75),

        "green-lightest": hsla(120, 100, 95),
        "green-light": hsla(120, 100, 70),
        "green": hsla(120, 100, 60),
        "green-dark": hsla(120, 100, 50),

        "blue-lightest": hsla(250,100,95),
        "blue-light": hsla(250,100,70),
        "blue": hsla(250,100,60),
        "blue-dark": hsla(250,100,50),
        "blue-darker": hsla(250,100,40),
        "blue-darkest": hsla(250,100,30),

        "violet-lightest": hsla(275,100,90),
        "violet-light": hsla(275,100,70),
        "violet": hsla(275,100,60),
        "violet-dark": hsla(275,100,50),

        "fuchsia-lightest": hsla(300,100,90),
        "fuchsia-light": hsla(300,100,64),
        "fuchsia": hsla(300,100,53),
        "fuchsia-dark": hsla(300,100,42),

        "pink-lightest": hsla(330,100,90),
        "pink-light": hsla(330,100,70),
        "pink": hsla(330,100,60),
        "pink-dark": hsla(330,100,50),

        black: hsla(200, 17, 5),
        "grey-darkest": "#3d4852",
        "grey-darker": "#606f7b",
        "grey-dark": "#8795a1",
        grey: hsla(200, 17, 90),
        "grey-light": hsla(200, 17, 93),
        "grey-lighter": hsla(200, 17, 95),
        "grey-lightest": hsla(200, 17, 98),
        white: "#ffffff",
      },
      fontFamily: {
        display: [
          "Rubik",
          "BlinkMacSystemFont",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif"
        ]
      },
      boxShadow: {
        blue: `0 -1px 0 0 ${hsla(250,100,60)}, 0 5px 15px rgba(0,0,0,.5)`,
        'blue-darker': `0 -1px 0 0 ${hsla(250,100,40)}, 0 5px 15px rgba(0,0,0,.5)`,
        // yellow: `0 -1px 0 0 ${config.theme.extend.colors['yellow']}, 0 5px 15px rgba(0,0,0,.5)`,
        // violet: `0 -1px 0 0 ${config.theme.extend.colors['violet']}, 0 5px 15px rgba(0,0,0,.5)`,
        // green: `0 -1px 0 0 ${config.theme.extend.colors['green']}, 0 5px 15px rgba(0,0,0,.5)`,
        // red: `0 -1px 0 0 ${config.theme.extend.colors['red']}, 0 5px 15px rgba(0,0,0,.5)`,
        // fuchsia: `0 -1px 0 0 ${config.theme.extend.colors['fuchsia']}, 0 5px 15px rgba(0,0,0,.5)`,
        default: "0 4px 6px rgba(50, 50, 93,.11), 0 1px 3px rgba(0,0,0,.08)",
        md: "0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08)",
        lg: "0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)",
        inner: "inset 0 0 4px 0 rgba(0,0,0,0.25)",
        outline: "0 0 0 3px rgba(52,144,220,0.5)",
        focus: `inset 0 0 0 2px ${hsla(253,100,60)}`,
        none: "none"
      },
    }
  },
  variants: {},
  plugins: []
}



module.exports = config
