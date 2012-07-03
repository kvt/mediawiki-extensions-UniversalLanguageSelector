(function( $ ) {
	"use strict";

	var LanguageCategoryDisplay = function( element, options ) {
		this.$element = $( element );
		this.options = $.extend( {}, $.fn.lcd.defaults, options );
		this.$element.addClass( 'lcd' );
		this.show();
		this.listen();
	};

	LanguageCategoryDisplay.prototype = {
		constructor: LanguageCategoryDisplay,

		append: function( langCode, regionCode ) {
			var that = this;
			this.addToRegion( langCode, regionCode );
		},

		/**
		 * Add the language to a region.
		 * If the region parameter is given , add to that region alone
		 * Otherwise to all regions that this language belongs.
		 * @param langCode
		 * @param region
		 */
		addToRegion: function( langCode, region ) {
			var that = this,
				language = $.uls.data.languages[langCode];

			// TODO: This shouldn't happen.
			// This currently happens with some special cases, such as qqq and
			// some codes that are incorrectly used in Wikimedia projects for
			// historical reasons.
			if ( !language ) {
				console.log( "Definition for " + langCode + " was not found in the language database." );
				return;
			}

			var langName = that.options.languages[langCode];

			var regions = [];
			if ( region ) {
				regions.push( region );
			} else {
				regions = $.uls.data.regions( langCode );
			}

			for ( var i = 0; i < regions.length; i++ ) {
				var regionCode = regions[i];

				var $li = $( '<li>' )
					.data( 'code', langCode )
					.append(
						$( '<a>' ).prop( 'href', '#' ).html( langName )
					);

				// Append the element to the column in the list
				var column = that.getColumn( regionCode );
				column.append( $li );

				if ( that.options.clickhandler ) {
					$li.click( function() {
						that.options.clickhandler.call( this, langCode );
					} );
				}
			}
		},

		getColumn: function( regionCode ) {
			var $divRegionCode = $( 'div#' + regionCode );

			var $ul = $divRegionCode.find( 'ul:last' );
			if ( $ul.length === 0 || $ul.find( 'li' ).length >= 10 ) {
				$ul = $( '<ul>' );
				$divRegionCode.append( $ul );
			}

			$divRegionCode.show();

			return $ul;
		},

		show: function() {
			var that = this;
			$.each( $.uls.data.regiongroups, function( regionCode, regionIndex ) {
				var $section = $( '<div>' ).addClass( 'uls-lcd-region-section' ).prop( 'id', regionCode );
				$section.append( $( '<h3>' ).html( regionCode ) );
				// FIXME this is regioncode(NA, EU etc). Should be Proper localized region name.
				$section.append( $( '<ul>' ) );
				that.$element.append( $section );
			} );
		},

		empty: function() {
			this.$element.find( 'div ul' ).remove();
			this.$element.find( 'div' ).hide();
		},

		listen: function() {
			var that = this;
			// The region section need to be in sync with the map filter.
			that.$element.scroll( function () {
				var inviewRegion = $( 'div.uls-lcd-region-section:first' ).attr( 'id' );
				var listtop = that.$element.position().top;
				$( 'div.uls-lcd-region-section' ).each( function () {
					var offset = $( this ).position().top - listtop;
					if ( offset < 0 ) {
						inviewRegion = $( this ).attr( 'id' );
					} else {
						return false;
					}
				} );

				var inview = $.uls.data.regiongroups[inviewRegion];
				$( 'div.uls-region' ).removeClass( 'active' );
				$( 'div#uls-region-' + inview ).addClass( 'active' );
			} );
		}

	};

	$.fn.lcd = function( option ) {
		return this.each( function() {
			var $this = $( this ),
				data = $this.data( 'lcd' ),
				options = typeof option === 'object' && option;

			if ( !data ) {
				$this.data( 'lcd', ( data = new LanguageCategoryDisplay( this, options ) ) );
			}
			if ( typeof option === 'string') {
				data[option]();
			}
		} );
	};

	$.fn.lcd.defaults = {
		languages: null
	};

	$.fn.lcd.Constructor = LanguageCategoryDisplay;

} )( jQuery );
