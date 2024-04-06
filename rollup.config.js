import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

export default {
  input: 'cli.js',
  output: {
    file: 'cli-dist.js',
    format: 'es'
  },
  plugins: [
    commonjs(),
    nodeResolve({
      browser: false,
      preferBuiltins: true,
      exportConditions: ['node']
    }),
    json(),
    terser({
      module: true,
      format: {
        comments: false
      }
    })
  ]
}
