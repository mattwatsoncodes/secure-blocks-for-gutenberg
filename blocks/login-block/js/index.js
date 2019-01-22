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
			passwordLabel: {
				type:    'string',
				default: __( 'Username or Email Address', 'secure-blocks-for-gutenberg' ),
			},
			registerLabel: {
				type:    'string',
				default: __( 'Register', 'secure-blocks-for-gutenberg' ),
			},
			registerURL: {
				type:    'string',
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
			userNameType: {
				type:    'string',
				default: 'both',
			},
		},
		edit: ( props => {
			let { 
				attributes: {
					passwordLabel,
					registerLabel,
					registerURL,
					resetLabel,
					resetURL,
					submitLabel,
					userNameLabel,
					userNameType,
				}, 
				className, 
				isSelected,
				setAttributes, 
			} = props;

			if ( userNameLabel ) {
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
				<Inspector { ...{ setAttributes, ...props } }/>,
				<form className={ classnames( className, 'login-block' ) } method="post" autocomplete="off">

					<p class="field-group field-group--text">
						<label class="field-group__label" for="username">
							{ userNameLabel }
							<input
								class="field-group__control"
								type="text"
								id="username"
								name="username"
								placeholder={ userNameLabel }
								value="[Get this dynamically]"
							/>
						</label>
					</p>

					<p class="field-group field-group--password">
						<label class="field-group__label" for="password">
							[PASSWORD]
							<input
								class="field-group__control"
								type="password"
								id="password"
								name="password"
								placeholder="[password_label]"
								value="[Get this dynamically]"
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
								placeholder="[rememberme_label]"
								value="forever"
							/>
							[rememberme_label]
						</label>

					</p>

					<p class="field-group field-group--submit">
						<input
							class="field-group__control"
							class="button button--primary"
							type="submit"
							value="[submit_label]"
						/>
					</p>

					<nav role="navigation" class="login-block__navigation">
						<ul class="login-block__navigation-list">
								<li class="login-block__navigation-item">
									<a
										class="login-block__navigation-link"
										href="<?php echo esc_url( $registration_url ); ?>"
										title="[register_label]"
									>
									[register_label]
									</a>
								</li>
							<li class="login-block__navigation-item">
								<a
									class="login-block__navigation-link"
									href="<?php echo esc_url( $reset_url ); ?>"
									title="[forgot_label]"
								>
								[forgot_label]
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
