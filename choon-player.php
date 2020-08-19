<?php
/*
Plugin Name: Choon Player
Plugin URI: https://github.com/slow-session/choon-player
Description: Play tunes with loop and slow down options - for learning Irish trad. Add a tune for playing on your WordPress site by simply specifying the URL of the tune in the shortcode <strong>[choon]</strong>.
Version: 1.0.0
Author: Andy Linton
Author URI: https://github.com/asjl
License: GPL version 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
*/

/*
Copyright (C) 2020 Andy Linton

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

//
//-- Add the javascript and css if there is a shortcode on the page.
//
function choon_conditionally_load_resources( $posts ) {

	if ( empty( $posts ) ) {
		return $posts;
	}
	$has_choon = false;
	foreach ( $posts as $post ) {
		if ( stripos( $post->post_content, '[choon' ) !== false ) {
			$has_choon = true;
			break;
		}
	}

	if ( $has_choon ) {
	    
	        // See https://cdnjs.com/libraries/noUiSlider
	        wp_enqueue_script( 'noUiSlider', 'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.0/nouislider.min.js');
	      
	        // See https://cdnjs.com/libraries/wnumb
	        wp_enqueue_script( 'wNumb', 'https://cdnjs.cloudflare.com/ajax/libs/wnumb/1.2.0/wNumb.min.js');

		wp_enqueue_script( 'choon-plugin', plugins_url( '/choon-player.js', __FILE__ ));

		$plugin_url = plugin_dir_url( __FILE__ );
	    
		wp_enqueue_style( 'noUiSlider', 'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.0/nouislider.min.css' );
	        wp_enqueue_style( 'choon-css', $plugin_url . 'choon-player.css' );
	}

	return $posts;
}

add_filter( 'the_posts', 'choon_conditionally_load_resources' );

// This turns the shortcode parameter back into the originally pasted string.
function process_choon( $content ) {
	$content2 = preg_replace("&<br />\r\n&", "\x01", $content);
	$content2 = preg_replace("&<br />\n&", "\x01", $content2);
	$content2 = preg_replace("&<br>\r\n&", "\x01", $content2);
	$content2 = preg_replace("&<br>\n&", "\x01", $content2);
	$content2 = preg_replace("&\r\n&", "\x01", $content2);
	$content2 = preg_replace("&\n&", "\x01", $content2);
	$content2 = preg_replace("-\"-", "\\\"", $content2);
	$content2 = preg_replace("-&#8221;-", "\\\"", $content2);
	$content2 = preg_replace("-&#8222;-", "\\\"", $content2);
	$content2 = preg_replace("-&#8217;-", "'", $content2);
	$content2 = preg_replace("-&#8243;-", "\\\"", $content2);
	$content2 = preg_replace("-&#8220;-", "\\\"", $content2);
	$content2 = preg_replace("-'-", "\\\'", $content2);
	return $content2;
}

// If a URL was passed in, then read the string from that, otherwise read the string from the contents.
function get_choon_string( $file, $content) {
	if ($file) {
		$content2 = file_get_contents( $file );
		$content2 = preg_replace("&\r\n&", "\x01", $content2);
		$content2 = preg_replace("&\n&", "\x01", $content2);
		$content2 = peg_replace("-'-", "\\\'", $content2);
		$content2 = preg_replace("-\"-", "\\\"", $content2);
	} else
		$content2 = process_choon($content);
	return $content2;
}

function construct_audioplayer_divs() {
	$output = '<!-- Choon Player code -->'  . "\n";
	$output .= '<div id="audioPlayer"></div>' . "\n";
    	$output .= '<div id="showPlayer"></div>' . "\n";

	return $output;
}

//
//-- Interpret the [choon] shortcode
//
function choon_create_music( $atts, $content ) {
	$a = shortcode_atts( array(
		'class' => '',
		'parser' => '{}',
		'engraver' => '{}',
		'render' => '{}',
		'file' => '',
		'number_of_tunes' => '1'
	), $atts );

	$content2 = get_choon_string($a['file'], $content);

	$output = construct_audioplayer_divs();
	$id = '100';
        $url = filter_var($content2, FILTER_SANITIZE_URL);

	$output .= '<script type="text/javascript">' .
            'window.onload = function () {' .
	  	'audioPlayer.innerHTML = createAudioPlayer();' .
		'showPlayer.innerHTML = createMP3player("' . $id . '", "' . $url . '");' .
		'createSliders("' . $id . '");' .
                '};' .
	    '</script>' . "\n";
        $output .= '<!-- End of Choon Player code -->';

	return $output;
}
add_shortcode( 'choon', 'choon_create_music' );

