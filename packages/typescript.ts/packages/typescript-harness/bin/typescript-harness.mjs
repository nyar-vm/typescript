#!/usr/bin/env node
import { runTypeScriptHarnessCli } from '../dist/cli.js';

const code = await runTypeScriptHarnessCli(process.argv.slice(2));
process.exit(code ?? 0);
