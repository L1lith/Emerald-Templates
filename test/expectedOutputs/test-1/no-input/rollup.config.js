import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import requireContext from 'rollup-plugin-require-context'
import { join } from 'path'
import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import deepmerge from 'deepmerge'


const name = "no-input"
const target = 

const baseConfig = {
    input: join(__dirname, 'source', 'index.js'),
    output: {
        name
    },
    name,
    plugins: [
        resolve({ jsnext: true }),
        commonjs({
            include: 'node_modules/**'
        }),
        babel({
            exclude: 'node_modules/**',
            presets: ['@babel/preset-env']
        }),
        uglify({
            sourcemap: false
        })
    ]
}

const branchConfigs = {
    browser: {
        output: {
            format: 'iife',
            file: join(__dirname, 'dist', 'no-input-browser.min.js')
        }
    },
    node: {
        output: {
            format: 'cjs',
            file: join(__dirname, 'dist', 'no-input-commonjs.js')
        }
    },
    universal: {
        output: {
            format: 'umd',
            file: join(__dirname, 'dist', 'no-input-universal.min.js')
        }
    }
}

const configs = branchConfigs.map(config => deepmerge(baseConfig, config))

configs[1].plugins.splice(0, 1) // Don't include dependencies in node bundle
configs[1].plugins.splice(2) // Don't Uglify the node bundle
export default configs
