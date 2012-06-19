<?php
/**
 * Universal Language Selector extension
 * https://www.mediawiki.org/wiki/Universal_Language_Selector
 *
 * @file
 * @ingroup Extensions
 * @author Santhosh Thottingal
 * @copyright © 2012 Santhosh Thottingal
 * @licence GNU General Public Licence 3.0 or later
 */

if ( !defined( 'MEDIAWIKI' ) ) {
	echo( "This file is an extension to the MediaWiki software and cannot be used standalone.\n" );
	die( -1 );
}

$wgExtensionCredits['other'][] = array(
	'path'           => __FILE__,
	'name'           => 'UniversalLanguageSelector',
	'version'        => '0.1',
	'author'         => array( 'Santhosh Thottingal' ),
	'url'            => 'https://www.mediawiki.org/wiki/Extension:UniversalLanguageSelector',
	'descriptionmsg' => 'uls-desc',
);

$dir = __DIR__ ;

// Internationalization
$wgExtensionMessagesFiles['UniversalLanguageSelector'] = "$dir/UniversalLanguageSelector.i18n.php";

// Register auto load for the page class
$wgAutoloadClasses['UniversalLanguageSelectorHooks'] = "$dir/UniversalLanguageSelector.hooks.php";

$wgHooks['BeforePageDisplay'][] = 'UniversalLanguageSelectorHooks::addModules';
$wgHooks['PersonalUrls'][] = 'UniversalLanguageSelectorHooks::addTrigger';
$wgHooks['SkinAfterContent'][] = 'UniversalLanguageSelectorHooks::addTemplate';

$wgResourceModules['ext.uls.init'] = array(
	'scripts' => 'resources/ext.uls.init.js',
	'localBasePath' => $dir,
	'remoteExtPath' => 'UniversalLanguageSelector',
	'dependencies' => 'ext.uls.core',
	'position' => 'top',
);

$wgResourceModules['ext.uls.core'] = array(
	'scripts' => array( 'resources/ext.uls.core.js', 'resources/ext.uls.languagefilter.js' ),
	'styles' => 'resources/css/ext.uls.css',
	'localBasePath' => $dir,
	'remoteExtPath' => 'UniversalLanguageSelector',
	'dependencies' => array(
		'mediawiki.util',
		'mediawiki.Uri',
		'jquery.ui.autocomplete'
	),
	'position' => 'top',
);