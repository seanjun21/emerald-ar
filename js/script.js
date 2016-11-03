var root = 'https://jsonplaceholder.typicode.com';

var usersHashMap = [];

$(function () {
    // Loading tables
    loadUsers();

    // Proceed to profile-page
    $('.displays').on('click', '#username', function (event) {
        event.preventDefault();
        var searchTerm = $(this).text();
        getProfile(searchTerm);
    });
});

function loadUsers() {
    $.when(
        $.get(root + '/users', function (users) {
            $.each(users, function (key, value) {
                usersHashMap.push({
                    userId: value.id,
                    username: value.username,
                    name: value.name,
                    incomplete: 0,
                    complete: 0
                });
            })
        }),
        $.get(root + '/todos', function (todos) {
            $.each(todos, function (key, value) {
                $.each(usersHashMap, function (hashKey, hashValue) {
                    if (hashValue.userId === value.userId && value.completed === true) {
                        hashValue.complete++;
                    } else if (hashValue.userId === value.userId && value.completed === false) {
                        hashValue.incomplete++;
                    }
                })
            })
        })
    ).then(function () {
        $('.displays').html('<table id="users-display"></table>');
        $('.templates #users-category').clone().appendTo('#users-display');
        $('.displays #users-display').append('<tbody id="users-value"></tbody>');

        $.each(usersHashMap, function (key, value) {
            var userShown = showUser(value.username, value.name, value.incomplete, value.complete);
            $('.displays #users-value').append(userShown);
        })
    });
}

function getProfile(username) {
    var selectedUser = _.filter(usersHashMap, _.matches({'username': username}));
    var userData;
    var todoData;

    $.when(
        $.get(root + '/users/' + selectedUser[0].userId, function (user) {
            userData = user;
        }),
        $.get(root + '/todos?userId=' + selectedUser[0].userId, function (todo) {
            todoData = todo;
        }).then(function () {
            var profileShown = showProfile(userData.name, userData.username, userData.email, userData.address, userData.phone, userData.website, userData.company);
            $('.displays').html(profileShown).append('<table id="todos-list" class="tablesorter"></table>');
            $('.templates #todos-category').clone().appendTo('#todos-list');
            $('.displays #todos-list').append('<tbody id="todos-value"></tbody>');

            $.each(todoData, function (key, value) {
                var profileShown = showToDos(key, value.title, value.completed);
                $('.displays #todos-value').append(profileShown);
            });
            $('#todos-list').tablesorter();
        })
    );
}

function showUser(username, name, incomplete, complete) {
    var copy = $('.templates #users-row').clone();

    copy.find('#username').html('<a href="" target="_blank">' + username + '</a>');
    copy.find('#name').text(name);
    copy.find('#incomplete').text(incomplete);
    copy.find('#complete').text(complete);

    return copy;
}

function showProfile(name, username, email, address, phone, website, company) {
    var copy = $('.templates #user-prop').clone();

    copy.find('.name').text(name);
    copy.find('.username').text(username);
    copy.find('.email').text(email);
    copy.find('.address').html('<div>' + address.street + ' ' + address.suite + '</div><div>' + address.city + ' ' + address.zipcode + '</div>');
    copy.find('.phone').text(phone);
    copy.find('.website').text(website);
    copy.find('.company').html('<div>' + company.name + '</div><div>' + '"' + company.bs + '"' + '</div><div>' + '"' + company.catchPhrase + '"' + '</div>');

    return copy;
}

function showToDos(userId, title, completed) {
    var copy = $('.templates #todos-row').clone();

    copy.find('.todo-id').text(userId + 1);
    copy.find('.title').text(title);
    copy.find('.completed').text(completed);

    return copy;
}