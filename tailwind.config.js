module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#691DBC'
        }
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    base: false,
    utils: false,
    logs: false,
    rtl: false,
    themes: [
      {
        mytheme: {
          'primary': '#017CA9',
          'primary-focus': '#4506cb',
          'primary-content': '#ffffff',
          'secondary': '#545454',
          'secondary-focus': '#bd0091',
          'secondary-content': '#ffffff',
          'accent': '#15ab72',
          'accent-focus': '#2aa79b',
          'accent-content': '#ffffff',
          'neutral': '#3d4451',
          'neutral-focus': '#2a2e37',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#d1d5db',
          'base-content': '#1f2937',
          'info': '#2094f3',
          'success': '#009485',
          'warning': '#ff9900',
          'error': '#ff5724',
        }
      }
    ],
    rtl: false
  },
}
