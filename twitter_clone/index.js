const userSelect = document.getElementById('userSelect');
const postsContainer = document.getElementById('postsContainer');
const commentsContainer = document.getElementById('commentsContainer');
const searchInput = document.getElementById('searchInput');

let allPosts = [];
let allComments = [];

// Fetch users and populate the select box
fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(users => {
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.username;
            userSelect.appendChild(option);
        });
        userSelect.value = 1;
        fetchPosts(1);
    });

userSelect.addEventListener('change', (event) => {
    const userId = event.target.value;
    fetchPosts(userId);
});

searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    filterContent(query);
});

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
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p>`;
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
                <div><i class="far fa-comment"></i><span>12</span></div>
                <div><i class="far fa-heart"></i><span>34</span></div>
                <div><i class="far fa-share-square"></i><span>5</span></div>
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
