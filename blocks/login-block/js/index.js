/**
 * Import Assets
 */
import '../scss/admin.scss';
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
const { __ }                = wp.i18n;


/**
 * Register secure block
 */
export default registerBlockType(
	'matt-watson/login-block',
	{
		title:       __( 'Login Block', 'secure-blocks-for-gutenberg' ),
		description: __( 'Provides a form to allow your users to log into your website', 'secure-blocks-for-gutenberg' ),
		category:   'layout',
		icon:       'feedback',
		keywords:   [
			__( 'Login Block' ),
			__( 'Login' ),
			__( 'Password' ),
		],
		attributes: {

		},
		edit: ( props => {
			const { attributes: {}, className, setAttributes, isSelected } = props;
			
			return [
				<div>Hello</div>
			];
		} ),
		save: props => {
			return (
				<div>
				</div>
			);
		},
	},
);
