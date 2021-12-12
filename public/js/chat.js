function chatBox(event) {
    event.preventDefault();
    $('main').html(`
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
        <div class="container border border-2">
            <!-- Content wrapper start -->
            <div class="content-wrapper">

                <!-- Row start -->
                <div class="row gutters">

                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">

                        <div class="m-0">

                            <!-- Row start -->
                            <div class="row no-gutters">
                                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                                    <div class="users-container">
                                        <div class="chat-search-box">
                                            <div class="input-group">
                                                <input class="form-control" placeholder="Search" list="accountList" id="accountSearch">
                                                <datalist id="accountList">
	                                            </datalist>
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-info">
                                                        <i class="fa fa-search"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <ul class="users">

                                        </ul>
                                    </div>
                                </div>
                                <div class="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                                    <div class="selected-user">
                                        <span>To: <span class="name"></span></span>
                                    </div>


                                    <div class="chat-container ">
                                        <div class="overflow-auto border" style="max-height: 60vh; height:60vh;">
                                            <ul class="chat-box chatContainerScroll">
                                            </ul>
                                        </div>

                                        <div class="form-group mt-3 mb-0">
                                            <form id="send">
                                                <textarea id="messageContent" class="form-control" rows="3"
                                                    placeholder="Type your message here..."></textarea>
                                                <button class="btn btn-success mt-2" type="submit" onclick="sendMessage(event)">Send</button>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Row end -->
                        </div>

                    </div>

                </div>
                <!-- Row end -->

            </div>
            <!-- Content wrapper end -->

        </div>
    `);

    $.ajax({
        method: 'GET',
        url: "/chat/getAll",
        success: function (responseMessage) {
            responseMessage.chats.forEach(element => {
                $('.users').html($('.users').html() + `
                <li id="${element.users.slice(0, element.users.lastIndexOf('@'))}" class="person" data-chat="${element.users}" onclick="changeChatAim('${element.users.slice(0, element.users.lastIndexOf('@'))}')">
                    <div class="user">
                        <img src="/images/avatar.png" alt="${element.users}">
                        <span id="${element.users.slice(0, element.users.lastIndexOf('@'))}Status" class="status busy"></span>
                    </div>
                    <p class="name-time">
                        <span class="list-name">${element.users.slice(0, element.users.lastIndexOf('@'))}</span>
                        <span class="time">
                        ${new Date().getDate() == new Date(element.messages[element.messages.length - 1].date).getDate() ?
                        new Date(element.messages[element.messages.length - 1].date).toLocaleTimeString('en-US') :
                        new Date(element.messages[element.messages.length - 1].date).toLocaleString('en-US', { timeZone: 'EST' })}
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

    let eventSource = null, value = '';
    document.getElementById('accountSearch').addEventListener('keydown', (e) => {
        eventSource = e.key ? 'input' : 'list';
    });

    document.getElementById('accountSearch').addEventListener('input', (e) => {
        value = e.target.value;
        if (eventSource === 'list') {
            let account = value.slice(0, value.lastIndexOf('@'));

            if ($('#' + account).length == 0) {
                createChat(account);
            } else {
                changeChatAim(account);
            }
            $('#accountSearch').val("");
        }
    });

    $('#accountSearch').keyup((event) => {
        if ($('#accountSearch').val() == '') {
            return;
        }
        $.ajax({
            method: 'GET',
            url: "/user/search/" + $('#accountSearch').val(),
            success: function (responseMessage) {
                $('#accountList').html("");
                if (responseMessage.length != 0) {
                    responseMessage.forEach(element => {
                        $('#accountList').html($('#accountList').html() + `
                            <option value="${element.account}"></option>
                        `);
                    });
                } else {
                    $('#accountList').html(`<option value="${$('#accountSearch').val()}">Sorry we didn't find it!</option>`);
                }
            },
            error: function (responseMessage) {
                alert(responseMessage.responseText);
            }
        });

    });
}

function createChat(account) {
    $('.users').html(`
        <li id="${account}" class="person" data-chat="${account}" onclick="changeChatAim('${account}')">
            <div class="user">
                <img src="/images/avatar.png" alt="${account}">
                <span id="${account}Status" class="status busy"></span>
            </div>
            <p class="name-time">
                <span class="list-name">${account}</span>
                <span class="time"> ${new Date().toLocaleTimeString()} Today</span>
            </p>
        </li>
    ` + $('.users').html());

    reloadChatBox({ "users": account + "@stevens.edu", "messages": [] })
}

function changeChatAim(account) {
    $.ajax({
        method: 'GET',
        url: "/chat/getOne/" + account + "@stevens.edu",
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
                    new Date(element.date).toLocaleTimeString('en-US') + " Today" :
                    new Date(element.date).toLocaleString('en-US', { timeZone: 'EST' })}
                    </div>
                </li>
            `);
        } else {
            $('.chat-box').html($('.chat-box').html() + `
            <li class="chat-right">
                <div class="chat-hour">
                    ${new Date().getDate() == new Date(element.date).getDate() ?
                    new Date(element.date).toLocaleTimeString('en-US') + " Today" :
                    new Date(element.date).toLocaleString('en-US', { timeZone: 'EST' })}
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

function sendMessage(event) {
    event.preventDefault();
    alert($('.active-user').attr('id'));
}