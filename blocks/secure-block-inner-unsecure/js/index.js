/**
 * Import Assets
 */
import '../scss/style.scss';
import '../scss/editor.scss';

/**
 * Block Dependencies
 */
import icons from './icons';
import classnames from 'classnames';
import Select from 'react-select';

/**
 * Internal Block Libraries
 */
const { __ }                = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	InnerBlocks,
	RichText,
	AlignmentToolbar,
	BlockControls,
	BlockAlignmentToolbar,
	InspectorControls,
} = wp.editor;
const {
	Toolbar,
	Button,
	Tooltip,
	PanelBody,
	PanelRow,
	FormToggle,
} = wp.components;

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
						template={ [
							[ 'core/paragraph', { 'placeholder': 'Write unsecured content' } ]
						] }
						templateLock={false}
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
