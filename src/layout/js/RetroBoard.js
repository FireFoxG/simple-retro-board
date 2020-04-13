"use strict";
$(function () {
    RetroBoard.Init();
});
/**
 * So,
 *
 * Host (Scrum master) should be able to start a "Retro session". During the session, users are able to post sads and glads and vote.
 * At the end of session, host "wraps up" the session, saving information and making it accessible in the future (for retrospective retrospective i guess)
 *
 *
 */
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
    var toggleClass = function (el, className) {
        el.hasClass(className) ? el.removeClass(className) : el.addClass(className);
    };
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
        updateAllEntries();
        $('.col-button-add').click(function (e) {
            toggleClass($(e.target).parent().find('.input-wrapper'), 'expanded');
        });
        $('.fas.fa-share').click(function (e) {
            var input = $(e.target).parent().find('input');
            console.log('Submitted:', input.val(), 'for', input.attr('for'));
            input.val('');
        });
    };
})(RetroBoard || (RetroBoard = {}));
//# sourceMappingURL=RetroBoard.js.map