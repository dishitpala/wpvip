#!/usr/bin/env node

import { hideBin } from "yargs/helpers"
import init from "./commands/index.js"
import yargs from "yargs"

yargs(hideBin(process.argv))
    .command("init <source>", "Setup WPVIP, convert normal wordpress to wpvip setup.", ( yargs ) => {
        yargs.positional('source', {
            describe: 'GitHub URL to fetch content from',
            type: 'string',
        } )
    }, init)
    .demand(1, "Must provide a valid command")
    .help("h")
    .alias("h", "help")
    .argv

