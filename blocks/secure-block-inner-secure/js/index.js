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
	'matt-watson/secure-block-inner-secure',
	{
		title:       __( 'Inner', 'secure-blocks-for-gutenberg' ),
		category:   'layout',
		attributes: {},
		parent:     [ 'matt-watson/secure-block' ],
		edit: ( props => {
			const { attributes: className, setAttributes } = props;
			console.log( props );
			return [
				<div className={ classnames( props.className ) }>
					<InnerBlocks
						template={ [
							[ 'core/paragraph', { 'placeholder': 'Write secure content' } ]
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
