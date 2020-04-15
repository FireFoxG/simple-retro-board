
/**
 * So, 
 * 
 * Host (Scrum master) should be able to start a "Retro session". During the session, users are able to post sads and glads and vote. 
 * At the end of session, host "wraps up" the session, saving information and making it accessible in the future (for retrospective retrospective i guess)
 * 
 * 
 * 
 * TODO: 
 * - Add message
 * - Start Session (DB connection)
 * - authenticate and display authenticated
 * 
 * 
 */

$(document).ready(e => {
    Init();
})


const QUERY_URL = 'http://127.0.0.1:8080';


function initFirebase() {


    let firebaseConfig = {
        apiKey: "AIzaSyDDxkEVQhrkdfCmataRqzyf5JEoprSrhTc",
        authDomain: "wcms-retro.firebaseapp.com",
        databaseURL: "https://wcms-retro.firebaseio.com",
        projectId: "wcms-retro",
        storageBucket: "wcms-retro.appspot.com",
        messagingSenderId: "735543467963",
        appId: "1:735543467963:web:7045af6b9397aae8552e9e"
    };
    firebase.initializeApp(firebaseConfig);

    let provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('User is signed in')

            $('#login').addClass('hidden');
            $('#logout').removeClass('hidden')
            $('body').removeClass('hidden');
        } else {
            console.log('User is signed off, hiding stuff')

            onlyWcmsPeopleInit()
            $('#login').removeClass('hidden');
            $('#logout').addClass('hidden')
        }
    });

    $('#login').on('click', e => {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(function () {
                return firebase.auth().signInWithPopup(provider).then(function (result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    let token = result.credential.accessToken;

                    console.log('Passed auth, result:', result)
                    console.log('New user:', result.user.email)

                    location.reload(true);


                }).catch(function (error) {
                    console.error(error)
                });
            })
            .catch(function (error) {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
            });
    })

    $('#logout').on('click', e => {
        firebase.auth().signOut().then(function () {
            console.log('Signout successful')
            location.reload(true);
        }).catch(function (error) {
            console.error(error)
        });
    })



}

function onlyWcmsPeopleInit() {
    $('.page').remove();
    $('body').append('<h1 id="logout-notice">Please login, ok? Any email for now.</h1>');
}






function initDarkMode() {

    let el = $('#darkModeSwitch');
    let label = el.find('span');

    if (localStorage.getItem('darkMode') == 'true') {
        !$('body').hasClass('dark') ? $('body').addClass('dark') : null;
    }
    el.click(e => {
        el.toggleClass('active');
        toggleDarkMode();
    });
    localStorage.getItem('darkMode') == 'true' ? label.text('ON') : label.text('OFF');

}


function addNewMessage() {

    $.ajax(QUERY_URL + `/retro/add?groupId=3&message=weirdflexbutok&type=positive`, {
        type: 'POST',
        timeout: 1000,
    }).done((data) => {
        console.log(data)



    }).fail((err) => {
        console.error(err)
    })

}


function toggleDarkMode() {

    let el = $('#darkModeSwitch');
    let label = el.find('span');
    $('body').toggleClass('dark');
    if (localStorage.getItem('darkMode') == 'false') {
        localStorage.setItem('darkMode', 'true')
    } else {
        localStorage.setItem('darkMode', 'false')

    }
    localStorage.getItem('darkMode') == 'true' ? label.text('ON') : label.text('OFF');


}


function initSortingButtons() {

    $('#sortNewest').click(e => {
        getRetroListData(sortEntries, 'sortNewest');
    })
    $('#sortName').click(e => {
        getRetroListData(sortEntries, 'sortName');
    })
    $('#sortVotes').click(e => {
        getRetroListData(sortEntries, 'sortVotes');
    })

}

// todo: add id to every retro meeting to keep track of history and fetch particular retros
/**
 * 
 * @param callback - function to fire with recieved data
 */

function getRetroListData(callback, params) {

    $.ajax(QUERY_URL + '/retro/list', {
        type: 'GET',
        timeout: 1000,
    }).done((data) => {
        console.log('All entries from /list', data)

        if (!params) {
            callback(data);
        } else {
            callback(data, params);
        }

    }).fail((err) => {
        console.error(err)
    })

}


function sortEntries(data, type) {

    let gladArray = [];
    let sadArray = [];
    let GLAD = data[0];
    let SAD = data[1];
    
    if (type == 'sortName') {
        $('#' + type).toggleClass('active');
        $('#sortVotes').removeClass('active');
        $('#sortNewest').removeClass('active');

        if ($('#' + type).hasClass('active')) {
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
        // TODO: Make more sorting algorithms for these things
    }


    renderRetroList(data);


}

/**
 * Just updated user's list with current server data
 */
function updateAllEntries() {
    getRetroListData(renderRetroList, null);

}

function renderRetroList(data) {
    $('.col-glad').find('ul li').remove();
    $('.col-sad').find('ul li').remove();


    let GLAD = data[0];
    let SAD = data[1];



    GLAD.pointList.map(e => {
        $('.col-glad ul').append(`<li entryId=${e.id}>${e.message} - <span>${e.votes}</span> likes <i class="far fa-heart entry-icon"></i></li>`)
    })
    SAD.pointList.map(e => {
        $('.col-sad ul').append(`<li entryId=${e.id}>${e.message}  - <span>${e.votes}</span> votes <i class="far fa-thumbs-up entry-icon"></i></li>`)
    })
    $('.entry-icon').click(e => handleUpvote(e));
}


function handleUpvote(e) {

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
        }).done((data) => {

            console.log('DONE UPVOTE:', data)
            // updateAllEntries();
            el.parent().find('span').text(data.votes);
            el.removeClass('far');
            el.addClass('fas');
        }).fail((err) => {
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
        }).done((data) => {
            // Recalculate? Update?
            console.log('DONE DOWNVOTE:', data)
            el.parent().find('span').text(data.votes);

            // updateAllEntries();
            el.addClass('far');
            el.removeClass('fas');
        }).fail((err) => {
            console.error(err)
        })
    }


}


function initAddButtons(e) {
    $('.col-button-add').click(e => {
        $(e.target).parent().find('.input-wrapper').toggleClass('expanded');
    })
}

function initLikeButton() {
    $('.fas.fa-share').click(e => {
        let input = $(e.target).parent().find('input');
        console.log('Submitted:', input.val(), 'for', input.attr('for'));
        input.val('');
    })
    // TODO: Save if user has voted for point, so that likes are persistently shown
}


function Init() {

    

    console.log('Init RetroBoard')
    initFirebase();
    initSortingButtons();
    initAddButtons();
    initLikeButton();
    initDarkMode();
    updateAllEntries();

}
