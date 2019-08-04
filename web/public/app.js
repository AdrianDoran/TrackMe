$('#navbar').load('navbar.html');
$('#footer').load('footer.html');

const API_URL = 'http://localhost:5000/api';
const currentUser = localStorage.getItem('user');

if (currentUser) {
    $.get(`${API_URL}/users/${currentUser}/devices`)
        .then(response => {
            response.forEach((device) => {
                $('#devices tbody').append(`
                    <tr data-device-id=${device._id}>
                        <td>${device.user}</td>
                        <td>${device.name}</td>
                    </tr>`
                );
            });
            $('#devices tbody tr').on('click', (e) => {
                const deviceId = e.currentTarget.getAttribute('data-device-id');
                $.get(`${API_URL}/devices/${deviceId}/device-history`)
                .then(response => {
                    response.map(sensorData => {
                        $('#historyContent').append(`
                            <tr>
                                <td>${sensorData.ts}</td>
                                <td>${sensorData.temp}</td>
                                <td>${sensorData.loc.lat}</td>
                                <td>${sensorData.loc.lon}</td>
                            </tr>`
                        );
                    });
                    $('#historyModal').modal('show');
                });
            });
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        });
    }
else {
    const path = window.location.pathname;
    if (path !== '/login') {
        location.href = '/login';
    }
}

const devices = JSON.parse(localStorage.getItem('devices')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];

$('#add-device').on('click', () => {
    const user = $('#user').val();
    const name = $('#name').val();
    const sensorData = [];
    const body = {name, user, sensorData};
    $.post(`${API_URL}/devices`, body)
        .then(response => {
            location.href = '/';
        })
        .catch(error => {
            console.error('Error: ${error}');
        });
});

users.forEach( user => {
    $('#users tbody').append(`
        <tr>
        <td>${user.user}</td>
        <td>${user.password}</td>
        <td>${user.confirm_password}</td>
        </tr>`
    );
});

$('#register').on('click', () => {
    const user = $('#username').val();
    const password = $('#password').val();
    const confirm_password = $('#confirm_password').val();
    if (password !== confirm_password) 
    { 
        $("#message").append('<p class="alert alert-warning">Password Confirmation Failed<button type="button" class="close" data-dismiss="alert">&times</button></p>'); 
    }
    else { 
        $.post(`${API_URL}/registration`, { name: user, password })
        .then((response) => {
            if (response.success) {
                location.href = '/login';
            }
            else {
                $('#message').append(`<p class="alert alert-danger">${response}<button type="button" class="close" data-dismiss="alert">&times</button></p>`);
            }
        }) 
    }
});

$('#login').on('click', () => {
    const user = $('#username').val();
    const password = $('#password').val();
    $.post(`${API_URL}/authenticate`, { name: user, password })
    .then((response) => {
        if (response.success) {
            localStorage.setItem('user', user);
            localStorage.setItem('isAdmin', response.isAdmin);
            location.href = '/';
        } else {
            $('#message').append(`<p class="alert alert-danger">${response}<button type="button" class="close" data-dismiss="alert">&times</button></p>`);
        }
    });
});

const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    location.href = '/login';
}

$('#send-command').on('click', function () {
    const command = $('#command').val();
    console.log(`command is: ${command}`);
});

/** OUTDATED CODE BELOW, USE FOR REFERENCE ONLY */

// $('#register').on('click', () => {
//     const user = $('#username').val();
//     const password = $('#password').val();
//     const confirm_password = $('#confirm_password').val();
//     const exists = users.find(user => user.user === username);
//     if (exists !== user && password === confirm_password) {
//         users.push({ user, password, confirm_password });
//         localStorage.setItem('users', JSON.stringify(users));
//         location.href = 'login.html';
//     }
//     else if (password !== confirm_password) {
//         $("#message").append('<p class="alert alert-warning">Password Confirmation Failed<button type="button" class="close" data-dismiss="alert">&times</button></p>');
//     }
//     else {
//         $("#message").append('<p class="alert alert-danger">User Already exists<button type="button" class="close" data-dismiss="alert">&times</button></p>');
//     }
// });

// $('#login').on('click', () => {
//     const username = $('#username').val();
//     const password = $('#password').val();
//     const exists = users.find(user => user.username === username);
//     if (exists.username === username)
//     {
//         if(exists.password === password) 
//         {
//             localStorage.setItem('isAuthenticated', true);
//             location.href = '/';
//         }
//         else {
//             $("#message").append('<p class="alert alert-danger">Login Attempt Failed<button type="button" class="close" data-dismiss="alert">&times</button></p>');
//         }
//     }
//     else {
//         $("#message").append('<p class="alert alert-danger">User does not exist!<button type="button" class="close" data-dismiss="alert">&times</button></p>');
//     }
// });
// const response = $.get(`${API_URL}/devices`)
//     .then(response => {
//         response.forEach(device => {
//             $('#devices tbody').append(`
//                 <tr>
//                     <td>${device.user}</td>
//                     <td>${device.name}</td>
//                 </tr>`
//             );
//         });
//     })
//     .catch(error => {
//         console.error('Error: ${error}');
//     });
