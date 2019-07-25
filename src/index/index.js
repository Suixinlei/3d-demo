const list = require('./list');

var panel = document.getElementById( 'panel' );
var content = document.getElementById( 'content' );
var panelScrim = document.getElementById( 'panelScrim' );
var iframe = document.querySelector( 'iframe' );

var pageProperties = {};
var titles = {};
var categoryElements = [];

var navigation;

panelScrim.onclick = function ( event ) {

  event.preventDefault();
  panel.classList.toggle( 'open' );

};

// Create the navigation panel and configure the iframe

createNavigation();

// Navigation Panel

function createLink( pageName, pageURL ) {

  var link = document.createElement( 'a' );
  link.href = pageURL;
  link.textContent = pageName;
  link.setAttribute( 'target', 'viewer' );
  link.addEventListener( 'click', function ( event ) {

    if ( event.button !== 0 || event.ctrlKey || event.altKey || event.metaKey ) return;

    window.location.hash = pageURL;
    panel.classList.remove( 'open' );


    content.querySelectorAll( 'a' ).forEach( function ( item ) {

      item.classList.remove( 'selected' );

    } );

    link.classList.add('selected');

  } );

  return link;

}

function createNavigation() {

  if ( navigation !== undefined ) {

    content.removeChild( navigation );

  }

  // Create the navigation panel using data from list.js

  navigation = document.createElement( 'div' );
  content.appendChild( navigation );

  var localList = list;

  for ( var section in localList ) {

    // Create sections

    var categories = localList[ section ];

    var sectionHead = document.createElement( 'h2' );
    sectionHead.textContent = section;
    navigation.appendChild( sectionHead );

    for ( var category in categories ) {

      // Create categories

      var pages = categories[ category ];

      var categoryContainer = document.createElement( 'div' );
      navigation.appendChild( categoryContainer );

      var categoryHead = document.createElement( 'h3' );
      categoryHead.textContent = category;
      categoryContainer.appendChild( categoryHead );

      var categoryContent = document.createElement( 'ul' );
      categoryContainer.appendChild( categoryContent );

      for ( var pageName in pages ) {

        // Create page links

        var pageURL = pages[ pageName ];

        // Localisation

        var listElement = document.createElement( 'li' );
        categoryContent.appendChild( listElement );

        var linkElement = createLink( pageName, pageURL )
        listElement.appendChild( linkElement );

        // Gather the main properties for the current subpage

        pageProperties[ pageName ] = {
          section: section,
          category: category,
          pageURL: pageURL,
          linkElement: linkElement
        };

        // Gather the document titles (used for easy access on browser navigation)

        titles[ pageURL ] = pageName;

      }

      // Gather the category elements for easy access on filtering

      categoryElements.push( categoryContent );

    }

  }

}
