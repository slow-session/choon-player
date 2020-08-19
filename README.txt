=== Choon Player===
Contributors: asjl
Tags: music choon loop slow-down
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Include an audio player that supports loops and slowing down music in a WordPress site by simply specifying the URL of the music.

== Description ==

This includes the Choon Player on your WordPress site. To display the player, put a valid URL pointing to an MP3 or M4A recording between the shortcodes [choon] and [/choon] on your page or post.

== Installation ==

1. Upload the zipfile from the green 'Code' tab for this archive to the `/wp-content/plugins/` directory.
1. Activate the plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==

= Where can this be used? =

Anywhere that shortcodes are accepted. Tested on pages but not on post, and widgets.

= How does it work? =

The plugin includes the [choon](http://choon.net/) JavaScript library. The URL that is put in the shortcode is passed to that library, which places the player on the page instead of the shortcode.

= What can be put in the url that is placed in the shortcode? =

A pointer to an MP3 file. Other audio formats may also work.

= What parameters may be used? =

At this stage, none!

== Thanks ==

Special thanks to Paul Rosen. The Wordpress plugin parts of this code were based on his ABC Notation plugin. Any bug/features are all my own work!

This code was based on the player used the Wellington Irish Session website. See https://wellington.session.nz 

All the code for that site is available at:

    https://github.com/slow-session/wellington.session.nz

== Upgrade Notice ==

= 0.0.1 =
* Initial version

