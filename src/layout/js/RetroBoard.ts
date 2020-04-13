"use strict";
$( () => {
    RetroBoard.Init()
})


module RetroBoard {
    const QUERY_URL = 'http://127.0.0.1:8080'

    // todo: add id to every retro meeting to keep track of history and fetch particular retros

    const getRetroListData = (callback) => { 

        $.ajax(QUERY_URL + '/retro/list', {
            type: 'GET',
            timeout: 1000,
        }).done( (data) => {
            callback(data);
        }).fail( (err) => {
            console.error(err)
        })
    } 

    // Will be refined at some point

    const updateAllEntries = () => {
        getRetroListData(renderRetroList);
    }

    const renderRetroList = (data) => {
        $('.col-glad').find('ul li').remove();
        $('.col-sad').find('ul li').remove();


        let GLAD =  data[0];
        let SAD =  data[1];

        GLAD.pointList.map( e => {
            $('.col-glad ul').append(`<li entryId=${e.id}>${e.message} - <span>${e.votes} likes</span><i class="far fa-thumbs-up"></i></li>`)
        })
        SAD.pointList.map( e => {
            $('.col-sad ul').append(`<li entryId=${e.id}>${e.message}  - <span>${e.votes} likes</span><i class="far fa-thumbs-up"></i></li>`)
        })
        $('.fa-thumbs-up').click(e => handleUpvote(e));
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
                    updateAllEntries();
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
                    updateAllEntries();
                    el.addClass('far');
                    el.removeClass('fas');
                }).fail( (err) => {
                    console.error(err)
                })
            }
        
    }


    export const Init = () => {
        console.log('Init RetroBoard')
        getRetroListData(renderRetroList)
        console.log($('.fa-thumbs-up'))
        

    }

}