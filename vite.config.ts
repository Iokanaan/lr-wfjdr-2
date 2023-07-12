import { defineConfig } from "vite";

export default defineConfig({
  build: { 
    minify: false, 
    modulePreload: { 
      polyfill: false 
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: './src/conan.ts',
      name: 'MyLib',
      // the proper extensions will be added
      fileName: 'my-lib',
    }
  }
});
