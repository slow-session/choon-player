=== Choon Player ===
Contributors: asjl
Donate link: https://www.irishmusic.org.nz/make-a-donation/
Tags: music choon loop slow-down
Requires at least: 5.0
Tested up to: 5.5
Stable tag: trunk
Requires PHP: 7.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Include an audio player that supports loops and slowing down music by specifying the URL of the music in a shortcode.

== Description ==

Choon Player is a simple audio player that supports loops and slowing down music for learning by ear. It was developed for learning Irish Traditional music. 

To display the player, put a valid URL pointing to an MP3 or M4A recording between the shortcodes [choon] and [/choon] on your page or post.

== Screenshots ==

1. screenshot-1.png

== Installation ==

1. Upload the contents of this folder to  the `/wp-content/plugins/choon-player/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==

Not yet!

== Where can this be used? ==

Anywhere that shortcodes are accepted. Tested on pages but not on post or widgets using the Neve theme. Some CSS adjustment likely needed with other themes.

== How does it work? ==

The plugin includes the [choon] JavaScript library. The URL that is put in the shortcode is passed to that library, which places the player on the page instead of the shortcode.

= What can be put in the url that is placed in the shortcode? =

A pointer to an MP3 file. Other audio formats supported by the HTML5 audio player should also work.

= What parameters may be used? =

At this stage, none!

== Thanks ==

Special thanks to Paul Rosen for all his work on abcjs. The WordPress plugin parts of this code were based on his excellent ABC Notation plugin. Any bugs or features are all my own work!

The javascript code was based on the player used on the Wellington
Irish Session website. See: https://wellington.session.nz

All the code for that site is available at: https://github.com/slow-session/wellington.session.nz

== Changelog ==

= 0.0.1 =
* Initial version

= 0.0.2 =
* Minor tidyup of php code to simplify it

= 0.0.3 =
* Now supports more than one tune per page - lots of tunes on the same page are not a good idea!

= 0.0.4 =
* Add a 'choon' prefix to function and other variable names to avoid clashes
* Load additional libraries from local sources

= 0.0.5 =
* Minor changes to support Choon Player's addition to the Wordpress
plugin scheme

= 0.0.6 =
* Added support for URLs with non-ASCII characters e.g. accents in
Irish, Scots Gaelic etc

== Upgrade Notice ==

= 0.0.6 =
* Added support for URLs with non-ASCII characters e.g. accents in
Irish, Scots Gaelic etc
