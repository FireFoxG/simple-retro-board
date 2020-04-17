
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
const SESSION_BUTTON = "data-js-session-selector";
let CURRENT_RETRO_SESSION = '';

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


function initSessionButton() {
    // [BACKEND] TODO: Make a DB to save sessions. Each session has points and their likes


    const buttonHtml =`<button class="side-button" data-js-session-selector>${true}</button>`;

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


function addNewMessage(colId, message, type) {
    console.log('Recieved', e)

    $.ajax(QUERY_URL + `/retro/add?groupId=${colId}&message=${'message'}&type=${type}`, {
        type: 'POST',
        timeout: 1000,
    }).done((data) => {
        console.log('ADDED NEW MESSAGE TO', type, ':', data)


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

function renderParticularSession(sessionId) {
    console.log('Getting particular session', sessionId)
    $.ajax(QUERY_URL + '/retro/list?sessionId='+sessionId, {
        type: 'GET',
    }).done((data) => {
        console.log('All entries from /list/'+sessionId, data)
        let newData = {
            POSITIVE: {},
            NEGATIVE: {}
        };

        data.map( e => {
            if (e.type == 'POSITIVE') {
                newData.POSITIVE['pointList'] = e.pointList
                newData.POSITIVE['id'] = e.id
                newData.POSITIVE['sessionId'] = e.sessionId
            } else {
                newData.NEGATIVE['pointList'] = e.pointList
                newData.NEGATIVE['id'] = e.id
                newData.NEGATIVE['sessionId'] = e.sessionId
            }
        })
        renderRetroList(newData);

    }).fail((err) => {
        console.error(err)
    })
}


function sortEntries(data, type) {

    console.log('FUNCTION SORT DISABLED')

    // let gladArray = [];
    // let sadArray = [];
    // let GLAD = data[0];
    // let SAD = data[1];
    
    // if (type == 'sortName') {
    //     $('#' + type).toggleClass('active');
    //     $('#sortVotes').removeClass('active');
    //     $('#sortNewest').removeClass('active');

    //     if ($('#' + type).hasClass('active')) {
    //         gladArray = GLAD.pointList.sort();
    //         sadArray = SAD.pointList.sort();
    //         GLAD.pointList = gladArray;
    //         SAD.pointList = sadArray;

    //     } else {
    //         gladArray = GLAD.pointList.sort();
    //         sadArray = SAD.pointList.sort();

    //         gladArray = gladArray.reverse();
    //         sadArray = sadArray.reverse();

    //         GLAD.pointList = gladArray;
    //         SAD.pointList = sadArray;

    //     }

    // } else if (type == 'votes') {
    //     // TODO: Make more sorting algorithms for these things
    // }


    // renderRetroList(data);


}


function renderRetroList(data) {
    $('.col-glad').find('ul li').remove();
    $('.col-sad').find('ul li').remove();

console.log('GOT DATA', data)

    let GLAD = data.POSITIVE;
    let SAD = data.NEGATIVE;



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




function makeArrayOfSessions(data) {
    let sessions = {};
    data.map( col => {
        const pointList = col.pointList;
        const sessionId = col.pointList[0].sessionId;
        const colType = col.type
        
        if (!sessions[sessionId]) {
            sessions[sessionId] = {
                'NEGATIVE': [],
                'POSITIVE': [],
            } 
            sessions[sessionId][colType].push(pointList)

            
        } else {
            console.log('Pushing', pointList, 'into', sessionId, colType)
            sessions[sessionId][colType].push(pointList)
        }

    })


    console.log('Returning', sessions)

    
    renderSessionsToSessionPage(sessions);
    return sessions

}

function show($el) {
    $el.removeClass('hidden');
}

function hide($el) {
    $el.addClass('hidden');
}

/**
 * 
 * @param {string} siteName 
 * @param {function} callback 
 * @param {params} callbackParams 
 */
function redirectTo(siteName, callback, callbackParams) {
    
    hide($('.site'));
    show($('.'+siteName));
    callback(callbackParams);
}



function renderSessionsToSessionPage(sessions) {
    $('.session-list').html('')
    for (session in sessions) {
        $('.session-list').append('<button class="session-button">'+ session.toString() +'</button>').click( e => {
            let sessionId = $(e.target).text();
            console.log('Current retro:', sessionId)
            CURRENT_RETRO_SESSION = sessionId;
            localStorage.setItem('CURRENT_RETRO_SESSION', sessionId)
            

            redirectTo('board', renderParticularSession, sessionId);

            // Render new session from here


        })


    }

  
}

function makeSessionsList() {
    let sessions = getRetroListData(makeArrayOfSessions)
}

function newSession(sessionId) {
    console.log('New session:', sessionId)


}

function initInputs(e) {
    $('.col-button-add').click(e => {
        $(e.target).parent().find('.input-wrapper').toggleClass('expanded');
    })

    $('#newSession').click(e=>{
        $(e.target).parent().find('.input-wrapper').toggleClass('expanded');
    })

    $('.depth-input .fas.fa-share').click(e => {
        
    })

    console.log($("#input-session-name").parent().find('.fa-share'))

    $("#input-session-name").parent().find('.fa-share').click( e => {
        e.preventDefault;
        let sessionId = $(e.target).parent().find('input').val();
        newSession(sessionId)
        $(e.target).parent().find('input').val('')
    })



    $("#input-session-name").parent().on('submit', e => {
        e.preventDefault;
        let sessionId = $(e.target).find('input').val();
        newSession(sessionId)
        $(e.target).find('input').val('')
    })

    $("#viewAllSessions").click(e=> {
        redirectTo('session-selection-site', makeSessionsList, null);
    })
    
    $('#sessionName').text('Current session: '+localStorage.getItem('CURRENT_RETRO_SESSION'));
   

}




function Init() {

    

    console.log('Init RetroBoard')
    initFirebase();
    initSortingButtons();
    initInputs();
    initDarkMode();
    // updateAllEntries();

    let current = localStorage.getItem('CURRENT_RETRO_SESSION');
    if (current && current.length > 0) {
        redirectTo('board', renderParticularSession, current)
    } else {
        makeSessionsList();
    }



}
