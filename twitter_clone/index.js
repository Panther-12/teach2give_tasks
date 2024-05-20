const userSelect = document.getElementById('userSelect');
const postsContainer = document.getElementById('postsContainer');
const commentsContainer = document.getElementById('commentsContainer');
const searchInput = document.getElementById('searchInput');

const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAddress = document.getElementById('userAddress');

let allPosts = [];
let allComments = [];

// Fetch users and populate the select box
fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(users => {
        localStorage.setItem("users", JSON.stringify(users));
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            userSelect.appendChild(option);
        });
        userSelect.value = 1;
        localStorage.setItem("userId", 1);
        fetchUserDetails(1);
        fetchPosts(1);
    });

userSelect.addEventListener('change', (event) => {
    const userId = event.target.value;
    localStorage.setItem("userId", userId);
    fetchUserDetails(userId);
    fetchPosts(userId);
});

searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    filterContent(query);
});

function fetchUserDetails(userId) {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            userName.textContent = user.username;
            userEmail.textContent = user.email;
            userAddress.textContent = `${user.address.street}, ${user.address.city}`;
        });
}

function fetchPosts(userId) {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .then(response => response.json())
        .then(posts => {
            allPosts = posts;
            displayPosts(posts);
            fetchComments(posts[0].id);
        });
}

function fetchComments(postId) {
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then(response => response.json())
        .then(comments => {
            allComments = comments;
            displayComments(comments);
        });
}

function displayPosts(posts) {
    const user  = JSON.parse(localStorage.getItem("users"))[localStorage.getItem("userId")-1]
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <div class="post-header">
                <small class="username">${user.name}</small>
                <i class="fas fa-check-circle verified-icon"></i>
                <i class="fab fa-twitter twitter-icon"></i>
            </div>
            <div class="top-wrapper">
                <img src="https://plus.unsplash.com/premium_photo-1707932485795-1d0aed727376?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHx8" alt="Profile Image" class="post-image">
                <h2>${post.title}</h2>
            </div>
            <p>${post.body}</p>`;
        postDiv.addEventListener('click', () => fetchComments(post.id));
        postsContainer.appendChild(postDiv);
    });
}

function displayComments(comments) {
    commentsContainer.innerHTML = '';
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <h3>${comment.name}</h3>
            <p>${comment.body}</p>
            <div class="comment-icons">
                <div><i class="far fa-comment" style="color:orange;"></i><span>12</span></div>
                <div><i class="fas fa-heart" style="color:red;"></i><span>34</span></div>
                <div><i class="far fa-share-square" style="color:green;"></i><span>5</span></div>
            </div>`;
        commentsContainer.appendChild(commentDiv);
    });
}

function filterContent(query) {
    const filteredPosts = allPosts.filter(post => 
        post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query));
    const filteredComments = allComments.filter(comment => 
        comment.name.toLowerCase().includes(query) || comment.body.toLowerCase().includes(query));

    displayPosts(filteredPosts);
    displayComments(filteredComments);
}
