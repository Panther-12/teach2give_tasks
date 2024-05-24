interface User {
    id: string;
    name: string;
}

interface Habit {
    id: string;
    userId: string;
    name: string;
    startDate: string;
    endDate: string | null;
}

interface HabitEntry {
    id: string;
    habitId: string;
    entryDate: string;
    completed: boolean;
}

interface Stats {
    userId: string;
    totalHabits: number;
    longestStreak: number;
    currentStreak: number;
    habitsPerCategory: { category: string; count: number }[];
}


document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("habitModal") as HTMLElement;
    const addHabitButton = document.getElementById("addHabitButton") as HTMLElement;
    const closeButton = document.querySelector(".close-button") as HTMLElement;
    const habitForm = document.getElementById("habitForm") as HTMLFormElement;
    const modalTitle = document.getElementById("modalTitle") as HTMLElement;
    const habitIdInput = document.getElementById("habitId") as HTMLInputElement;

    fetchHabits("1"); 
    fetchStats("1"); 
    


    function fetchHabits(userId: string) {
        fetch(`http://localhost:8001/habits`)
            .then(response => response.json())
            .then((habits: Habit[]) => {
                let userHabits = habits.filter(habit => habit.userId === userId);
                        // Calculate streak for each habit
                        const streakData = habits.map(habit => ({
                            name: habit.name,
                            streak: calculateStreak(habit.startDate, habit.endDate),
                        }));
        
                        // Organize streak data for radar chart
                        const radarData = {
                            labels: streakData.map(data => data.name),
                            datasets: [{
                                label: 'Habit Streak',
                                data: streakData.map(data => data.streak),
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                            }]
                        };
                createRadarChart(radarData);
                fetchHabitEntries(userHabits);
            })
            .catch(error => console.error('Error fetching habits:', error));
    }

    function fetchHabitEntries(habits: Habit[]) {
        fetch(`http://localhost:8001/habitEntries`)
            .then(response => response.json())
            .then((habitEntries: HabitEntry[]) => {
                let habitLabels = habits.map(habit => habit.name);
                let habitData = habits.map(habit => {
                    let entries = habitEntries.filter(entry => entry.habitId === habit.id);
                    return entries.length;
                });

                // Create a line chart
                createLineChart(habitLabels, habitData);
            })
            .catch(error => console.error('Error fetching habit entries:', error));
    }

    function createLineChart(labels: string[], data: number[]) {
        const ctxLine = document.getElementById('habitComparisonChart') as HTMLCanvasElement
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
    function calculateStreak(startDate: string, endDate: string | null) {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    // Function to create radar chart
    function createRadarChart(data: any) {
        const ctxRadar = document.getElementById('habitStreakRadarChart') as HTMLCanvasElement;
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

    function fetchStats(userId: string) {
        fetch(`http://localhost:8001/stats`)
            .then(response => response.json())
            .then((stats: Stats[]) => {
                let filteredStats = stats.filter(stat => stat.userId === userId);
                if (filteredStats.length > 0) {
                    displayCharts(filteredStats[0]);
                }
            })
            .catch(error => console.error('Error fetching stats:', error));
    }

    function displayCharts(stats: Stats) {
        const totalHabitsCtx = document.getElementById('totalHabitsChart') as HTMLCanvasElement;
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

        document.querySelectorAll('.sidebar ul li').forEach((item: Element) => {
            item.addEventListener('click', () => {
                const chartCards = document.querySelectorAll('.chart-card');
                const clickedChartId = (item.firstChild as HTMLElement)?.getAttribute('href');
                const clickedChartIdValue = (item.firstChild as HTMLElement).getAttribute('href')?.slice(1);
                
                // Display user history if the clicked item is for user history
                if (clickedChartId === '#userHistory') {
                    displayUserHistory();
                    return; // Stop further execution
                }
                
                // Hide user history if the clicked item is not for user history
                hideUserHistory();
                
                // Handle displaying individual charts
                chartCards.forEach(card => {
                    const chartId = (card.querySelector('h2') as HTMLElement)?.getAttribute('id');
                    if (chartId === clickedChartIdValue) {
                        activateChart(card);
                    } else {
                        deactivateChart(card);
                    }
                });
            });
        });
        
        function displayUserHistory() {
            const mainContent = document.querySelector('.main-content') as HTMLElement;
            mainContent.innerHTML = `
                <h2>User History</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Habit Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Smoking</td>
                            <td>2024-01-01</td>
                            <td>null</td>
                        </tr>
                        <tr>
                            <td>Biting Nails</td>
                            <td>2024-02-01</td>
                            <td>2024-02-10</td>
                        </tr>
                        <!-- Add more rows as needed -->
                    </tbody>
                </table>
            `;
        }
        
        function hideUserHistory() {
            const mainContent = document.querySelector('.main-content') as HTMLElement;
            mainContent.innerHTML = '';
        }
        
        function activateChart(card: Element) {
            (card as HTMLElement).classList.add('active-chart');
            (card as HTMLElement).style.width = '400px';
            (card as HTMLElement).style.height = '400px';
        }
        
        function deactivateChart(card: Element) {
            (card as HTMLElement).classList.remove('active-chart');
            (card as HTMLElement).style.width = '300px';
            (card as HTMLElement).style.height = '300px';
        }

        // Display other charts
        const longestStreakCtx = document.getElementById('longestStreakChart') as HTMLCanvasElement;
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

        const habitsAnalysisCtx = document.getElementById('habitsAnalyis') as HTMLCanvasElement;
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

        const currentStreakCtx = document.getElementById('currentStreakChart') as HTMLCanvasElement;
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

        const habitsPerCategoryCtx = document.getElementById('habitsPerCategoryChart') as HTMLCanvasElement;
        new Chart(habitsPerCategoryCtx, {
            type: 'doughnut',
            data: {
                labels: stats.habitsPerCategory.map(item => item.category),
                datasets: [{
                    label: 'Habits per Category',
                    data: stats.habitsPerCategory.map(item => item.count),
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
        const userSelect = document.getElementById("userId") as HTMLSelectElement;
        fetch('http://localhost:8001/users')
            .then(response => response.json())
            .then((users: User[]) => {
                users.forEach(user => {
                    const option = document.createElement("option");
                    option.value = user.id;
                    option.textContent = user.name;
                    userSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    function showModal(editMode = false, habit: Habit | null = null) {
        if (editMode && habit) {
            modalTitle.textContent = "Edit Habit";
            habitIdInput.value = habit.id;
            (document.getElementById("userId") as HTMLSelectElement).value = habit.userId;
            (document.getElementById("name") as HTMLInputElement).value = habit.name;
            (document.getElementById("startDate") as HTMLInputElement).value = habit.startDate;
            (document.getElementById("endDate") as HTMLInputElement).value = habit.endDate || "";
        } else {
            modalTitle.textContent = "Add Habit";
            habitForm.reset();
            habitIdInput.value = "";
        }
        modal.style.display = "block";
    }

    function hideModal() {
        modal.style.display = "none";
    }

    function handleFormSubmit(event: Event) {
        event.preventDefault();

        const habitId = habitIdInput.value;
        const userId = (document.getElementById("userId") as HTMLSelectElement).value;
        const name = (document.getElementById("name") as HTMLInputElement).value;
        const startDate = (document.getElementById("startDate") as HTMLInputElement).value;
        const endDate = (document.getElementById("endDate") as HTMLInputElement).value || null;

        const habitData = { userId, name, startDate, endDate };

        if (habitId) {
            // Update habit
            updateHabit(habitId, habitData);
        } else {
            // Add new habit
            addHabit(habitData);
        }

        hideModal();
    }

    function addHabit(habitData: Partial<Habit>) {
        fetch('http://localhost:8001/habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(habitData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Habit added:', data);
        })
        .catch(error => console.error('Error adding habit:', error));
    }

    function updateHabit(habitId: string, habitData: Partial<Habit>) {
        fetch(`http://localhost:8001/habits/${habitId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(habitData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Habit updated:', data);
        })
        .catch(error => console.error('Error updating habit:', error));
    }

    addHabitButton.addEventListener("click", () => showModal(false));
    closeButton.addEventListener("click", hideModal);
    habitForm.addEventListener("submit", handleFormSubmit);
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    // Populate user options on page load
    populateUserOptions();

    
});
