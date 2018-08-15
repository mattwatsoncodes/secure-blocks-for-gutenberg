/**
 * Import Assets
 */
import '../scss/style.scss';
import '../scss/editor.scss';
import '../scss/admin.scss';

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
const { apiFetch }          = wp;
const {
	registerStore,
	withSelect,
} = wp.data;
const {
	InnerBlocks,
	InspectorControls,
} = wp.editor;
const {
	PanelBody,
	PanelRow,
	Spinner,
} = wp.components;

const actions = {
	setUserRoles( userRoles ) {
		return {
			type: 'SET_USER_ROLES',
			userRoles,
		};
	},
	receiveUserRoles( path ) {
		return {
			type: 'RECEIVE_USER_ROLES',
			path,
		};
	},
};

const store = registerStore( 'matt-watson/secure-block', {
	reducer( state = { userRoles: {} }, action ) {

		switch ( action.type ) {
			case 'SET_USER_ROLES':
				return {
					...state,
					userRoles: action.userRoles,
				};
			case 'RECEIVE_USER_ROLES':
				return action.userRoles;
		}

		return state;
	},

	actions,

	selectors: {
		receiveUserRoles( state ) {
			const { userRoles } = state;
			return userRoles;
		},
	},

	resolvers: {
		* receiveUserRoles( state ) {
			const userRoles = apiFetch( { path: '/matt-watson/secure-blocks/v1/user-roles/' } )
				.then( userRoles => {
					return actions.setUserRoles( userRoles );
				} )
			yield userRoles;
		},
	},
} );

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
			const { attributes: { role }, userRoles, className, setAttributes } = props;
			const handleRoleChange = ( role ) => setAttributes( { role: JSON.stringify( role ) } );
			let rolesToString = '';
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
				<InspectorControls>
					<PanelBody title={ __( 'Select Roles', 'secure-blocks-for-gutenberg' ) } className="secure-block-inspector">
						<PanelRow>
							<label htmlFor="secure-block-roles" className="secure-block-inspector__label">
								{ __( 'Secure content is presented to users that are logged-in and in the following roles:', 'secure-blocks-for-gutenberg' ) }
							</label>
						</PanelRow>
						<PanelRow>
							<Select
								className="secure-block-inspector__control"
								name='secure-block-roles'
								value={ selectedRoles }
								onChange={ handleRoleChange }
								options={ userRoles }
								isMulti='true'
							 />
						</PanelRow>
						<PanelRow>
							<em className="muted">{ __( 'No selected roles mean that secure content will be presented to all logged-in users.', 'secure-blocks-for-gutenberg' ) }</em>
						</PanelRow>
					</PanelBody>
				</InspectorControls>,
				<div className={ classnames( props.className ) }>
					<header className={ classnames( props.className ) + '__handle' }>
						<span className={ classnames( props.className ) + '__icon' }>
							{ icons.lock }
						</span>
						<span className={classnames( props.className ) + '__description'}>
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
