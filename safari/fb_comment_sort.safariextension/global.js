$(document).ready(function(){
        var timelinePage = $('body').hasClass('pagesTimelineLayout');
        var photoPage = $('body').hasClass('ego_page'); 
        var sortBullet = '<span class="sort-bullet"> · </span>';
        
        if(timelinePage){
            addSortButton();
        }
        else if(photoPage){
            var fbPhotoPageTimestamp = $('#fbPhotoPageTimestamp').remove();
            addSortButton();  
            $('.UIActionLinks').append(sortBullet, fbPhotoPageTimestamp);
        }
        
        if(timelinePage){
            // ADD "SORT" BUTTON WHEN fbTimelineUnit INSERTED INTO DOM //
            $(document).bind('DOMNodeInserted', function(e) {
                if($(e.target).hasClass('lastCapsule')){
                    addSortButton();
                }
            });
        }

        // "SORT BUTTON" //
        function addSortButton(){
            var postID;
    
            $('.sortButton, .sort-bullet').remove();
            
            // ADD SORT BUTTON //
            $('.UIActionLinks').append('<span class="sortButton"><a title="Sort Comments" href="#"><span id="">Sort</span></a></span>');
            $('.share_action_link').after(sortBullet);
            
            $('.sortButton').bind('click', function(e){
                e.preventDefault();               
                
                if(timelinePage){
                    postID = $(this).parents('div.fbTimelineFeedbackHeader').next('div').find('ul').attr('id');
                }
                else if(photoPage){
                    postID = $(this).parents().next('div').find('ul').attr('id');        
                }
  
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