// ==UserScript==
// @name			Facebook Comment Chronological Sort
// @author			Michael J Scarchilli & Bunnies... lots and lots of bunnies!
// @namespace                   http://www.mikevision.com
// @version			1.4
// @description                 Sorts individual post comments in chronological order on a Facebook "Page".
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @include			https://www.facebook.com/*
// @include			http://www.facebook.com/*
// @grant			none
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement('script');
    script.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
    script.addEventListener('load', function() {
	var script = document.createElement('script');
	script.textContent = '(' + callback.toString() + ')();';
	document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

addJQuery(main);

function main() {   
    // DISABLE THE $ GLOBAL ALIAS (MOOTOOLS CONFLICT) //
    jQuery.noConflict();
    
    // FOR JQUERY SCRIPTS //
    (function($){
	
	$(document).ready(function(){	  
	    if($('body').hasClass('pagesTimelineLayout')){
		addSortButton();     	         
	    }
	    
	    // "SORT BUTTON" //
	    function addSortButton(){	 
		$('.sortButton').remove();
		
		// ADD SORT BUTTON //	
		$('.UIActionLinks').append('<span class="sortButton"> · <a title="Sort Comments" href="#"><span id="">Sort</span></a></span>');
	    
		$('.sortButton').bind('click', function(e){
		    e.preventDefault();
		    var postID = $(this).parents('div.fbTimelineFeedbackHeader').next('div').find('ul').attr('id');
		    var post = document.getElementById(postID);
		    sortList(post);
		});
	    
		function sortList(post){
		    var commentArray = [];
		    var commentID;
		    var commentHTML;		
		    var removePIDend;
		    var PID;		
		    var likeSentence = $(post).children('li.UFILikeSentence').remove();		
		    var pagerRow = $(post).children('li.UFIPagerRow').remove();		
		    var userComment = $(post).children('li.UFIAddComment').remove();		
		
		    // GET LI ID'S // 
		    $(post).children('li, ul').each(function(){
			commentID = (this.id);
			commentHTML = (this.outerHTML);
		    
			removePIDend = commentID.substring(0, commentID.indexOf("}"));
			PID = removePIDend.substr(removePIDend.lastIndexOf('_')+1);
		    
			commentArray.push({
			    id:PID, 
			    html:commentHTML
			});   
		    });
		
		    commentArray.sort(function(a,b){
			return a.id-b.id;
		    });
		
		    $(post).children('li,ul').remove();
		    for( var i =  0 ; i < commentArray.length ; ++i){
			$(post).append(commentArray[i].html);
		    }
		    $(likeSentence).prependTo(post);
		    $(pagerRow).appendTo(post);
		    $(userComment).appendTo(post);
		}
	    }
		
	    // ADD "SORT" BUTTON WHEN fbTimelineUnit INSERTED INTO DOM //
	    $(document).bind('DOMNodeInserted', function(e) {
		if($(e.target).hasClass('lastCapsule')){
		    addSortButton();
		}
	    });
		
	// DOCUMENT READY END //
	});
    })(jQuery);
}