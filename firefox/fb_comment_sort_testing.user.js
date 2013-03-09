// ==UserScript==
// @name            Facebook Comment Chronological Sort
// @author          Michael J Scarchilli & Bunnies... lots and lots of bunnies!
// @namespace       http://www.mikevision.com
// @version         2.0
// @description     Sorts individual post comments in chronological order on a Facebook "Page" and photo pages/lightbox photos.
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @include         https://www.facebook.com/*
// @include         http://www.facebook.com/*
// @grant           none
// ==/UserScript==

jQuery.noConflict();
    
// FOR JQUERY SCRIPTS //
(function($){

    $(document).ready(function(){
	var timelinePage = $('body').hasClass('pagesTimelineLayout');
	var photoPage = $('body').hasClass('ego_page'); 
	var sortBullet = '<span class="sort-bullet"> &middot; </span>';
	var sortButton = '<span class="sortButton"><a title="Sort Comments" href="#"><span id="">Sort</span></a></span>';
	var photoLightBox;
        
	if(timelinePage){
	    addSortButton();
	    
	    // ADD "SORT" BUTTON WHEN fbTimelineUnit INSERTED INTO DOM //
	    $(document).bind('DOMNodeInserted', function(e) {
		if($(e.target).hasClass('lastCapsule')){
		    addSortButton();	    
		}
	    });
	}
	else if(photoPage){	 
	    function loadPhotoSortButton(){
		var fbPhotoPageTimestamp = $('#fbPhotoPageTimestamp').remove();
		$('.UIActionLinks').append(sortBullet);
		addSortButton();
		$('.UIActionLinks').append(sortBullet, fbPhotoPageTimestamp);
		 
	    }
	    
	    // ON PHOTO PAGE CHANGE ADD SORT BUTTON //
	    $(document).on('click', 'a.photoPageNextNav, a.photoPagePrevNav, #fbPhotoImage', function() { 
		loadPhotoSortButton();
		console.log('click');
	    });
	    
	    loadPhotoSortButton();    
	}
	
	$(document).bind('DOMNodeInserted', function(e) {
	    if($(e.target).hasClass('fbPhotoSnowlift')){
		photoPage = false;
		photoLightBox = true;
		addSortButton();	
	    }
	});

	// "SORT BUTTON" //
	function addSortButton(){
	    var postID;
	    var sortButtonClick;
	        
	    $('.sortButton, .sort-bullet').remove();
	    // ADD SORT BUTTON //
	    if(!photoLightBox){
		$('.UIActionLinks').append(sortButton);
	    }
	    else{
		setTimeout(function(){
		    document.getElementById('fbPhotoSnowliftFeedback').children[1].innerHTML += sortBullet + sortButton;
		    sortButtonClick = document.getElementsByClassName('sortButton')[0];
		    sortButtonClick.onclick=function(){
			sortButtonAction(this);
		    };
		},2000);		
	    }
	    
	    $('.share_action_link').after(sortBullet);
	    
	    sortButtonClick = document.getElementsByClassName('sortButton')[0];
	    
	    sortButtonClick.onclick=function(){
		sortButtonAction(this)
	    };
	    
	    function sortButtonAction(data){

		if(timelinePage){
		    alert(data);
		    postID = $(this).parents('div.fbTimelineFeedbackHeader').next('div').find('ul').attr('id');
		}
		else if(photoPage){
		    postID = $(this).parents().next('div').find('ul').attr('id');        		    
		}
		if(photoLightBox) {
		    postID = $(this).parents().next('div').find('ul').attr('id');   		        		    
		}
  
		var post = document.getElementById(postID);
		sortList(post);
	    }
	    
            
	    $('.sortButton').bind('click', function(e){
		
		});

	    function sortList(post){
		var commentArray = [];
		var commentID;
		var commentHTML;	
		var removePIDend;
		var PID;	
		var likeSentence = $(post).children('li.UFILikeSentence').remove();	
		var pagerRow = $(post).children('li.UFILastCommentComponent').remove();	
		var ufiArrow = $(post).children('li.UFIArrow').remove();	
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
		for( var i = 0 ; i < commentArray.length ; ++i){
		    $(post).append(commentArray[i].html);
		}
                
		$(post).prepend(ufiArrow, likeSentence);
		$(post).append(pagerRow, userComment);
	    }
	}       

    // DOCUMENT READY END //
    });
})(jQuery);