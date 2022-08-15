module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  safelist: [
    /col-span-^/,
    /w-^/,
    /h-^/,
    /row-span-^/,
    /font-bold/,
    /text-red-^/, 
    /text-center/,
    /text-green-^/
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
