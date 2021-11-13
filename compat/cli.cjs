#!/usr/bin/env node
'use strict'

// Must be CommonJS to support Node.js < 12.20
if (process.version.match(/^v(\d+)\./)[1] < 14) {
  // Return silently to support hallmark in 'npm test'
  console.error('Skipping hallmark: Node 14 or greater is required.')
  process.exit(0)
}

// Wrapped again to avoid 'Unexpected token import'
require('./import-cli.cjs')
