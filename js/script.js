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
        $('.displays').html('<table id="display"></table>');
        $('.templates #users-category').clone().appendTo('#display');


        console.log(usersHashMap);


        $.each(usersHashMap, function (key, value) {
            var userShown = showUser(value.username, value.name, value.incomplete, value.complete);
            $('.displays #display').append(userShown);
        })
    });
}

function getProfile(username) {
    var selectedUser = _.filter(usersHashMap, _.matches({'username': username}));

    $.when(
        $.get(root + '/users/' + selectedUser[0].userId, function(data) {
            var profileShown = showProfile(data.name, data.username, data.email, data.address, data.phone, data.website, data.company);
            $('.displays').html(profileShown);
        }),
        $.get(root + '/todos?userId=' + selectedUser[0].userId, function(data) {
            $('.displays').append('<table id="todos-list"></table>');
            $('.templates #todos-category').clone().appendTo('#todos-list');

            $.each(data, function (key, value) {
                var profileShown = showToDos(key, value.title, value.completed);
                $('.displays #todos-list').append(profileShown);
            });
        })
    );
}

function showUser(username, name, incomplete, complete) {
    var copy = $('.templates #users-value').clone();

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
    var copy = $('.templates #todos-value').clone();

    copy.find('.todo-id').text(userId + 1);
    copy.find('.title').text(title);
    copy.find('.completed').text(completed);

    return copy;
}