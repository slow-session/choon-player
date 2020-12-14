<?php
/*
Plugin Name: Choon Player
Version: 0.1.3
Description: Play tunes in a loop with a slow down option - good for learning Irish trad. Add a tune by pasting a URL pointing to an MP3 recording in a shortcode <strong>[choon]</strong> or by pasting the ABC notation for the tune in the shortcode <strong>[choon-abc]</strong>.
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
	// Javascript libraries
	// See https://cdnjs.com/libraries/noUiSlider
	wp_enqueue_script( 'noUiSlider', plugins_url( '/js/nouislider.min.js', __FILE__));
	// See https://cdnjs.com/libraries/wnumb
	wp_enqueue_script( 'wNumb', plugins_url( '/js/wNumb.min.js', __FILE__ ));
        // See https://github.com/PencilCode/musical.js
	wp_enqueue_script( 'musical', plugins_url( '/js/musical.min.js', __FILE__));
	
	// The choon-player code
	wp_enqueue_script( 'choon', plugins_url( '/js/choon-player.js', __FILE__ ));
	// The choon-abc-player code
	wp_enqueue_script( 'choon-abc', plugins_url( '/js/choon-abc-player.js', __FILE__ ));

	// CSS files
	$plugin_url = plugin_dir_url( __FILE__ );
	// See https://cdnjs.com/libraries/noUiSlider
	wp_enqueue_style( 'noUiSlider', $plugin_url .'css/nouislider.min.css' );
	// The choon-layer CSS
	wp_enqueue_style( 'choon', $plugin_url . 'css/choon-player.css' );
    }

    return $posts;
}
add_filter( 'the_posts', 'choon_conditionally_load_resources' );

function choon_construct_audioplayer() {
    $output = '<!-- Start of Choon audioPlayer code -->'  . "\n";
    $output .= '<div id="audioPlayer"></div>' . "\n";
    $output .= '<script type="text/javascript">' . "\n";
    $output .= 'audioPlayer.innerHTML = choon.createAudioPlayer();' . "\n";
    $output .= '</script>' . "\n";
    $output .= '<!-- End of Choon audioPlayer code -->'  . "\n";
    
    return $output;
}

//
//-- Interpret the [choon] shortcode
//
function choon_create_player( $atts = [], $content ) {
    // php doesn't handle non-ASCII characters at all well
    // that's a problem for names in Irish (and other languages)
    // this encodes non-ASCII chars before calling filter_var
    $path = parse_url($content, PHP_URL_PATH);
    $encoded_path = array_map('urlencode', explode('/', $path));
    $content = str_replace($path, implode('/', $encoded_path), $content);

    // the [choon] tag is used to pass in this URL
    $url = filter_var($content, FILTER_SANITIZE_URL);
    
    static $tune_id = 0;
    if ($tune_id == 0) {
	// create the audioplayer once
	$output = choon_construct_audioplayer();
    }
    $tune_id++;
  
    // Make a new div for each tune on a page
    // Lots of players on a page are not a good idea!
    $output .= '<!-- Start of Choon MP3 Player code -->' . "\n";
    $output .= '<div id="choonMP3Player' . $tune_id . '"></div>' . "\n";
    $output .= '<script type="text/javascript">' . "\n";
    $output .= 'choonMP3Player' . $tune_id . '.innerHTML = choon.createMP3player("' . $tune_id . '", "' . $url . '");' . "\n";
    $output .= 'choon.createAudioSliders("' . $tune_id . '");' . "\n";
    $output .= '</script>' . "\n";
    $output .= '<!-- End of Choon MP3 Player code -->' . "\n";

    return $output;
}
add_shortcode( 'choon', 'choon_create_player' );

//
//-- Interpret the [choon-abc] shortcode
//
function choon_abc_create_player( $atts = [], $content ) {
    static $tune_id = 0;
    $tune_id++;
  
    $output = '<!-- Start of Choon ABC Player code -->' . "\n";
    // Make a textarea for each tune
    $textArea = "choonTextArea" . $tune_id;
    $output .= '<textarea id="' . $textArea . '" style="display:none;">' . strip_tags($content) . '</textarea>' . "\n";;
    // Make a new div for each tune on a page
    $output .= '<div id="choonABCplayer' . $tune_id . '"></div>' . "\n";
    $output .= '<script type="text/javascript">' . "\n";
    $output .= 'choonABCplayer' . $tune_id . '.innerHTML = choon_abc.createABCplayer("' . $textArea . '", "' . $tune_id . '", "piano");' . "\n";
    $output .= 'choon_abc.createABCSliders("' . $textArea . '", "' . $tune_id . '");' . "\n";
    $output .= '</script>' . "\n";
    $output .= '<!-- End of choon-abc MP3 Player code -->' . "\n";

    return $output;
}
add_shortcode( 'choon-abc', 'choon_abc_create_player' );

?>
