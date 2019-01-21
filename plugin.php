<?php
/**
 * Secure Blocks for Gutenberg
 *
 * @link              https://github.com/mwtsn/secure-blocks-for-gutenberg
 * @package           matt-watson\secure-blocks-for-gutenberg
 *
 * Plugin Name:       Secure Blocks for Gutenberg
 * Plugin URI:        https://github.com/mwtsn/secure-blocks-for-gutenberg
 * Description:       Secure your content in the editor by user role with Secure Blocks for Gutenberg
 * Version:           1.4.2
 * Author:            Matt Watson <matt@mwatson.co.uk>
 * Author URI:        https://mwatson.co.uk
 * License:           GPL-3.0+
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       secure-blocks-for-gutenberg
 * Domain Path:       /languages
 */

/**
 * Copyright (C) 2018  Matt Watson  matt@mwatson.co.uk
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 3, as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

namespace matt_watson\secure_blocks_for_gutenberg;

// Abort if this file is called directly.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Constants.
define( 'MATT_WATSON_SECURE_BLOCKS_FOR_GUTENBERG_ROOT', __FILE__ );
define( 'MATT_WATSON_SECURE_BLOCKS_FOR_GUTENBERG_PREFIX', 'matt_watson_secure_blocks_for_gutenberg' );

/**
 * The main loader for this plugin
 */
class Main {

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

		/**
		 * Load Text Domain
		 */
		load_plugin_textdomain( 'secure-blocks-for-gutenberg', false, MATT_WATSON_SECURE_BLOCKS_FOR_GUTENBERG_ROOT . '\languages' );

		/**
		 * Actions and Hooks
		 */

		// Load Assets
		add_action( 'enqueue_block_editor_assets', array( $this, 'editor_assets' ) ); // Load Editor Assets
		// add_action( 'enqueue_block_assets', array( $this, 'assets' ) );               // Load Front End Assets
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_assets' ) );        // Load Admin Assets

		// Add Settings Page Link.
		// add_action( 'plugin_action_links_' . plugin_basename( MATT_WATSON_SECURE_BLOCKS_FOR_GUTENBERG_ROOT ), array( $this, 'plugin_action_links' ) );

		// Load Classes
		add_action( 'init', array( $this, 'includes' ) );
	}

	/**
	 * Enqueue Editor JS and CSS
	 */
	public function editor_assets() {

		$scripts = '/assets/js/editor.js';
		$styles  = '/assets/css/editor.css';

		// Enqueue editor JS.
		wp_enqueue_script(
			'secure-blocks-for-gutenberg-editor-js',
			plugins_url( $scripts, __FILE__ ),
			array(
				'wp-api',
				'wp-blocks',
				'wp-components',
				'wp-data',
				'wp-editor',
				'wp-element',
				'wp-i18n',
			),
			filemtime( plugin_dir_path( __FILE__ ) . $scripts )
		);

		// Enqueue edtior Styles.
		wp_enqueue_style(
			'secure-blocks-for-gutenberg-editor-css',
			plugins_url( $styles, __FILE__ ),
			array(),
			filemtime( plugin_dir_path( __FILE__ ) . $styles )
		);
	}

	/**
	 * Enqueue JS and CSS
	 */
	public function assets() {

		$scripts = '/assets/js/script.js';
		$styles  = '/assets/css/style.css';

		// Only render on Front End.
		if ( ! is_admin() ) {
			// Enqueue JS.
			wp_enqueue_script(
				'secure-blocks-for-gutenberg-js',
				plugins_url( $scripts, __FILE__ ),
				array(),
				filemtime( plugin_dir_path( __FILE__ ) . $scripts )
			);
		}

		// Enqueue Styles.
		wp_enqueue_style(
			'secure-blocks-for-gutenberg-css',
			plugins_url( $styles, __FILE__ ),
			array(),
			filemtime( plugin_dir_path( __FILE__ ) . $styles )
		);
	}

	/**
	 * Enqueue Admin Styles.
	 */
	public function admin_assets() {

		$styles = '/assets/css/admin.css';

		// Enqueue Styles.
		wp_enqueue_style(
			'secure-blocks-for-gutenberg-admin-css',
			plugins_url( $styles, __FILE__ ),
			array(),
			filemtime( plugin_dir_path( __FILE__ ) . $styles )
		);
	}

	/**
	 * Include Classes
	 */
	public function includes() {

		// Load Classes
		require_once 'blocks/secure-block/php/class-secure-block.php';
		$secure_block = new Secure_Block();
		$secure_block->run();
	}


	/**
	 * Add 'Settings' action on installed plugin list.
	 *
	 * @param array $links An array of plugin action links.
	 */
	public function plugin_action_links( $links ) {
		array_unshift(
			$links,
			'<a href="options-general.php?page=' .
				esc_attr( MATT_WATSON_SECURE_BLOCKS_FOR_GUTENBERG_PREFIX ) . '">' .
				esc_html__( 'Settings', 'secure-blocks-for-gutenberg' ) .
			'</a>'
		);

		return $links;
	}
}

$main = new Main();
$main->run();
