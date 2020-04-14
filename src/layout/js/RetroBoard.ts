"use strict";
$( () => {
    RetroBoard.Init()
})

/**
 * So,
 * 
 * Host (Scrum master) should be able to start a "Retro session". During the session, users are able to post sads and glads and vote. 
 * At the end of session, host "wraps up" the session, saving information and making it accessible in the future (for retrospective retrospective i guess)
 * 
 * 
 */


module RetroBoard {
    const QUERY_URL = 'http://127.0.0.1:8080';



    const initSortingButtons = () => {
        $('#sortNewest').click(e=> {
            getRetroListData(sortEntries, 'sortNewest');
        })
        $('#sortName').click(e=> {
            getRetroListData(sortEntries, 'sortName');
        })
        $('#sortVotes').click(e=> {
            getRetroListData(sortEntries, 'sortVotes');
        })
    }


    // todo: add id to every retro meeting to keep track of history and fetch particular retros
    /**
     * 
     * @param callback - function to fire with recieved data
     */
    const getRetroListData = (callback, params) => { 
        $.ajax(QUERY_URL + '/retro/list', {
            type: 'GET',
            timeout: 1000,
        }).done( (data) => {
            console.log(data)

            if (!params) {
                callback(data);
            } else {
                callback(data, params);
            }
            
        }).fail( (err) => {
            console.error(err)
        })
    } 

    /**
     * 
     * @param el - $EL
     * @param className - ClassName
     */
    const toggleClass = (el, className) => {
        el.hasClass(className) ? el.removeClass(className) : el.addClass(className)
        
    }

    /**
     * 
     * @param mes - Message
     * @param col - Which column (sad, glad)
     */
    const newMessage = (mes, col) => {
        //
    }

    const sortEntries = (data, type) => {
        let gladArray = [];
        let sadArray = [];
        let GLAD =  data[0];
        let SAD =  data[1];
        // console.log('REFERENCE', GLAD.pointList)

        if (type == 'sortName') {
            $('#'+type).toggleClass('active');
            $('#sortVotes').removeClass('active');
            $('#sortNewest').removeClass('active');

            if ($('#'+type).hasClass('active')) {
                gladArray = GLAD.pointList.sort();
                sadArray = SAD.pointList.sort();
                GLAD.pointList = gladArray;
                SAD.pointList = sadArray;

            } else {
                gladArray = GLAD.pointList.sort();
                sadArray = SAD.pointList.sort();

                gladArray = gladArray.reverse();
                sadArray = sadArray.reverse();

                GLAD.pointList = gladArray;
                SAD.pointList = sadArray;

            }
            
        } else if (type == 'votes') {

        }


        renderRetroList(data);
        
    }

    /**
     * Just updated user's list with current server data
     */
    const updateAllEntries = () => {
        getRetroListData(renderRetroList, null);
    }

    const renderRetroList = (data) => {
        $('.col-glad').find('ul li').remove();
        $('.col-sad').find('ul li').remove();


        let GLAD =  data[0];
        let SAD =  data[1];

        GLAD.pointList.map( e => {
            $('.col-glad ul').append(`<li entryId=${e.id}>${e.message} - <span>${e.votes}</span> likes <i class="far fa-heart entry-icon"></i></li>`)
        })
        SAD.pointList.map( e => {
            $('.col-sad ul').append(`<li entryId=${e.id}>${e.message}  - <span>${e.votes}</span> votes <i class="far fa-thumbs-up entry-icon"></i></li>`)
        })
        $('.entry-icon').click(e => handleUpvote(e));
    }

    const handleUpvote = (e) => {
        console.log('Handling upvote for', e.target)
        let id = $(e.target).parent().attr('entryid');
        let username = 'Tester'

        let el = $(e.target)
            if (el.hasClass('far')) {
                // is UNVOTED, so VOTE
        
                $.ajax(QUERY_URL + `/retro/voteup?id=${id}&username=${username}`, {
                    type: 'POST',
                    data: {
                        id,
                        username
                    }
                }).done( (data) => {
                    
                    console.log('DONE UPVOTE:', data)
                    // updateAllEntries();
                    el.parent().find('span').text(data.votes);
                    el.removeClass('far');
                    el.addClass('fas');
                }).fail( (err) => {
                    console.error(err)
                })
       
            } else {
                // is VOTED, so UNVOTE
                
                $.ajax(QUERY_URL + `/retro/votedown?id=${id}&username=${username}`, {
                    type: 'POST',
                    data: {
                        id,
                        username
                    }
                }).done( (data) => {
                    // Recalculate? Update?
                    console.log('DONE DOWNVOTE:', data)
                    el.parent().find('span').text(data.votes);

                    // updateAllEntries();
                    el.addClass('far');
                    el.removeClass('fas');
                }).fail( (err) => {
                    console.error(err)
                })
            }
        
    }


    const initAddButtons = () => {
        $('.col-button-add').click(e => {
            toggleClass($(e.target).parent().find('.input-wrapper'), 'expanded')
    })
    }

    const initLikeButton = () => {
        $('.fas.fa-share').click(e => {
            let input = $(e.target).parent().find('input');
            console.log('Submitted:', input.val(), 'for', input.attr('for'));
            input.val('');
        })
    }


    export const Init = () => {
        console.log('Init RetroBoard')
        initSortingButtons();
        initAddButtons();
        initLikeButton();
        updateAllEntries();

        
            

    }

}