=== Secure Blocks for Gutenberg ===
Contributors: mwtsn
Tags: gutenberg, block, secure, password, protected, blocks, gutenberg blocks, gutenberg block, editor, addon, add on, add-on, gutenberg addon, wordpress 5, passworded, login, logged-in
Requires at least: 5.0
Tested up to: 5.0
Requires PHP: 5.6
Stable tag: 1.4.3
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Secure your content in the editor by user role with Secure Blocks for Gutenberg

== Description ==

Secure your content in the editor by user role with Secure Blocks for Gutenberg.

Using Secure Blocks you can add any Gutenberg block inside a secure block, have it render only to logged in users, or lock it down to a user role of your choosing.

Secure Blocks also provides an additional area that can display blocks to users that do not have permission to view the content.

For more information [read the Secure Blocks introductory blog post](https://mattwatson.codes/introducing-secure-blocks-for-wordpress-gutenberg/), or view the video:

[youtube https://youtu.be/fXGPeWo_nzg]

The plugin provides the following functionality:

- Display content only to logged-users
- Display alternative content to logged-out users
- Display content to users within certain user roles
- Display alternative content to users not in those user roles

== Installation ==

1. Backup your WordPress install
2. Upload the plugin folder to the `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress

= Minimum Requirements =

You’ll need the **Gutenberg** editor active on your site.

== Frequently Asked Questions ==
TBC

== Screenshots ==

1. Standard Gutenberg Content
2. Adding the Secure Block
3. What you first see when you add the Secure Block
4. Add any blocks to the Secure Block
5. Viewing the site when logged-in
6. Viewing the site when logged-out
7. Using the Inspector to select roles to lock the content down further
8. Locking down to certain user roles
9. The Secure Block interface reflects the user roles you choose
10. Adding content which is locked down by user role.
11. You are not restricted to the kind of block you can secure
12. A full screen image is not limited by the bounds of the Secure Block

== Changelog ==

= 1.0.0 =

* First release

= 1.1.0 =

* Fixed issue whereby the plugin would not render in certain server environments

= 1.1.1 =

* Removed frontend asset enqueues that didn't do anything.

= 1.2.0 =

* Fixed issue that prevented blocks saving properly in some scenarios.

= 1.3.0 =

* Replaced `withAPIData` with `withSelect` due to depreciation in core.

= 1.4.0 =

* Updated `withSelect` to use latest API.

= 1.4.3 =

* Bug fixes and refactor.

== Roadmap ==

Features coming soon to aid with securing sites:

- Login Block
- Register Block
- Password Reset Block
- Restrict entire pages / posts, not just inline content
