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
class Secure_Block {

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

		// Load Classes
		$this->includes();
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
		register_block_type( 'matt-watson/secure-block', [
			'render_callback' => 'matt_watson\secure_blocks_for_gutenberg\matt_watson_secure_blocks_for_gutenberg_render',
		] );
	}

	/**
	 * Include Classes
	 */
	public function includes() {

		// Load Classes
		require_once 'class-api.php';
		$api = new API();
		$api->run();
	}
}

function matt_watson_secure_blocks_for_gutenberg_render( $attributes, $content ) {
	if ( is_admin() ) {
		return $content;
	}

	$is_valid_role    = true;
	$user             = wp_get_current_user();
	$roles            = $user->roles;
	$restricted_roles = array();

	if ( isset( $attributes['role'] ) ) {
		$decoded_roles = json_decode( $attributes['role'] );
		if ( ! empty( $decoded_roles ) ) {
			$is_valid_role = false;
			foreach ( $decoded_roles as $role ) {
				$restricted_roles[] = $role->value;
			}
			$is_valid_role = ( ! empty( array_intersect( $restricted_roles, $roles ) ) );
		}
	}

	$dom = new \DomDocument();
	$dom->loadXML( $content );

	$finder               = new \DomXPath( $dom );
	$secure_class         = 'wp-block-matt-watson-secure-block-inner-secure';
	$secure_content       = $finder->query( "//div[contains(@class, '$secure_class')]" );
	$unsecure_class       = 'wp-block-matt-watson-secure-block-inner-unsecure';
	$unsecure_content     = $finder->query( "//div[contains(@class, '$unsecure_class')]" );
	$secure_content_dom   = new \DOMDocument();
	$unsecure_content_dom = new \DOMDocument();

	foreach ( $secure_content as $node ) {
		$secure_content_dom->appendChild( $secure_content_dom->importNode( $node, true ) );
	}

	foreach ( $unsecure_content as $node ) {
		$unsecure_content_dom->appendChild( $unsecure_content_dom->importNode( $node, true ) );
	}

	$secure_content   = trim( $secure_content_dom->saveHTML() );
	$unsecure_content = trim( $unsecure_content_dom->saveHTML() );

	if ( is_user_logged_in() && $is_valid_role ) {
		return $secure_content;
	} else {
		return $unsecure_content;
	}
}
