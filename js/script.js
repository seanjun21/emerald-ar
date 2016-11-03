var root = 'https://jsonplaceholder.typicode.com';
var usersHashMap = [];

$(function () {
    // Loading tables
    loadUsers();

    // Proceed to profile-page
    $('.displays').on('click', '#username a', function (event) {
        event.preventDefault();
        var searchTerm = $(this).text();
        getProfile(searchTerm);
        $('.pagination').hide();
        $('.display-panel .home-button').show();
    });

    // Proceed to home-page
    $('.display-panel .home-button').on('click', function (event) {
        usersHashMap = [];
        event.preventDefault();
        loadUsers();
        $('.pagination').show();
    });
});


function loadUsers() {
    $('.display-panel .home-button').hide();
    var usersData;
    var todosData;

    $.when(
        $.get(root + '/users', function (users) {
            usersData = users;
        }),
        $.get(root + '/todos', function (todos) {
            todosData = todos;
        })
    ).then(function () {
        // Build hashmap for users
        $.each(usersData, function (key, value) {
            usersHashMap.push({
                userId: value.id,
                username: value.username,
                name: value.name,
                incomplete: 0,
                complete: 0
            });
        });
        $.each(todosData, function (key, value) {
            $.each(usersHashMap, function (hashKey, hashValue) {
                if (hashValue.userId === value.userId && value.completed === true) {
                    hashValue.complete++;
                } else if (hashValue.userId === value.userId && value.completed === false) {
                    hashValue.incomplete++;
                }
            })
        });

        // Clone template and build display
        $('.displays').html('<table id="users-display" class="tablesorter highlight responsive-table"></table>');
        $('.templates #users-category').clone().appendTo('#users-display');
        $('.displays #users-display').append('<tbody id="users-value"></tbody>');

        $.each(usersHashMap, function (key, value) {
            var userShown = showUser(value.username, value.name, value.incomplete, value.complete);
            $('.displays #users-value').append(userShown);
        });
        $('#users-display').tablesorter();
        // Auto-populate pagination
        pagination();
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

            // Clone template and build display
            $('.displays').html(profileShown).append('<table id="todos-list" class="tablesorter highlight responsive-table"></table>');
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
    var copy = $('.templates .users-row').clone();

    copy.find('#username').html('<a href="">' + username + '</a>');
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
    var copy = $('.templates .todos-row').clone();

    copy.find('.todo-id').text(userId + 1);
    copy.find('.title').text(title);
    copy.find('.completed').text(completed);

    return copy;
}

function pagination() {

    var pagination = $('.pagination');
    pagination.html('');

    var rowsShown = 5;
    var tableRows = $('#users-display').find('tbody tr');
    var rowsTotal = tableRows.length;
    var numPages = rowsTotal / rowsShown;

    for (var i = 0; i < numPages; i++) {
        var pageNum = i + 1;
        if (pageNum === 1) {
            pagination.append('<li class="active numbers"><a href="#!" rel="' + i + '">' + pageNum + '</a></li>');
        } else {
            pagination.append('<li class="waves-effect numbers"><a href="#!" rel="' + i + '">' + pageNum + '</a></li>');
        }
    }
    tableRows.hide();
    tableRows.slice(0, rowsShown).show();

    pagination.on('click', '.numbers a', function () {
        pagination.find('.numbers').removeClass("active").addClass('waves-effect');
        $(this).parent().removeClass('waves-effect').addClass("active");
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;
        tableRows.css('opacity', '0.0').hide().slice(startItem, endItem).css('display', 'table-row').animate({opacity: 1}, 300);
    });
}