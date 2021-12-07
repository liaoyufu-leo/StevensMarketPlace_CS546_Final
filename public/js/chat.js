(function ($) {

    init();

})(jQuery);

function init() {
    $.ajax({
        method: 'GET',
        url: "/chat/getAll",
        success: function (responseMessage) {
            responseMessage.chats.forEach(element => {
                $('.users').html($('.users').html() + `
                <li id="${element.users.slice(0, element.users.lastIndexOf('@'))}" class="person" data-chat="${element.users}" onclick="change('${element.users.slice(0, element.users.lastIndexOf('@'))}')">
                    <div class="user">
                        <img src="/images/avatar.png" alt="${element.users}">
                        <span id="${element.users.slice(0, element.users.lastIndexOf('@'))}Status" class="status busy"></span>
                    </div>
                    <p class="name-time">
                        <span class="list-name">${element.users.slice(0, element.users.lastIndexOf('@'))}</span>
                        <span class="time">
                        ${new Date().getDate() == new Date(element.messages[element.messages.length - 1].date).getDate() ?
                        new Date(element.messages[element.messages.length - 1].date).toLocaleTimeString('en-US') :
                        new Date(element.messages[element.messages.length - 1].date).toLocaleString('en-US', { timeZone: 'UTC' })}
                        </span>
                    </p>
                </li>
                `);
            });
            if ($('.active-user').length == 0) {
                reloadChatBox(responseMessage.chats[0]);
            }
        },
        error: function (responseMessage) {
            alert(responseMessage.responseText);
        }
    });
}

function change(account) {
    $.ajax({
        method: 'GET',
        url: "/chat/getOne/"+account+"@stevens.edu",
        success: function (responseMessage) {
            reloadChatBox(responseMessage);
        },
        error: function (responseMessage) {
            alert(responseMessage.responseText);
        }
    });
}

function reloadChatBox(chat) {
    if ($('.active-user').length != 0) {
        $('.active-user').removeClass("active-user");
    }
    $('#' + chat.users.slice(0, chat.users.lastIndexOf('@'))).addClass("active-user");

    $('.name').text(chat.users.slice(0, chat.users.lastIndexOf('@')));
    $('.chat-box').html("")
    chat.messages.forEach(element => {
        if (element.sender == chat.users) {
            $('.chat-box').html($('.chat-box').html() + `
                <li class="chat-left">
                    <div class="chat-avatar">
                        <img src="/images/avatar.png" alt="${element.sender.slice(0, element.sender.lastIndexOf('@'))}">
                        <div class="chat-name">${element.sender.slice(0, element.sender.lastIndexOf('@'))}</div>
                    </div>
                    <div class="chat-text">${element.message}</div>
                    <div class="chat-hour">
                        ${new Date().getDate() == new Date(element.date).getDate() ?
                        new Date(element.date).toLocaleTimeString('en-US') :
                        new Date(element.date).toLocaleString('en-US', { timeZone: 'UTC' })}
                        <span class="fa fa-check-circle"></span>
                    </div>
                </li>
            `);
        } else {
            $('.chat-box').html($('.chat-box').html() + `
            <li class="chat-right">
                <div class="chat-hour">
                    ${new Date().getDate() == new Date(element.date).getDate() ?
                    new Date(element.date).toLocaleTimeString('en-US') :
                    new Date(element.date).toLocaleString('en-US', { timeZone: 'UTC' })}
                    <span class="fa fa-check-circle"></span>
                </div>
                <div class="chat-text">${element.message}</div>
                <div class="chat-avatar">
                    <img src="/images/avatar.png" alt="${element.sender.slice(0, element.sender.lastIndexOf('@'))}">
                    <div class="chat-name">${element.sender.slice(0, element.sender.lastIndexOf('@'))}</div>
                </div>
            </li>
        `);
        }

    });
}