=== Choon Player===
Contributors: asjl
Tags: music choon loop slow-down
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Include an audio player that supports loops and slowing down music in a WordPress site by simply specifying the URL of the music.

== Description ==

This includes the Choon Player on your WordPress site. To display the player, put a valid URL pointing to an MP3 or M4A recording between the shortcodes [choon] and [/choon] on your page or post.

== Installation ==

1. Upload this folder to the `/wp-content/plugins/` directory.
1. Activate the plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==

= Where can this be used? =

Anywhere that shortcodes are accepted. That is, on pages, post, and widgets. It will not work on comments.

= How does it work? =

The plugin includes the [choon](http://choon.net/) JavaScript library. The URL that is put in the shortcode is passed to that library, which places the player on the page instead of the shortcode.

= What can be put in the url that is placed in the shortcode? =

A pointer to an MP3 file. Other audio formats may also work.

= What parameters may be used? =

At this stage, none!

== Thanks ==

Special thanks to Paul Rosen. The Wordpress plugin parts of this code were based on his ABC Notation plugin. Any bug/features are all my own work!

== Upgrade Notice ==

= 1.0.0 =
* Initial version

== Screenshots ==

1. An example of a shortcode and the resultant music that is produced.

== Changelog ==

= 1.12 =
* Initial version of this plugin. (Version numbers are in sync with the version of choon that is included.)

= 2.0 =
* Upgrade choon version.

= 2.1 =
* Upgrade choon version.

= 2.3 =
* Upgrade choon version. See https://github.com/paulrosen/choon for details.

= 2.3.1 =
* Added entry point for creating MIDI downloads.
* Tested through WP 4.4.

= 3.1.3 =
* Upgrade to use the choon 3.1.3 code.
* Add &#8222; as one of the smart quotes.

= 3.1.4 =
* Add parameter to do responsiveness.

= 3.2.0 =
* Add overlay feature
* Bug fixes
* Upgrade to use the choon 3.2.0 code.

= 3.2.1 =
* Fix crash when window.performance is not available.
* Fix placement of rests when the stem direction is forced.
* Upgrade to use the choon 3.2.0 code.

= 3.3.0 =
* Upgrade to use the choon 3.3.0 code.

= 3.3.2 =
* Upgrade to use the choon 3.3.2 code.
* Add "file" parameter to get the ABC from a separate file.
* Allow files with the extension ".abc" to be uploaded in Add Media.
* Add the "number_of_tunes" parameter to allow more than one tune to be displayed.

= 3.3.4 =
* Upgrade to use the choon 3.3.4 code.

= 4.1.0 =
* Upgrade to use the choon 4.1.0 code.

= 5.0.0 =
* Upgrade to use the choon 5.0.0 code.

= 5.8.1 =
* Upgrade to use the choon 5.8.1 code.
* Add entry point to draw music and audio and animate the audio.

