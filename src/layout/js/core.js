
$(document).ready(() => {
    console.log('Init RetroBoard v 0.0.1')


    $('#test').click( e => {
        console.log(e.target)

        $.ajax('http://127.0.0.1:8080/retro/list', {
            type: 'GET',
            timeout: 300,
        
        }).done( (data) => {
            console.log(data)
        }).fail( (err) => {
            console.error(err)
        })
    })
})