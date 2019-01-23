<?php
namespace matt_watson\secure_blocks_for_gutenberg;

// Abort if this file is called directly.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class API
 *
 * WP REST API Custom Methods
 *
 * @package matt_watson\secure_blocks_for_gutenberg
 */
class API {

	private $version;
	private $namespace;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {

		$this->version   = '1';
		$this->namespace = 'matt-watson/secure-blocks/v' . $this->version;
	}

	/**
	 * Run all of the plugin functions.
	 *
	 * @since 1.0.0
	 */
	public function run() {
		add_action( 'rest_api_init', array( $this, 'user_roles' ) );
		add_action( 'rest_api_init', array( $this, 'option' ) );
	}

	/**
	 * Register REST API User Roles
	 */
	public function user_roles() {

		// Register Rest Route
		register_rest_route(
			$this->namespace,
			'/user-roles',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_user_roles' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	/**
	 * Get the user roles
	 *
	 * @return $roles JSON feed of returned objects
	 */
	public function get_user_roles() {
		global $wp_roles;

		$roles      = array();
		$user_roles = $wp_roles->roles;

		foreach ( $user_roles as $key => $role ) {
			$roles[] = array(
				'value' => $key,
				'label' => $role['name'],
			);
		}

		return $roles;
	}

	/**
	 * Register REST API User Roles
	 */
	public function option() {

		// Register Rest Route
		register_rest_route(
			$this->namespace,
			'/get/option/(?P<option>([A-Za-z0-9\_])+)/',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_option' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		// Register Rest Route
		register_rest_route(
			$this->namespace,
			'/update/option/(?P<option>([A-Za-z0-9\_])+)/(?P<value>([A-Za-z0-9\_])+)/',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'update_option' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	/**
	 * Get the option
	 *
	 * @return $roles JSON feed of returned option
	 */
	public function get_option( $request ) {
		$option = isset( $request['option'] ) ? esc_attr( $request['option'] ) : null;
		$value  = get_option( $option );

		return $value;
	}

	/**
	 * Update the option
	 *
	 * @return $roles JSON feed of returned option
	 */
	public function update_option( $request ) {
		$option = isset( $request['option'] ) ? esc_attr( $request['option'] ) : null;
		$value  = isset( $request['value'] ) ? $request['value'] : false;

		update_option( $option, 'true' === $value );

		return $value;
	}
}
