#!/usr/bin/env node
console.error('QRPrint merchant setup requires a production API URL, merchant credentials, and a supported local printer adapter. See docs/merchant-setup.md. No printer configuration was changed.');
process.exitCode = 1;
