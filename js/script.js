var root = 'https://jsonplaceholder.typicode.com';

var usersHashMap = [];

$(function () {
    loadUsers();
});

function loadUsers() {
    $.when(
        $.get(root + '/users', function (users) {
            $.each(users, function (key, value) {
                usersHashMap.push({
                    userId: value.id,
                    username: value.username,
                    name: value.name,
                    inCompToDos: 0,
                    compToDos: 0
                });
            })
        }),
        $.get(root + '/todos', function (todos) {
            $.each(todos, function (key, value) {
                $.each(usersHashMap, function (hashKey, hashValue) {
                    if (hashValue.userId === value.userId && value.completed === true) {
                        hashValue.compToDos++;
                    } else if (hashValue.userId === value.userId && value.completed === false) {
                        hashValue.inCompToDos++;
                    }
                })
            })

        })
    ).then(function () {
        $('.displays').html('<table id="display"></table>');
        $('.templates #category').clone().appendTo('#display');


        console.log(usersHashMap);


        $.each(usersHashMap, function (key, value) {
            var userShown = showUser(value.username, value.name, value.inCompToDos, value.compToDos);
            $('.displays #display').append(userShown);
        })
    });
}

function showUser(userID, name, inCompToDos, compToDos) {
    // Clone template
    var copy = $('.templates #value').clone();

    // Set userID
    copy.find('.user-id').text(userID);

    // Set name
    copy.find('.name').text(name);

    // Set # of InComplete ToDos
    copy.find('.incomp-todos').text(inCompToDos);

    // Set # of Complete ToDos
    copy.find('.comp-todos').text(compToDos);

    return copy;
}