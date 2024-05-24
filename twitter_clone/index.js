const userSelect = document.getElementById('userSelect');
const postsContainer = document.getElementById('postsContainer');
const commentsContainer = document.getElementById('commentsContainer');
const searchInput = document.getElementById('searchInput');

const userName = document.getElementById('userName');
const userUsername = document.getElementById('userUsername');
const userCatchphrase = document.getElementById('userCatchphrase');
const userEmail = document.getElementById('userEmail');
const userWebsite = document.getElementById('userWebsite');
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
            // console.log(user)
            userName.textContent = user.name;
            userEmail.textContent = user.email;
            userAddress.textContent = `${user.address.city}`;
            userWebsite.textContent = user.website;
            userCatchphrase.textContent = user.company.catchPhrase;
            userUsername.textContent = user.username;
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
            // console.log(comments)
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
                <img src="./static/images/verified.png" alt="twitter verified icon" class="verified-icon"/>
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
    const PostComments = document.createElement('h4');
    PostComments.textContent = `Post ${comments[0].postId} Comments | Total ${comments.length}`;
    commentsContainer.appendChild(PostComments);
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


// // Gradient color switch
// let degree = 0;
// function changeGradient() {
//     degree = (degree + 1) % 360;
//     document.body.style.background = `linear-gradient(${degree}deg, #9C27B0, #673AB7, #3F51B5, #2196F3, #03A9F4, #00BCD4)`;
// }
// setInterval(changeGradient, 100);

// // Music visualizer
// const audio = new Audio('./static/audio/soul_amapiano.mp3');
// const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// const analyser = audioContext.createAnalyser();
// const source = audioContext.createMediaElementSource(audio);
// source.connect(analyser);
// analyser.connect(audioContext.destination);

// const canvas = document.createElement('canvas');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// document.body.appendChild(canvas);

// const context = canvas.getContext('2d');
// const bufferLength = analyser.frequencyBinCount;
// const dataArray = new Uint8Array(bufferLength);

// function draw() {
//     requestAnimationFrame(draw);
//     analyser.getByteFrequencyData(dataArray);
//     context.fillStyle = 'rgba(0, 0, 0, 0.1)';
//     context.fillRect(0, 0, canvas.width, canvas.height);
//     const barWidth = (canvas.width / bufferLength) * 2.5;
//     let x = 0;
//     for (let i = 0; i < bufferLength; i++) {
//         const barHeight = dataArray[i] / 2;
//         context.fillStyle = `rgb(${barHeight}, ${barHeight / 2}, ${255 - barHeight})`;
//         context.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
//         x += barWidth + 1;
//     }
// }
// draw();

// audio.play();