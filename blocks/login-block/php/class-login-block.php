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

	ob_start();
	?>
	<form id="form_login" class="o-box | c-login-form" method="post" autocomplete="off">

		<div class="c-login-form__input c-login-form__input--username">
			<label for="username" class="u-hidden-visually">
				[USERNAME]
			</label>
			<input
				type="[type]"
				id="username"
				name="username"
				placeholder="[username_label]"
				value="[Get this dynamically]"
			/>
		</div>

		<div class="c-login-form__input c-login-form__input--password">
			<label for="username" class="u-hidden-visually">
				[PASSWORD]
			</label>
			<input
				type="password"
				id="password"
				name="password"
				placeholder="[password_label]"
				value="[Get this dynamically]"
			/>
		</div>

		<div class="c-login-form__input c-login-form__input--submit">
			<input
				class="c-btn c-btn--primary c-btn--small"
				type="submit"
				value="[submit_label]"
			/>
		</div>

		<nav role="navigation">
			<ul class="o-list-inline | c-login-form__navigation">
				<?php
				if ( [get_option( 'users_can_register' )] ) { // Make Dynamic
					?>
					<li class="o-list-inline__item">
						<a
							href="<?php echo esc_url( wp_registration_url() ); ?>"
							title="[register_label]"
						>
						[register_label]
						</a>
					</li>
					<?php
				}
				?>
				<li class="o-list-inline__item">
					<a
						href="<?php echo esc_url( wp_lostpassword_url() ); ?>"
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
