#!/usr/bin/env node
import { runTypeScriptCli } from '../dist/cli/typescript-cli.js';

const code = await runTypeScriptCli(process.argv.slice(2));
process.exit(code ?? 0);
