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

jQuery.noConflict();(function(e){e(document).ready(function(){function a(){function f(){if(!r){e(".sortButton, .sort-bullet").remove();e(".UIActionLinks").append(i,s)}else{e(".share_action_link").after(i,s)}e(".sortButton").bind("click",function(){c(this)});return false}function c(r){if(t){u=e(r).parents("div.fbTimelineFeedbackHeader").next("div").find("ul").attr("id")}else if(n){u=e(r).parents().next("div").find("ul").attr("id")}else{u=e(r).parents().next("div").find("ul").attr("id")}if(o){u=r}var i=document.getElementById(u);h(i)}function h(t){var n=[];var r;var i;var s;var o;var u=e(t).children("li.UFILikeSentence").remove();var a=e(t).children("li.UFILastCommentComponent").remove();var f=e(t).children("li.UFIArrow").remove();var l=e(t).children("li.UFIAddComment").remove();e(t).children("li, ul").each(function(){r=this.id;i=this.outerHTML;s=r.substring(0,r.indexOf("}"));o=s.substr(s.lastIndexOf("_")+1);n.push({id:o,html:i})});n.sort(function(e,t){return e.id-t.id});e(t).children("li,ul").remove();for(var c=0;c<n.length;++c){e(t).append(n[c].html)}e(t).prepend(f,u);e(t).append(a,l)}var u;var a;if(!o){o=false;f()}else{function l(){e(".sortButton, .sort-bullet").remove();document.getElementById("fbPhotoSnowliftFeedback").children[1].innerHTML+=i+s;a=document.getElementsByClassName("sortButton")[0];a.onclick=function(){var e=document.getElementById("fbPhotoSnowliftFeedback").getElementsByClassName("UFIList")[0].id;c(e)}}setTimeout(function(){l()},2e3);e("._n9").bind("click",function(n){if(n.target!==this)return;setTimeout(function(){o=false;t=true;f()},1e3);e("._n9").unbind()});e(".stageWrapper").bind("click",function(){setTimeout(function(){o=true;l()},1e3)});e(document).keyup(function(e){if(e.keyCode==27){f()}})}e(".sortButton").bind("click",function(e){})}var t=e("body").hasClass("pagesTimelineLayout");var n=e("body").hasClass("ego_page");var r=e("body").hasClass("home");var i='<span class="sort-bullet"> · </span>';var s='<span class="sortButton"><a title="Sort Comments" href="#"><span id="">Sort</span></a></span>';var o;if(t){n=false;t=true;a(t);e(document).bind("DOMNodeInserted",function(r){if(e(r.target).hasClass("lastCapsule")){n=false;o=false;t=true;a(t)}})}else if(r){a()}else if(n){n=true;function u(){var t=e("#fbPhotoPageTimestamp").remove();a();e(".sort-bullet").remove();e(".UIActionLinks").append(i,t)}e(document).on("click","a.photoPageNextNav, a.photoPagePrevNav, #fbPhotoImage",function(){setTimeout(function(){u()},1e3)});u()}e(document).bind("DOMNodeInserted",function(r){if(e(r.target).hasClass("fbPhotoSnowlift")){t=false;n=false;o=true;a()}})})})(jQuery)