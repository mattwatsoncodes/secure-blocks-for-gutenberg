const path              = require( 'path' );
const webpack           = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

// Set different CSS extraction for Editor and Styles
const blockCSS = new ExtractTextPlugin( {
	filename: './assets/css/style.css',
} );

const blockEditorCSS = new ExtractTextPlugin( {
	filename: './assets/css/editor.css',
} );

const blockAdminCSS = new ExtractTextPlugin( {
	filename: './assets/css/admin.css',
} );

const wplib = [
  'blocks',
  'components',
  'date',
  'editor',
  'element',
  'i18n',
  'utils',
  'data',
];

// Configuration for the ExtractTextPlugin.
const extractConfig = {
	use: [
		{ loader: 'raw-loader' },
		{
			loader: 'postcss-loader',
			options: {
				plugins: [ require( 'autoprefixer' ) ],
			},
		},
		{
			loader: 'sass-loader',
			query: {
				outputStyle:
				'production' === process.env.NODE_ENV ? 'compressed' : 'nested',
			},
		},
	],
};

module.exports = {
	entry: {
		'./assets/js/editor' : './blocks/index.js',
		'./assets/js/script' : './blocks/script.js',
	},
	output: {
		path: path.resolve( __dirname ),
		filename: '[name].js',
	},
	externals: wplib.reduce((externals, lib) => {
		externals[`wp.${lib}`] = {
			window: ['wp', lib],
		};

		return externals;
	}, {
		'react': 'React',
		'react-dom': 'ReactDOM',
	}),
	watch: true,
	devtool: 'cheap-eval-source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /style\.s?css$/,
				use: blockCSS.extract( extractConfig ),
			},
			{
				test: /editor\.s?css$/,
				use: blockEditorCSS.extract( extractConfig ),
			},
			{
				test: /admin\.s?css$/,
				use: blockAdminCSS.extract( extractConfig ),
			},
		],
	},
	plugins: [
		blockCSS,
		blockEditorCSS,
		blockAdminCSS,
	],
};
