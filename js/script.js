var root = 'https://jsonplaceholder.typicode.com';

var usersHashMap = [];

$(function () {
    loadUsers();
});

function loadUsers() {
    $.when(
        $.get(root + '/users', function (users) {
            $.each(users, function(key, value) {
                usersHashMap.push({
                    username: value.username,
                    name: value.name
                });
            });
        })
    ).then(function () {
        $('.displays').html('<table id="display"></table>');
        $('.templates #category').clone().appendTo('#display');


        console.log(usersHashMap);


        $.each(usersHashMap, function (key, value) {
            var userShown = showUser(value.username, value.name, value.phone, value.website);
            $('.displays #display').append(userShown);
        })
    });
}

function showUser(userID, name, inCompTodos, compTodos) {
    // Clone template
    var copy = $('.templates #value').clone();

    // Set userID
    copy.find('.user-id').text(userID);

    // Set name
    copy.find('.name').text(name);

    // Set # of InComplete ToDos
    copy.find('incomp-todos').text(inCompTodos);

    // Set # of Complete ToDos
    copy.find('comp-todos').text(compTodos);

    return copy;
}