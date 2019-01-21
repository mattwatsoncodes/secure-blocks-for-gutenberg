/**
 * Import Assets
 */
import '../scss/editor.scss';
import '../scss/style.scss';


/**
 * Block Dependencies
 */
import classnames from 'classnames';

/**
 * Internal Block Libraries
 */

const { registerBlockType } = wp.blocks;
const { InnerBlocks }       = wp.editor;
const { __ }                = wp.i18n;

/**
 * Register secure block
 */
export default registerBlockType(
	'matt-watson/secure-block-inner-secure',
	{
		title:       __( 'Inner', 'secure-blocks-for-gutenberg' ),
		category:   'layout',
		attributes: {},
		parent:     [ 'matt-watson/secure-block' ],
		edit: ( props => {
			const { attributes: className, setAttributes } = props;
			return [
				<div className={ classnames( props.className ) }>
					<InnerBlocks
						templateLock={ false }
						/>
				</div>
			];
		} ),
		save: props => {
			return (
				<div>
					<InnerBlocks.Content />
				</div>
			);
		},
	},
);
