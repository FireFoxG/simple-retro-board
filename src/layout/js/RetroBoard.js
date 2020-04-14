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
    var initSortingButtons = function () {
        $('#sortNewest').click(function (e) {
            getRetroListData(sortEntries, 'sortNewest');
        });
        $('#sortName').click(function (e) {
            getRetroListData(sortEntries, 'sortName');
        });
        $('#sortVotes').click(function (e) {
            getRetroListData(sortEntries, 'sortVotes');
        });
    };
    // todo: add id to every retro meeting to keep track of history and fetch particular retros
    /**
     *
     * @param callback - function to fire with recieved data
     */
    var getRetroListData = function (callback, params) {
        $.ajax(QUERY_URL + '/retro/list', {
            type: 'GET',
            timeout: 1000,
        }).done(function (data) {
            console.log(data);
            if (!params) {
                callback(data);
            }
            else {
                callback(data, params);
            }
        }).fail(function (err) {
            console.error(err);
        });
    };
    /**
     *
     * @param el - $EL
     * @param className - ClassName
     */
    var toggleClass = function (el, className) {
        el.hasClass(className) ? el.removeClass(className) : el.addClass(className);
    };
    /**
     *
     * @param mes - Message
     * @param col - Which column (sad, glad)
     */
    var newMessage = function (mes, col) {
        //
    };
    var sortEntries = function (data, type) {
        var gladArray = [];
        var sadArray = [];
        var GLAD = data[0];
        var SAD = data[1];
        // console.log('REFERENCE', GLAD.pointList)
        if (type == 'sortName') {
            $('#' + type).toggleClass('active');
            $('#sortVotes').removeClass('active');
            $('#sortNewest').removeClass('active');
            if ($('#' + type).hasClass('active')) {
                gladArray = GLAD.pointList.sort();
                sadArray = SAD.pointList.sort();
                GLAD.pointList = gladArray;
                SAD.pointList = sadArray;
            }
            else {
                gladArray = GLAD.pointList.sort();
                sadArray = SAD.pointList.sort();
                gladArray = gladArray.reverse();
                sadArray = sadArray.reverse();
                GLAD.pointList = gladArray;
                SAD.pointList = sadArray;
            }
        }
        else if (type == 'votes') {
        }
        renderRetroList(data);
    };
    /**
     * Just updated user's list with current server data
     */
    var updateAllEntries = function () {
        getRetroListData(renderRetroList, null);
    };
    var renderRetroList = function (data) {
        $('.col-glad').find('ul li').remove();
        $('.col-sad').find('ul li').remove();
        var GLAD = data[0];
        var SAD = data[1];
        GLAD.pointList.map(function (e) {
            $('.col-glad ul').append("<li entryId=" + e.id + ">" + e.message + " - <span>" + e.votes + "</span> likes <i class=\"far fa-heart entry-icon\"></i></li>");
        });
        SAD.pointList.map(function (e) {
            $('.col-sad ul').append("<li entryId=" + e.id + ">" + e.message + "  - <span>" + e.votes + "</span> votes <i class=\"far fa-thumbs-up entry-icon\"></i></li>");
        });
        $('.entry-icon').click(function (e) { return handleUpvote(e); });
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
                // updateAllEntries();
                el.parent().find('span').text(data.votes);
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
                el.parent().find('span').text(data.votes);
                // updateAllEntries();
                el.addClass('far');
                el.removeClass('fas');
            }).fail(function (err) {
                console.error(err);
            });
        }
    };
    var initAddButtons = function () {
        $('.col-button-add').click(function (e) {
            toggleClass($(e.target).parent().find('.input-wrapper'), 'expanded');
        });
    };
    var initLikeButton = function () {
        $('.fas.fa-share').click(function (e) {
            var input = $(e.target).parent().find('input');
            console.log('Submitted:', input.val(), 'for', input.attr('for'));
            input.val('');
        });
    };
    RetroBoard.Init = function () {
        console.log('Init RetroBoard');
        initSortingButtons();
        initAddButtons();
        initLikeButton();
        updateAllEntries();
    };
})(RetroBoard || (RetroBoard = {}));
//# sourceMappingURL=RetroBoard.js.map