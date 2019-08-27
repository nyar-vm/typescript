import { readFileSync } from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

import type { Cli, ParsedOptions } from '@vmz/commander';
import { createCli } from '@vmz/commander';

import { check, parse, tokens, version } from '@nyar/typescript';

const localesRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../locales');

function files(options: ParsedOptions): string[] {
    return options._.filter((value): value is string => typeof value === 'string').map((file) => path.resolve(file));
}

function numberOption(value: string | boolean | string[] | undefined, fallback: number): number {
    const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number.NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function buildHarnessCli(): Cli {
    const cli = createCli('typescript-harness').intro('harness.intro');
    try {
        cli.locales(localesRoot);
    } catch {
        /* locales optional in dev */
    }

    cli.command('version', 'harness.cmd.version').action(() => {
        console.log(version());
        return 0;
    });

    cli.command('check', 'harness.cmd.check').action((options: ParsedOptions) => {
        const list = files(options);
        if (list.length === 0) {
            console.error('missing <file...>');
            return 2;
        }
        let failed = 0;
        let totalTokens = 0;
        for (const file of list) {
            const source = readFileSync(file, 'utf8');
            const outcome = parse(source);
            const diagnostics = check(source);
            totalTokens += outcome.tokenCount;
            if (diagnostics.length === 0 && outcome.ok) {
                console.log(`${file}: ok (${outcome.tokenCount} token(s))`);
                continue;
            }
            failed++;
            console.error(`${file}: ${diagnostics.length} diagnostic(s)`);
            for (const diagnostic of diagnostics) console.error(`  ${diagnostic}`);
        }
        console.log(`checked=${list.length} tokens=${totalTokens} failed=${failed}`);
        return failed === 0 ? 0 : 1;
    });

    cli.command('bench', 'harness.cmd.bench')
        .option('-n, --iterations <n>', 'harness.opt.iterations')
        .action((options: ParsedOptions) => {
            const [file] = files(options);
            if (!file) {
                console.error('missing <file>');
                return 2;
            }
            const iterations = numberOption(options.iterations, 100);
            const source = readFileSync(file, 'utf8');
            const started = performance.now();
            for (let index = 0; index < iterations; index++) parse(source);
            const elapsed = performance.now() - started;
            console.log(`file=${file}`);
            console.log(`iterations=${iterations}`);
            console.log(`totalMs=${elapsed.toFixed(2)}`);
            console.log(`averageMs=${(elapsed / iterations).toFixed(3)}`);
            return 0;
        });

    cli.command('tokens', 'harness.cmd.tokens').action((options: ParsedOptions) => {
        const [file] = files(options);
        if (!file) {
            console.error('missing <file>');
            return 2;
        }
        const counts = new Map<string, number>();
        for (const token of tokens(readFileSync(file, 'utf8'))) {
            counts.set(token.kind, (counts.get(token.kind) ?? 0) + 1);
        }
        for (const [kind, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
            console.log(`${kind}\t${count}`);
        }
        return 0;
    });

    return cli;
}

/** Parse argv and run the TypeScript diagnostics harness. */
export async function runTypeScriptHarnessCli(argv: string[] = process.argv.slice(2)): Promise<number> {
    return buildHarnessCli().parse(argv);
}
