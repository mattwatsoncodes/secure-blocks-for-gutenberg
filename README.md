# Secure Blocks for Gutenberg

Secure your content in the editor by user role with Secure Blocks for Gutenberg.

Using Secure Blocks you can add any Gutenberg block inside a secure block, have it render only to logged in users, or lock it down to a user role of your choosing.

Secure Blocks also provides an additional area that can display blocks to users that do not have permission to view the content.

For more information [read the Secure Blocks introductory blog post](https://mattwatson.codes/introducing-secure-blocks-for-wordpress-gutenberg/), or view the video:

[![Introducing Secure Blocks for WordPress Gutenberg](https://img.youtube.com/vi/fXGPeWo_nzg/0.jpg)](https://youtu.be/fXGPeWo_nzg)

The plugin provides the following functionality:

- Display content only to logged-users
- Display alternative content to logged-out users
- Display content to users within certain user roles
- Display alternative content to users not in those user roles

## Build Notes

1. Install Webpack globally: `npm install --global webpack`
2. Install everything you need: `npm install`
3. Build with `npm run dev` or `npm run build`
