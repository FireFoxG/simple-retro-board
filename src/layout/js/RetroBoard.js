"use strict";
$(function () {
    RetroBoard.Init();
});
var RetroBoard;
(function (RetroBoard) {
    var QUERY_URL = 'http://127.0.0.1:8080';
    // todo: add id to every retro meeting to keep track of history and fetch particular retros
    var getRetroListData = function (callback) {
        $.ajax(QUERY_URL + '/retro/list', {
            type: 'GET',
            timeout: 1000,
        }).done(function (data) {
            callback(data);
        }).fail(function (err) {
            console.error(err);
        });
    };
    // Will be refined at some point 
    var updateAllEntries = function () {
        getRetroListData(renderRetroList);
    };
    var renderRetroList = function (data) {
        $('.col-glad').find('ul li').remove();
        $('.col-sad').find('ul li').remove();
        var GLAD = data[0];
        var SAD = data[1];
        GLAD.pointList.map(function (e) {
            $('.col-glad ul').append("<li entryId=" + e.id + ">" + e.message + " - <span>" + e.votes + " likes</span><i class=\"far fa-thumbs-up\"></i></li>");
        });
        SAD.pointList.map(function (e) {
            $('.col-sad ul').append("<li entryId=" + e.id + ">" + e.message + "  - <span>" + e.votes + " likes</span><i class=\"far fa-thumbs-up\"></i></li>");
        });
        $('.fa-thumbs-up').click(function (e) { return handleUpvote(e); });
    };
    var handleUpvote = function (e) {
        console.log('Handling upvote for', e.target);
        var id = $(e.target).parent().attr('entryid');
        var username = 'Tester';
        var el = $(e.target);
        if (el.hasClass('far')) {
            // is UNVOTED, so VOTE
            $.ajax(QUERY_URL + ("/retro/voteup?id=" + id + "&username=" + username), {
                type: 'POST',
                data: {
                    id: id,
                    username: username
                }
            }).done(function (data) {
                console.log('DONE UPVOTE:', data);
                updateAllEntries();
                el.removeClass('far');
                el.addClass('fas');
            }).fail(function (err) {
                console.error(err);
            });
        }
        else {
            // is VOTED, so UNVOTE
            $.ajax(QUERY_URL + ("/retro/votedown?id=" + id + "&username=" + username), {
                type: 'POST',
                data: {
                    id: id,
                    username: username
                }
            }).done(function (data) {
                // Recalculate? Update?
                console.log('DONE DOWNVOTE:', data);
                updateAllEntries();
                el.addClass('far');
                el.removeClass('fas');
            }).fail(function (err) {
                console.error(err);
            });
        }
    };
    RetroBoard.Init = function () {
        console.log('Init RetroBoard');
        getRetroListData(renderRetroList);
        console.log($('.fa-thumbs-up'));
    };
})(RetroBoard || (RetroBoard = {}));
//# sourceMappingURL=RetroBoard.js.map