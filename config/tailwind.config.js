/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const config = {
  theme: {
    extend: {
      fill: theme => ({
        secondary: theme("colors.purple.500"),
        primary: theme("colors.purple.900")
      }),
      colors: {
        "current-color": "currentColor",
        transparent: "transparent"
      },
      fontFamily: {
        display: [
          "Montserrat",
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
      width: {
        "96": "24rem"
      },
      maxHeight: {
        "128": "32rem"
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  }
};

module.exports = config;
