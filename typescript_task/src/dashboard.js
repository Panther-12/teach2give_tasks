"use strict";
document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("habitModal");
    var addHabitButton = document.getElementById("addHabitButton");
    var closeButton = document.querySelector(".close-button");
    var habitForm = document.getElementById("habitForm");
    var modalTitle = document.getElementById("modalTitle");
    var habitIdInput = document.getElementById("habitId");
    fetchHabits("1");
    fetchStats("1");
    function fetchHabits(userId) {
        fetch("http://localhost:8001/habits")
            .then(function (response) { return response.json(); })
            .then(function (habits) {
            var userHabits = habits.filter(function (habit) { return habit.userId === userId; });
            // Calculate streak for each habit
            var streakData = habits.map(function (habit) { return ({
                name: habit.name,
                streak: calculateStreak(habit.startDate, habit.endDate),
            }); });
            // Organize streak data for radar chart
            var radarData = {
                labels: streakData.map(function (data) { return data.name; }),
                datasets: [{
                        label: 'Habit Streak',
                        data: streakData.map(function (data) { return data.streak; }),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }]
            };
            createRadarChart(radarData);
            fetchHabitEntries(userHabits);
        })
            .catch(function (error) { return console.error('Error fetching habits:', error); });
    }
    function fetchHabitEntries(habits) {
        fetch("http://localhost:8001/habitEntries")
            .then(function (response) { return response.json(); })
            .then(function (habitEntries) {
            var habitLabels = habits.map(function (habit) { return habit.name; });
            var habitData = habits.map(function (habit) {
                var entries = habitEntries.filter(function (entry) { return entry.habitId === habit.id; });
                return entries.length;
            });
            // Create a line chart
            createLineChart(habitLabels, habitData);
        })
            .catch(function (error) { return console.error('Error fetching habit entries:', error); });
    }
    function createLineChart(labels, data) {
        var ctxLine = document.getElementById('habitComparisonChart');
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                        label: 'Habit Comparison',
                        data: data,
                        fill: false,
                        borderColor: '#ff6600',
                        lineTension: 0.4
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                }
            }
        });
    }
    // Function to calculate streak
    function calculateStreak(startDate, endDate) {
        var start = new Date(startDate);
        var end = endDate ? new Date(endDate) : new Date();
        var diffTime = Math.abs(end.getTime() - start.getTime());
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    // Function to create radar chart
    function createRadarChart(data) {
        var ctxRadar = document.getElementById('habitStreakRadarChart');
        new Chart(ctxRadar, {
            type: 'radar',
            data: data,
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    function fetchStats(userId) {
        fetch("http://localhost:8001/stats")
            .then(function (response) { return response.json(); })
            .then(function (stats) {
            var filteredStats = stats.filter(function (stat) { return stat.userId === userId; });
            if (filteredStats.length > 0) {
                displayCharts(filteredStats[0]);
            }
        })
            .catch(function (error) { return console.error('Error fetching stats:', error); });
    }
    function displayCharts(stats) {
        var totalHabitsCtx = document.getElementById('totalHabitsChart');
        new Chart(totalHabitsCtx, {
            type: 'bar',
            data: {
                labels: ['Total Habits'],
                datasets: [{
                        label: 'Total Habits',
                        data: [stats.totalHabits],
                        backgroundColor: '#ff6600',
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
        document.querySelectorAll('.sidebar ul li').forEach(function (item) {
            item.addEventListener('click', function () {
                var _a, _b;
                var chartCards = document.querySelectorAll('.chart-card');
                var clickedChartId = (_a = item.firstChild) === null || _a === void 0 ? void 0 : _a.getAttribute('href');
                var clickedChartIdValue = (_b = item.firstChild.getAttribute('href')) === null || _b === void 0 ? void 0 : _b.slice(1);
                // Display user history if the clicked item is for user history
                if (clickedChartId === '#userHistory') {
                    displayUserHistory();
                    return; // Stop further execution
                }
                // Hide user history if the clicked item is not for user history
                hideUserHistory();
                // Handle displaying individual charts
                chartCards.forEach(function (card) {
                    var _a;
                    var chartId = (_a = card.querySelector('h2')) === null || _a === void 0 ? void 0 : _a.getAttribute('id');
                    if (chartId === clickedChartIdValue) {
                        activateChart(card);
                    }
                    else {
                        deactivateChart(card);
                    }
                });
            });
        });
        function displayUserHistory() {
            var mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = "\n                <h2>User History</h2>\n                <table>\n                    <thead>\n                        <tr>\n                            <th>Habit Name</th>\n                            <th>Start Date</th>\n                            <th>End Date</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr>\n                            <td>Smoking</td>\n                            <td>2024-01-01</td>\n                            <td>null</td>\n                        </tr>\n                        <tr>\n                            <td>Biting Nails</td>\n                            <td>2024-02-01</td>\n                            <td>2024-02-10</td>\n                        </tr>\n                        <!-- Add more rows as needed -->\n                    </tbody>\n                </table>\n            ";
        }
        function hideUserHistory() {
            var mainContent = document.querySelector('.main-content');
            mainContent.innerHTML = '';
        }
        function activateChart(card) {
            card.classList.add('active-chart');
            card.style.width = '400px';
            card.style.height = '400px';
        }
        function deactivateChart(card) {
            card.classList.remove('active-chart');
            card.style.width = '300px';
            card.style.height = '300px';
        }
        // Display other charts
        var longestStreakCtx = document.getElementById('longestStreakChart');
        new Chart(longestStreakCtx, {
            type: 'bar',
            data: {
                labels: ['Longest Streak'],
                datasets: [{
                        label: 'Longest Streak',
                        data: [stats.longestStreak],
                        backgroundColor: '#ff6600',
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
        var habitsAnalysisCtx = document.getElementById('habitsAnalyis');
        new Chart(habitsAnalysisCtx, {
            type: 'line',
            data: {
                labels: ['Current Streak'],
                datasets: [{
                        label: 'Current Streak',
                        data: [stats.currentStreak],
                        backgroundColor: '#ff6600',
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
        var currentStreakCtx = document.getElementById('currentStreakChart');
        new Chart(currentStreakCtx, {
            type: 'bar',
            data: {
                labels: ['Current Streak'],
                datasets: [{
                        label: 'Current Streak',
                        data: [stats.currentStreak],
                        backgroundColor: '#ff6600',
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
        var habitsPerCategoryCtx = document.getElementById('habitsPerCategoryChart');
        new Chart(habitsPerCategoryCtx, {
            type: 'doughnut',
            data: {
                labels: stats.habitsPerCategory.map(function (item) { return item.category; }),
                datasets: [{
                        label: 'Habits per Category',
                        data: stats.habitsPerCategory.map(function (item) { return item.count; }),
                        backgroundColor: ['#ff6600', '#ffa64d', '#ffcc99', '#ffe0cc'],
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }
    function populateUserOptions() {
        var userSelect = document.getElementById("userId");
        fetch('http://localhost:8001/users')
            .then(function (response) { return response.json(); })
            .then(function (users) {
            users.forEach(function (user) {
                var option = document.createElement("option");
                option.value = user.id;
                option.textContent = user.name;
                userSelect.appendChild(option);
            });
        })
            .catch(function (error) { return console.error('Error fetching users:', error); });
    }
    function showModal(editMode, habit) {
        if (editMode === void 0) { editMode = false; }
        if (habit === void 0) { habit = null; }
        if (editMode && habit) {
            modalTitle.textContent = "Edit Habit";
            habitIdInput.value = habit.id;
            document.getElementById("userId").value = habit.userId;
            document.getElementById("name").value = habit.name;
            document.getElementById("startDate").value = habit.startDate;
            document.getElementById("endDate").value = habit.endDate || "";
        }
        else {
            modalTitle.textContent = "Add Habit";
            habitForm.reset();
            habitIdInput.value = "";
        }
        modal.style.display = "block";
    }
    function hideModal() {
        modal.style.display = "none";
    }
    function handleFormSubmit(event) {
        event.preventDefault();
        var habitId = habitIdInput.value;
        var userId = document.getElementById("userId").value;
        var name = document.getElementById("name").value;
        var startDate = document.getElementById("startDate").value;
        var endDate = document.getElementById("endDate").value || null;
        var habitData = { userId: userId, name: name, startDate: startDate, endDate: endDate };
        if (habitId) {
            // Update habit
            updateHabit(habitId, habitData);
        }
        else {
            // Add new habit
            addHabit(habitData);
        }
        hideModal();
    }
    function addHabit(habitData) {
        fetch('http://localhost:8001/habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(habitData)
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            console.log('Habit added:', data);
        })
            .catch(function (error) { return console.error('Error adding habit:', error); });
    }
    function updateHabit(habitId, habitData) {
        fetch("http://localhost:8001/habits/".concat(habitId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(habitData)
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {
            console.log('Habit updated:', data);
        })
            .catch(function (error) { return console.error('Error updating habit:', error); });
    }
    addHabitButton.addEventListener("click", function () { return showModal(false); });
    closeButton.addEventListener("click", hideModal);
    habitForm.addEventListener("submit", handleFormSubmit);
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            hideModal();
        }
    });
    // Populate user options on page load
    populateUserOptions();
});
