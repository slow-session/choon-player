<?php
/*
Plugin Name: Choon Player
Version: 0.0.1
Description: Play tunes with loop and slow down options - for learning Irish trad. Add a tune for playing on your WordPress site by simply specifying the URL of the tune in the shortcode <strong>[choon]</strong>.
Plugin URI: https://github.com/slow-session/choon-player
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
        
        // See https://cdnjs.com/libraries/noUiSlider
        wp_enqueue_style( 'noUiSlider', 'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.6.0/nouislider.min.css' );
        
	    wp_enqueue_style( 'choon', $plugin_url . 'choon-player.css' );
	}

	return $posts;
}
add_filter( 'the_posts', 'choon_conditionally_load_resources' );

function construct_audioplayer_divs() {
	$output = '<!-- Choon Player code -->'  . "\n";
	$output .= '<div id="audioPlayer"></div>' . "\n";
    $output .= '<div id="showPlayer"></div>' . "\n";

	return $output;
}

$tune_found = false;

//
//-- Interpret the [choon] shortcode
//
function choon_create_player( $atts = [], $content ) {
    // the [choon] tag is used to pass in this URL
    $url = filter_var($content, FILTER_SANITIZE_URL);

    global $tune_found;
    if ($tune_found == false) {
        // create the divs for the player
        $output = construct_audioplayer_divs();
    }
    $tune_found = true;
    
    // if we ever want to have more than one player on the page
	// we'll need to have more than one 'id' - later...
	$id = '100';
    
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
add_shortcode( 'choon', 'choon_create_player' );

?>
