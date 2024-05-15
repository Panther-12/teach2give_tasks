var modal = document.getElementById('user-modal');
var form = document.getElementById('user-form');
var table = document.querySelector('tbody');

// Add event listener to Add button
document.querySelector('.add-btn').addEventListener('click', function() {
    modal.style.display = 'block';
});


// Add event listener to checkboxes
table.addEventListener('change', function(event) {
    if (event.target.type === 'checkbox') {
        var row = event.target.parentNode.parentNode;
        var actions = row.cells[4].children;

        if (event.target.checked) {
            // Enable actions
            for (var i = 0; i < actions.length; i++) {
                actions[i].style.color = ''; // Original color
            }
        } else {
            // Disable actions
            for (var i = 0; i < actions.length; i++) {
                actions[i].style.color = 'grey';
            }
        }
    }
});

// Initialize actions
for (var i = 0, row; row = table.rows[i]; i++) {
    var checkbox = row.cells[0].children[0];
    var actions = row.cells[4].children;

    if (checkbox.checked) {
        // Enable actions
        for (var j = 0; j < actions.length; j++) {
            actions[j].style.color = ''; // Original color
        }
    } else {
        // Disable actions
        for (var j = 0; j < actions.length; j++) {
            actions[j].style.color = 'grey';
        }
    }
}

var viewModal = document.getElementById('view-modal');

// Add event listener to Edit and Delete icons
table.addEventListener('click', function(event) {
    var row = event.target.parentNode.parentNode;
    var checkbox = row.cells[0].children[0];

    if (event.target.classList.contains('fa-eye')) {
        // View
        var row = event.target.parentNode.parentNode;
        document.getElementById('view-name').innerText = 'Name: ' + row.cells[1].innerText;
        document.getElementById('view-phone').innerText = 'Phone Number: ' + row.cells[2].innerText;
        document.getElementById('view-email').innerText = 'Email: ' + row.cells[3].innerText;
        viewModal.style.display = 'block';
    } else if (event.target.classList.contains('fa-edit')) {
        // Edit
        var row = event.target.parentNode.parentNode;
        var checkbox = row.cells[0].children[0];

        if (checkbox.checked) {
            modal.style.display = 'block';
            document.getElementById('user-id').value = row.id;
            document.getElementById('name').value = row.cells[1].innerText;
            document.getElementById('phone_number').value = row.cells[2].innerText;
            document.getElementById('email').value = row.cells[3].innerText;
            document.getElementById('submit-btn').innerText = 'Update'; // Change button text
        }
    } else if (event.target.classList.contains('fa-trash-alt')) {
        // Delete
        if (checkbox.checked) {
            row.remove();
        }
    }
});

// Add event listener to form
form.addEventListener('submit', function(event) {
    event.preventDefault();

    var userId = document.getElementById('user-id').value;
    var name = document.getElementById('name').value;
    var phone_number = document.getElementById('phone_number').value;
    var email = document.getElementById('email').value;

    if (userId) {
        // Update existing user
        var row = document.getElementById(userId);
        row.cells[1].innerText = name;
        row.cells[2].innerText = phone_number;
        row.cells[3].innerText = email;
    } else {
        // Add new user
        var row = table.insertRow();
        row.insertCell().innerHTML = '<input type="checkbox">';
        row.insertCell().innerHTML = `<img src="../css-challenge/images/user2.png" class="profile-img"> ${name}`;
        row.children[1].classList.add('profile')
        row.insertCell().innerText = phone_number;
        row.insertCell().innerText = email;
        row.insertCell().innerHTML = '<i class="fas fa-eye"></i> <i class="fas fa-edit"></i> <i class="fas fa-trash-alt"></i>';
    }

    // Clear form and hide modal
    document.getElementById('user-id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('phone_number').value = '';
    document.getElementById('email').value = '';
    document.getElementById('submit-btn').innerText = 'Submit'; // Reset button text
    modal.style.display = 'none';
});


// Add event listener to close button
document.querySelector('.close').addEventListener('click', function() {
    modal.style.display = 'none';
});

// Add event listener to close button
document.querySelector('.close-details').addEventListener('click', function() {
    viewModal.style.display = 'none';
});


// Add event listener to window to close modal when clicked outside
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});


// Add event listener to Search button
document.getElementById('search-btn').addEventListener('click', function() {
    var input = document.getElementById('search-input').value.toLowerCase();
    for (var i = 0, row; row = table.rows[i]; i++) {
        var name = row.cells[1].innerText.toLowerCase();
        var email = row.cells[2].innerText.toLowerCase();
        if (name.indexOf(input) > -1 || email.indexOf(input) > -1) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
});