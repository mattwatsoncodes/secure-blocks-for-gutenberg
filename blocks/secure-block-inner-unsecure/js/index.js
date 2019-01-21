/**
 * Import Assets
 */
import '../scss/editor.scss';
import '../scss/style.scss';

/**
 * Block Dependencies
 */
import classnames from 'classnames';
import icons from './icons';


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
	'matt-watson/secure-block-inner-unsecure',
	{
		title:       __( 'Unsecure', 'secure-blocks-for-gutenberg' ),
		category:   'layout',
		attributes: {},
		parent:     [ 'matt-watson/secure-block' ],
		edit: ( props => {
			const { attributes: className, setAttributes } = props;
			return [
				<div className={ classnames( props.className ) }>
					<header className={ classnames( props.className ) + '__handle' }>
						<span className={ classnames( props.className ) + '__icon' }>
							{ icons.unlocked }
						</span>
						<span className={classnames( props.className ) + '__description'}>
							<span>{ __( 'Content shown if the conditions of the secure block are not met.', 'secure-blocks-for-gutenberg' ) }</span>
						</span>
					</header>
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
