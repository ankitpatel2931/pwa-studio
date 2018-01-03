const path = require('path');
const assert = require('assert');
const { isAbsolute } = require('path');
const { RawSource } = require('webpack-sources');

const loaderPath = path.join(__dirname, 'pages-chunk-loader.js');
const placeholderPath = path.join(__dirname, 'placeholder.ext');
const ENTRY_NAME = '__magento_pages__';

class MagentoPageChunksPlugin {
    constructor({ pagesDirs, manifestFileName } = {}) {
        this.pagesDirs = pagesDirs || ['./src/pages'];
        this.manifestFileName = manifestFileName || 'pages-manifest.json';
    }

    apply(compiler) {
        const { entry, context } = compiler.options;

        // Note: It's possible that we could support a string entry point
        // or an array later on, but it requires some decision making, and I'm
        // not sure we really need it
        assert(
            Object.prototype.toString.call(entry) === '[object Object]',
            'MagentoPageChunksPlugin requires that your webpack "entry" is an object'
        );

        const { pagesDirs } = this;
        const pagesDirsAbs = pagesDirs.map(
            dir => (isAbsolute(dir) ? dir : path.join(context, dir))
        );

        // This is a trick to force webpack into reading a dynamic file from memory,
        // instead of from disk. We point it at our loader with a dummy file, and
        // the loader will return the code we want webpack to parse
        entry[ENTRY_NAME] = `${loaderPath}?pagesDirs=${pagesDirsAbs.join(
            '|'
        )}!${placeholderPath}`;

        compiler.plugin('emit', (compilation, cb) => {
            const trickEntryPoint = compilation.chunks.find(
                chunk => chunk.name === ENTRY_NAME
            );
            assert(
                trickEntryPoint,
                'WebpackMagentoPageChunksPlugin could not find the "pages" entry chunk'
            );

            // Prepare the manifest that the Magento backend can use
            // to pick root components for a page.
            const manifest = trickEntryPoint.chunks.reduce((acc, chunk) => {
                acc[chunk.name] = chunk.files[0]; // No idea why `files` is an array here 🤔
                return acc;
            }, {});

            // Remove the asset for our trick entry point that contained the `import()`
            // expressions, before it is written to disk. Its chunks have already been created
            delete compilation.assets[trickEntryPoint.files[0]];

            compilation.assets[this.manifestFileName] = new RawSource(
                JSON.stringify(manifest, null, 4)
            );
            cb();
        });
    }
}

module.exports = MagentoPageChunksPlugin;