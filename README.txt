=== Choon Player ===
Contributors: asjl
Tags: music choon loop slow-down
Requires at least: 5.0
Tested up to: 5.6
Stable tag: trunk
Requires PHP: 7.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Include an audio player that supports loops and slowing down music by specifying the URL of the music in a shortcode.

== Description ==

Choon Player is a simple audio player that supports loops and slowing down music for learning by ear. It was developed for learning Irish Traditional music. It supports two players:

1. A player for MP3 files. To display the player, put a valid URL pointing to an MP3 or M4A recording between the shortcodes [choon] and [/choon] on your page or post.

2. A player for ABC notation. To display the player, put valid ABC notation between the shortcodes [choon-abc] and [/choon-abc] on your page or post.

== Screenshots ==

1. screenshot-1.png
2. screenshot-2.png

== Installation ==

* Download the WordPress plugin available from https://wordpress.org/plugins/choon-player/

or

* Upload the contents of the GitHub archive at
https://github.com/slow-session/choon-player to  the `/wp-content/plugins/choon-player/` directory.

Activate the plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==

Not yet!

== Where can this be used? ==

Anywhere that shortcodes are accepted. Tested on pages but not on post or widgets using the Neve theme. Some CSS adjustment likely needed with other themes.

== How does it work? ==

The plugin includes the [choon] and [choon-abc] JavaScript libraries. The URL or ABC notation that is put in the shortcode is passed to the relevant library, which places the player on the page instead of the shortcode.

= What can be put in the url that is placed in the [choon] shortcode? =

A pointer to an MP3 file. Other audio formats supported by the HTML5 audio player should also work.

= What can be put in the block of text that is placed in the [choon-abc] shortcode? =

A block of valid ABC text. See [https://thesession.org](https://thesession.org) for examples.

= What parameters may be used? =

At this stage, none!

== Thanks ==

Special thanks to Paul Rosen for all his work on abcjs. The WordPress plugin parts of this code were based on his excellent ABC Notation plugin. Any bugs or features are all my own work!

The javascript code was based on the players used on the [Wellington
Irish Session](https://wellington.session.nz)

All the code for that site is available at:
[https://github.com/slow-session/wellington.session.nz](https://github.com/slow-session/wellington.session.nz)

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

= 0.0.7 =
* Fixed the link to the "play" and "pause" buttons

= 0.0.8 =
* updated choon-player.js to use "module.exports"

= 0.1.0 =
* added support for a simple ABC player with similar features to the MP3 player

= 0.1.1 =
* strip any lyrics from ABC notation (lines that start with 'w:') as
they mess up tune length calculations

= 0.1.2 =
* fix version number

= 0.1.3 =
* add to documentation

== Upgrade Notice ==

= 0.1.3 =
* add to documentation
