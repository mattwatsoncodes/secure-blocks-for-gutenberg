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
	}

	/**
	 * Register REST API
	 */
	public function user_roles() {

		// Council
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
}
