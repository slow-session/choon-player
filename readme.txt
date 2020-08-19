=== ABC Notation ===
Contributors: paulrosen
Donate link: http://wordpress.paulrosen.net/plugins/abc-notation
Tags: music abc-notation sheet-music choon
Requires at least: 4.0
Tested up to: 5.2.2
Stable tag: 5.8.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Include sheet music on your WordPress site by simply specifying the ABC style string.

== Description ==

This includes the choon system on your WordPress site. To produce sheet music, put a valid ABC Notation string between the shortcodes [choon] and [/choon] on your page or post.

This also generates MIDI by using the shortcode [choon-midi] and can produce both visual and audio music that is coordinated with [choon-audio].

== Installation ==

1. Upload this folder to the `/wp-content/plugins/` directory.
1. Activate the plugin through the 'Plugins' menu in WordPress.
1. Click 'Settings' in the dashboard, then 'ABC Notation' to customize.

== Frequently Asked Questions ==

= Where can this be used? =

Anywhere that shortcodes are accepted. That is, on pages, post, and widgets. It will not work on comments.

= How does it work? =

The plugin includes the [choon](http://choon.net/) JavaScript library. The string that is put in the shortcode is passed to that library, which translates it and renders it in an SVG element that it places on the page instead of the shortcode.

= What can be put in the ABC string that is placed in the shortcode? =

There is much written about ABC Notation around the web. You can start [here](http://abcnotation.com)

= What parameters may be used? =

The shortcode can take the same parameters as choon. See [the documentation](https://github.com/paulrosen/choon/blob/master/api.md) for details.

There is also an interactive way to play with the parameters: [Configurator](https://configurator.choon.net).

Here are some examples:

To make the music responsive:
```
[choon engraver="{ responsive: 'resize' }"]
... some ABC string ...
[/choon]
```

To set or override the tempo:
```
[choon-midi midi="{ qpm: 150 }"]
... some ABC string ...
[/choon-midi]
```

List of parameters to the `[choon]` shortcode:

`[choon class="abc-paper"] etc... [/choon]` puts the named class on the generated `<svg>` element.

`[choon parser="{}" engraver="{}" render="{}"] etc... [/choon]` passes the javascript objects straight through to `choon.renderAbc`. See the choon documentation for details.

`[choon file="https://url/to/abc/file"]` loads the string from the specified file instead of the embedded string. You can upload this file using Add New Media or it can reside in any publicly available place.

`[choon number_of_tunes=2]` if there are more than one tune in the ABC string, this specifies how many should be printed out. If this is set to more than the number of tunes in the string, that's ok, the additional places are ignored, so if you want to be sure you have all the tunes, then use a high number for this.

List of parameters to the `[choon-midi]` shortcode:

`[choon-midi class="abc-paper"] etc... [/choon-midi]` puts the named class on the generated MIDI element.

`[choon-midi parser="{}" midi="{}"] etc... [/choon-midi]` passes the javascript objects straight through to `choon.renderMidi`. See the choon documentation for details.

`[choon-midi file="https://url/to/abc/file"] etc... [/choon-midi]` loads the string from the specified file instead of the embedded string. You can upload this file using Add New Media or it can reside in any publicly available place.

`[choon-midi number_of_tunes=2] etc... [/choon-midi]` if there are more than one tune in the ABC string, this specifies how many should be printed out. If this is set to more than the number of tunes in the string, that's ok, the additional places are ignored, so if you want to be sure you have all the tunes, then use a high number for this.

List of parameters to the `[choon-audio]` shortcode:

`[choon-audio class-paper="choon-paper"] etc... [/choon-audio]` puts the named class on the generated `<svg>` element.

`[choon-audio class-audio="choon-audio"] etc... [/choon-audio]` puts the named class on the generated MIDI element.

`[choon-audio params="{}"] etc... [/choon-audio]` passes the javascript objects straight through to `choon.renderAbc` and `choon.renderMidi`. See the choon documentation for details.

`[choon-audio file="https://url/to/abc/file"] etc... [/choon-audio]` loads the string from the specified file instead of the embedded string. You can upload this file using Add New Media or it can reside in any publicly available place.

`[choon-audio number_of_tunes=2] etc... [/choon-audio]` if there are more than one tune in the ABC string, this specifies how many should be printed out. If this is set to more than the number of tunes in the string, that's ok, the additional places are ignored, so if you want to be sure you have all the tunes, then use a high number for this.

`[choon-audio animate="false"] etc... [/choon-audio]` If true, this will cause a cursor to follow the music as it is playing.

`[choon-audio qpm="undefined"] etc... [/choon-audio]` If this is present, then it sets the beats per minute. If is not set, then the beats per minute is set by the `Q:` line in the ABC string.

= Help! Some characters are not printing properly. =

Try pasting the ABC string in using the "Text" editor instead of the "Visual" editor. That will help keep the quotation marks and any other interpreted characters from being changed by WordPress.

== Thanks ==

Special thanks to http://www.beliefmedia.com/ for the idea to load the ABC string from a file, and for the idea to conditionally load the javascript only if there is a shortcode on the page.

== Upgrade Notice ==

= 5.8.1 =
* Upgrade to use the choon 5.8.1 code.
* Add entry point to draw music and audio and animate the audio.

= 5.0.0 =
* Upgrade to use the choon 5.0.0 code.

= 4.1.0 =
* Upgrade to use the choon 4.1.0 code.

= 3.3.4 =
* Upgrade to use the choon 3.3.4 code.

= 3.3.2 =
* Upgrade to use the choon 3.3.2 code.
* Add "file" parameter to get the ABC from a separate file.
* Allow files with the extension ".abc" to be uploaded in Add Media.
* Add the "number_of_tunes" parameter to allow more than one tune to be displayed.

= 3.3.0 =
* Upgrade to use the choon 3.3.0 code.

= 3.0.1 =
* Upgrade to use the choon 3.0.1 code.

= 3.0.0 =
* Upgrade to use the choon 3.0 code.

= 2.1 =
* Upgrade to use the choon 2.1 code.

* Allow the shortcode to appear inside a <pre> tag.

= 2.0 =
* Upgrade to use the choon 2.0 code.

= 1.12.1 =
* Get rid of smart quotes.

= 1.12 =
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

