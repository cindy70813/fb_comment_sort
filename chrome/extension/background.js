$(document).ready(function(){
    if ($('body').hasClass('pagesTimelineLayout')){
        addSortButton();  
    
        // ADD "SORT" BUTTON WHEN fbTimelineUnit INSERTED INTO DOM //
        $(document).bind('DOMNodeInserted', function(e) {
            if($(e.target).hasClass('lastCapsule')){
                addSortButton();
            }
        });
    
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
    }
});