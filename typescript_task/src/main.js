"use strict";
document.addEventListener("DOMContentLoaded", function () {
    var streakCount = document.getElementById('streakCount');
    var dashboardContainer = document.getElementById('dashboardContainer');
    var habitHistoryContainer = document.getElementById('habitHistoryContainer');
    var userProfileContainer = document.getElementById('userProfileContainer');
    var motivationContainer = document.getElementById('motivationContainer');
    var dashboardCard = document.getElementById('dashboardSection');
    fetchStreak("1");
    fetchStats("1");
    fetchHabits("1");
    fetchUserProfile("1");
    fetchMotivationalMessages();
    dashboardCard.addEventListener('click', function () {
        console.log('clicked');
        window.location.href = 'dashboard.html';
    });
    function fetchStreak(userId) {
        fetch("http://localhost:8001/stats")
            .then(function (response) { return response.json(); })
            .then(function (stats) {
            var filteredStats = stats.filter(function (stat) { return stat.userId === userId; });
            if (filteredStats.length > 0) {
                streakCount.textContent = filteredStats[0].currentStreak.toString();
            }
        })
            .catch(function (error) { return console.error('Error fetching streak:', error); });
    }
    window.resetStreak = function () {
        fetch('http://localhost:8001/stats/resetStreak', { method: 'POST' })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            streakCount.textContent = data.currentStreak.toString();
            fetchStats(data.userId);
        })
            .catch(function (error) { return console.error('Error resetting streak:', error); });
    };
    function fetchStats(userId) {
        fetch("http://localhost:8001/stats")
            .then(function (response) { return response.json(); })
            .then(function (stats) {
            var filteredStats = stats.filter(function (stat) { return stat.userId === userId; });
            if (filteredStats.length > 0) {
                displayStats(filteredStats[0]);
            }
        })
            .catch(function (error) { return console.error('Error fetching stats:', error); });
    }
    function fetchHabits(userId) {
        fetch("http://localhost:8001/habits")
            .then(function (response) { return response.json(); })
            .then(function (habits) {
            var filteredHabits = habits.filter(function (habit) { return habit.userId === userId; });
            var firstThree = filteredHabits;
            if (filteredHabits.length > 3) {
                firstThree = filteredHabits.slice(0, 3);
            }
            displayHabits(firstThree);
        })
            .catch(function (error) { return console.error('Error fetching habits:', error); });
    }
    function fetchUserProfile(userId) {
        fetch("http://localhost:8001/users/".concat(userId))
            .then(function (response) { return response.json(); })
            .then(function (user) {
            displayUserProfile(user);
        })
            .catch(function (error) { return console.error('Error fetching user profile:', error); });
    }
    function fetchMotivationalMessages() {
        var messages = [
            "Keep going, you're doing great!",
            "Every step counts, no matter how small.",
            "Believe in yourself and all that you are."
        ];
        displayMotivationalMessages(messages);
    }
    function displayStats(stats) {
        dashboardContainer.innerHTML = "\n            <h3>Statistics</h3>\n            <p>Total Habits: ".concat(stats.totalHabits, "</p>\n            <p>Longest Streak: ").concat(stats.longestStreak, " days</p>\n            <p>Current Streak: ").concat(stats.currentStreak, " days</p>\n        ");
    }
    function displayHabits(habits) {
        habitHistoryContainer.innerHTML = habits.map(function (habit) { return "\n            <div class=\"habit\">\n                <h4>".concat(habit.name, "</h4>\n                <p>Started: ").concat(new Date(habit.startDate).toLocaleDateString(), "</p>\n                <p>Ended: ").concat(habit.endDate ? new Date(habit.endDate).toLocaleDateString() : 'Ongoing', "</p>\n            </div>\n        "); }).join('');
    }
    function displayUserProfile(user) {
        userProfileContainer.innerHTML = "\n            <p>Name: ".concat(user.name, "</p>\n        ");
    }
    function displayMotivationalMessages(messages) {
        motivationContainer.innerHTML = messages.map(function (message) { return "\n            <p>".concat(message, "</p>\n        "); }).join('');
    }
});
