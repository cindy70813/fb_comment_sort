// ==UserScript==
// @name            Facebook Comment Chronological Sort
// @author          Michael J Scarchilli & Bunnies... lots and lots of bunnies!
// @namespace       http://www.mikevision.com
// @version         2.1
// @description     Sorts individual post comments in chronological order on a Facebook "Page" and photo pages/lightbox photos.
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @include         https://www.facebook.com/*
// @include         http://www.facebook.com/*
// @grant           none
// ==/UserScript==

jQuery.noConflict();

// FOR JQUERY SCRIPTS //
(function($) {
    $(document).ready(function() {
        var timelinePage = $('body').hasClass('pagesTimelineLayout');
        var photoPage = $('body').hasClass('ego_page');
        var otherPage = $('body').hasClass('home');
        var sortBullet = '<span class="sort-bullet"> · </span>';
        var sortButton = '<span class="sortButton"><a title="Sort Comments" href="#"><span id="">Sort</span></a></span>';
        var photoLightBox;

        // TIMELIN PAGE //
        if (timelinePage) {
            photoPage = false;
            timelinePage = true;
            addSortButton(timelinePage);

            // ADD "SORT" BUTTON WHEN fbTimelineUnit INSERTED INTO DOM //
            $(document).bind('DOMNodeInserted', function(e) {
                if ($(e.target).hasClass('lastCapsule')) {
                    photoPage = false;
                    photoLightBox = false;
                    timelinePage = true;
                    addSortButton(timelinePage);
                }
            });
        }
        else if (otherPage) {
            addSortButton();
        }
        else if (photoPage) {
            photoPage = true;
            function loadPhotoSortButton() {
                var fbPhotoPageTimestamp = $('#fbPhotoPageTimestamp').remove();

                addSortButton();
                $('.sort-bullet').remove();
                $('.UIActionLinks').append(sortBullet, fbPhotoPageTimestamp);
            }

            // ON PHOTO PAGE CHANGE ADD SORT BUTTON //
            $(document).on('click', 'a.photoPageNextNav, a.photoPagePrevNav, #fbPhotoImage', function() {
                setTimeout(function() {
                    loadPhotoSortButton();
                }, 1000);
            });

            loadPhotoSortButton();
        }

        // PHOTO LIGHTBOX //
        $(document).bind('DOMNodeInserted', function(e) {
            if ($(e.target).hasClass('fbPhotoSnowlift')) {
                timelinePage = false;
                photoPage = false;
                photoLightBox = true;
                addSortButton();
            }
        });

        // "SORT BUTTON" //
        function addSortButton() {
            var postID;
            var sortButtonClick;

            // ADD SORT BUTTON //
            function addButton() {
                if (!otherPage) {
                    $('.sortButton, .sort-bullet').remove();
                    $('.UIActionLinks').append(sortBullet, sortButton);
                }
                else {
                    $('.share_action_link').after(sortBullet, sortButton);
                }

                $('.sortButton').bind('click', function() {
                    sortButtonAction(this);
                });
                return false;
            }

            if (!photoLightBox) {
                photoLightBox = false;
                addButton();
            }
            // PHOTO LIGHTBOX //
            else {
                function addLikeboxSort() {
                    $('.sortButton, .sort-bullet').remove();
                    document.getElementById('fbPhotoSnowliftFeedback').children[1].innerHTML += sortBullet + sortButton;
                    sortButtonClick = document.getElementsByClassName('sortButton')[0];

                    sortButtonClick.onclick = function() {
                        var lightboxComments = document.getElementById('fbPhotoSnowliftFeedback').getElementsByClassName('UFIList')[0].id;
                        sortButtonAction(lightboxComments);
                    };
                }

                setTimeout(function() {
                    addLikeboxSort();
                }, 2000);

                // CLOSE LIGHTBOX ADD SORT BUTTON BACK TO TIMELINE POSTS //
                $('._n9').bind('click', function(e) {
                    if (e.target !== this)
                        return;
                    setTimeout(function() {
                        photoLightBox = false;
                        timelinePage = true;
                        addButton();
                    }, 1000);
                    $('._n9').unbind();
                });

                $('.stageWrapper').bind('click', function() {
                    setTimeout(function() {
                        photoLightBox = true;
                        addLikeboxSort();
                    }, 1000);
                });

                $(document).keyup(function(e) {
                    if (e.keyCode == 27) {
                        addButton();
                    }
                });
            }

//            $('.share_action_link').after(sortBullet);

            function sortButtonAction(data) {
                if (timelinePage) {
                    postID = $(data).parents('div.fbTimelineFeedbackHeader').next('div').find('ul').attr('id');
                }
                else if (photoPage) {
                    postID = $(data).parents().next('div').find('ul').attr('id');
                }
                else{
                    postID = $(data).parents().next('div').find('ul').attr('id');
                }
                if (photoLightBox) {
                    postID = data;
                }

                var post = document.getElementById(postID);
                sortList(post);
            }

            $('.sortButton').bind('click', function(e) {

            });

            function sortList(post) {
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
                $(post).children('li, ul').each(function() {
                    commentID = (this.id);
                    commentHTML = (this.outerHTML);

                    removePIDend = commentID.substring(0, commentID.indexOf("}"));
                    PID = removePIDend.substr(removePIDend.lastIndexOf('_') + 1);

                    commentArray.push({
                        id: PID,
                        html: commentHTML
                    });
                });

                commentArray.sort(function(a, b) {
                    return a.id - b.id;
                });

                $(post).children('li,ul').remove();
                for (var i = 0; i < commentArray.length; ++i) {
                    $(post).append(commentArray[i].html);
                }

                $(post).prepend(ufiArrow, likeSentence);
                $(post).append(pagerRow, userComment);
            }
        }

        // DOCUMENT READY END //
    });
})(jQuery);