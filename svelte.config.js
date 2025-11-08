import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: '404.html',
    }),
    typescript: {
      config(config) {
        // Remove deprecated options and use verbatimModuleSyntax instead
        delete config.compilerOptions.importsNotUsedAsValues;
        delete config.compilerOptions.preserveValueImports;
        delete config.compilerOptions.ignoreDeprecations;
        config.compilerOptions.verbatimModuleSyntax = true;
        return config;
      },
    },
  },
};

export default config;
