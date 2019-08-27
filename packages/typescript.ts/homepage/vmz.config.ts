import { defineConfig } from '@vmz/vmz';
import markdownIt from '@vmz/plugin-markdown-it';

export default defineConfig({
    plugins: [markdownIt()],
    engines: { markdown: 'markdown-it' },
});
