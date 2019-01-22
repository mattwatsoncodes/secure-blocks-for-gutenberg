<?php
namespace matt_watson\secure_blocks_for_gutenberg;

// Abort if this file is called directly.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Secure_Block
 *
 * The main loader for the secure block
 *
 * @package matt_watson\secure_blocks_for_gutenberg
 */
class Login_Block {

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {}

	/**
	 * Run all of the plugin functions.
	 *
	 * @since 1.0.0
	 */
	public function run() {

		// Register the Block
		$this->register_dynamic_block();
	}

	/**
	 * Register the dynamic block.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_dynamic_block() {

		// Only load if Gutenberg is available.
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		// Hook server side rendering into render callback
		register_block_type( 'matt-watson/login-block', [
			'render_callback' => 'matt_watson\secure_blocks_for_gutenberg\matt_watson_secure_blocks_for_gutenberg_login_block_render',
		] );
	}
}

function matt_watson_secure_blocks_for_gutenberg_login_block_render( $attributes, $content ) {

	if ( is_admin() ) {
		return $content;
	}

	$has_registration = get_option( 'users_can_register' );
	$registration_url = wp_registration_url();
	$reset_url        = wp_lostpassword_url();

	ob_start();
	?>
	<form class="login-block" method="post" autocomplete="off">

		<p class="field-group field-group--text">
			<label class="field-group__label" for="username">
				[USERNAME]
				<input
					class="field-group__control"
					type="text"
					id="username"
					name="username"
					placeholder="[username_label]"
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
				<?php
				if ( $has_registration ) {
					?>
					<li class="login-block__navigation-item">
						<a
							class="login-block__navigation-link"
							href="<?php echo esc_url( $registration_url ); ?>"
							title="[register_label]"
						>
						[register_label]
						</a>
					</li>
					<?php
				}
				?>
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

		<?php
		// Render the NOnce for security.
		wp_nonce_field( 'form_login', 'form_login_nonce' );
		?>
	</form>
	<?php
	$html = ob_get_contents();
	ob_end_clean();

	return $html;
}
