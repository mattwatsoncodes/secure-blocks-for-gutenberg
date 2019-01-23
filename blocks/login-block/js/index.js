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
import Inspector from './inspector';
import store from './store';

/**
 * Internal Block Libraries
 */
const { apiFetch }          = wp;
const { registerBlockType } = wp.blocks;
const { compose }           = wp.compose;
const { 
	withDispatch, 
	withSelect 
} = wp.data;
const { __ }                = wp.i18n;

const applyWithDispatch = withDispatch( ( dispatch, { value } ) => {
	
	return {
		updateOption( value ) {
			dispatch( 'matt-watson/login-block' ).updateOption( value );
		},
	};
} );

const applyWithSelect = withSelect( ( select ) => {
	return {
		hasRegistration: select( 'matt-watson/login-block' ).receiveOption( 'users_can_register' ),
	};
} );

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
			passwordLabel: {
				type:    'string',
				default: __( 'Password', 'secure-blocks-for-gutenberg' ),
			},
			passwordPlaceholder: {
				type:    'string',
			},
			registerLabel: {
				type:    'string',
				default: __( 'Register', 'secure-blocks-for-gutenberg' ),
			},
			registerURL: {
				type:    'string',
			},
			rememberMeLabel: {
				type:    'string',
				default: __( 'Remember Me', 'secure-blocks-for-gutenberg' ),
			},
			resetLabel: {
				type:    'string',
				default: __( 'Lost your password?', 'secure-blocks-for-gutenberg' ),
			},
			resetURL: {
				type:    'string',
			},
			submitLabel: {
				type:    'string',
				default: __( 'Log In', 'secure-blocks-for-gutenberg' ),
			},
			userNameLabel: {
				type:    'string',
			},
			userNamePlaceholder: {
				type:    'string',
			},
			userNameType: {
				type:    'string',
				default: 'both',
			},
		},
		edit: compose(
			[
				applyWithDispatch,
				applyWithSelect,
			]
		)( props => {
			let { 
				attributes: {
					passwordLabel,
					registerLabel,
					passwordPlaceholder,
					registerURL,
					rememberMeLabel,
					resetLabel,
					resetURL,
					submitLabel,
					userNameLabel,
					userNamePlaceholder,
					userNameType,
				}, 
				className, 
				hasRegistration,
				isSelected,
				setAttributes, 
				updateOption,
			} = props;

			const handleHasRegistrationChange = ( value ) => { 
				const option  = 'users_can_register';
				const promise = apiFetch( { path: '/matt-watson/secure-blocks/v1/update/option/' + option + '/' + value + '/' } );
				promise.then( ( value ) => { 
					updateOption( value );
				} );
			};
			
			if ( ! userNameLabel ) {
				switch ( userNameType ) {
					case 'both': { 
						userNameLabel = __( 'Username or Email Address', 'secure-blocks-for-gutenberg' );
						break; 
					}
					case 'username': { 
						userNameLabel = __( 'Username', 'secure-blocks-for-gutenberg' );
						break; 
					}
					case 'email': { 
						userNameLabel = __( 'Email Address', 'secure-blocks-for-gutenberg' );
						break; 
					} 
				}
			}

			return [
				<Inspector { ...{ setAttributes, ...props, hasRegistration, handleHasRegistrationChange } }/>,
				<form className={ classnames( className, 'login-block' ) } method="post" autocomplete="off">

					<p class="field-group field-group--text">
						<label class="field-group__label" for="username">
							<span class="field-group__label-text">
								{ userNameLabel }
							</span>
							<input
								class="field-group__control"
								type="text"
								id="username"
								name="username"
								placeholder={ userNamePlaceholder }
								value=""
							/>
						</label>
					</p>

					<p class="field-group field-group--password">
						<label class="field-group__label" for="password">
							<span class="field-group__label-text">
								{ passwordLabel }
							</span>
							<input
								class="field-group__control"
								type="password"
								id="password"
								name="password"
								placeholder={ passwordPlaceholder }
								value=""
							/>
						</label>
					</p>

					<p class="field-group field-group--checkbox">
						<label class="field-group__label" for="rememberme">
							<input
								class="field-group__control"
								type="checkbox"
								id="rememberme"
								name="rememberme"
								placeholder={ rememberMeLabel }
								value="forever"
							/>
							<span class="field-group__label-text">
								{ rememberMeLabel }
							</span>
						</label>

					</p>

					<p class="field-group field-group--submit">
						<input
							class="field-group__control"
							class="button button--primary"
							type="submit"
							value={ submitLabel }
						/>
					</p>

					<nav role="navigation" class="login-block__navigation">
						<ul class="login-block__navigation-list">
							{ 1 == hasRegistration ? (
								<li class="login-block__navigation-item">
									<a
										class="login-block__navigation-link"
										href="<?php echo esc_url( $registration_url ); ?>"
										title={ registerLabel }
									>
									{ registerLabel }
									</a>
								</li>
							) : null }
							<li class="login-block__navigation-item">
								<a
									class="login-block__navigation-link"
									href="<?php echo esc_url( $reset_url ); ?>"
									title={ resetLabel }
								>
								{ resetLabel }
								</a>
							</li>
						</ul>
					</nav>
				</form>
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
