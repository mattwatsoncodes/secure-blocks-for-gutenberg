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
import icons from './icons';
import Inspector from './inspector';
import store from './store';

/**
 * Internal Block Libraries
 */
const { registerBlockType } = wp.blocks;
const { Spinner }           = wp.components;
const { withSelect }        = wp.data;
const { InnerBlocks }       = wp.editor;
const { __ }                = wp.i18n;


/**
 * Register secure block
 */
export default registerBlockType(
	'matt-watson/secure-block',
	{
		title:       __( 'Secure Block', 'secure-blocks-for-gutenberg' ),
		description: __( 'By default the secure content is only shown if a user is logged in. You can also restrict the block to be visible to users within certain roles.', 'secure-blocks-for-gutenberg' ),
		category:   'layout',
		icon:       'lock',
		keywords:   [
			__( 'Secure Block' ),
			__( 'Permissions' ),
			__( 'Password Protected' ),
		],
		attributes: {
			role: {
				type:    'string',
				default: null,
			},
		},
		edit: withSelect( ( select ) => {
				return {
					userRoles: select('matt-watson/secure-block').receiveUserRoles(),
				};
			} )( props => {
			const { attributes: { role }, userRoles, className, setAttributes, isSelected } = props;
			let selectedRoles = [];
			if ( null !== role ) {
				selectedRoles = JSON.parse( role );
			}

			if ( ! userRoles.length ) {
				return (
					<p className={className} >
						<Spinner />
						{ __( 'Loading Data', 'secure-blocks-for-gutenberg' ) }
					</p>
				);
			}
			return [
				<Inspector { ...{ setAttributes, ...props, selectedRoles } }/>,
				<div className={ classnames( className ) }>
					<header className={ classnames( className ) + '__handle' }>
						<span className={ classnames( className ) + '__icon' }>
							{ icons.lock }
						</span>
						<span className={ classnames( className ) + '__description'}>
							<span>{ __( 'Content shown to users that are ', 'secure-blocks-for-gutenberg' ) }</span>
							<strong>{ __( 'logged-in', 'secure-blocks-for-gutenberg' ) }</strong>
							{ selectedRoles.length === 0  ?
								<span>.</span>
							:
								<span>
									{ 1 === selectedRoles.length ?
										<span>
											{ __( ' and in the following role: ', 'secure-blocks-for-gutenberg' ) }
										</span>
									:
										<span>
											{ __( ' and in any of the following roles: ', 'secure-blocks-for-gutenberg' ) }
										</span>
									}
									<span className={classnames( props.className ) + '__roles'}>
									{ Object( selectedRoles ).map( ( value, key ) =>
										<span className="role">
											<span className="role__name">
												{ value['label'] }
											</span>
										</span>
									)}
									</span>
								</span>
							}
						</span>
					</header>
					<InnerBlocks
						template={ [
							[ 'matt-watson/secure-block-inner-secure' ],
							[ 'matt-watson/secure-block-inner-unsecure' ],
						] }
						templateLock="all"
						allowedBlocksExample={ [
							[ 'matt-watson/secure-block-inner-secure' ],
							[ 'matt-watson/secure-block-inner-unsecure' ],
						] }
						/>
					<footer className={ classnames( props.className ) + '__footer' }>
						{ __( 'End: Secure Blocks', 'secure-blocks-for-gutenberg' ) }
					</footer>
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
