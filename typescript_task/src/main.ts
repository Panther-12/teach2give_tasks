interface Window {
    resetStreak: () => void;
}

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

interface Stats {
    userId: string;
    totalHabits: number;
    longestStreak: number;
    currentStreak: number;
}

document.addEventListener("DOMContentLoaded", () => {
    const streakCount = document.getElementById('streakCount') as HTMLDivElement;
    const dashboardContainer = document.getElementById('dashboardContainer') as HTMLDivElement;
    const habitHistoryContainer = document.getElementById('habitHistoryContainer') as HTMLDivElement;
    const userProfileContainer = document.getElementById('userProfileContainer') as HTMLDivElement;
    const motivationContainer = document.getElementById('motivationContainer') as HTMLDivElement;
    const dashboardCard = document.getElementById('dashboardSection') as HTMLElement;

    fetchStreak("1");
    fetchStats("1");
    fetchHabits("1");
    fetchUserProfile("1");
    fetchMotivationalMessages();

    dashboardCard.addEventListener('click', () => {
        console.log('clicked');
        window.location.href = 'dashboard.html';
    });

    function fetchStreak(userId: string) {
        fetch(`http://localhost:8001/stats`)
            .then(response => response.json())
            .then((stats: Stats[]) => {
                let filteredStats = stats.filter(stat => stat.userId === userId);
                if (filteredStats.length > 0) {
                    streakCount.textContent = filteredStats[0].currentStreak.toString();
                }
            })
            .catch(error => console.error('Error fetching streak:', error));
    }

    window.resetStreak = function() {
        fetch('http://localhost:8001/stats/resetStreak', { method: 'POST' })
            .then(response => response.json())
            .then((data: { userId: string, currentStreak: number }) => {
                streakCount.textContent = data.currentStreak.toString();
                fetchStats(data.userId);
            })
            .catch(error => console.error('Error resetting streak:', error));
    }

    function fetchStats(userId: string) {
        fetch(`http://localhost:8001/stats`)
            .then(response => response.json())
            .then((stats: Stats[]) => {
                let filteredStats = stats.filter(stat => stat.userId === userId);
                if (filteredStats.length > 0) {
                    displayStats(filteredStats[0]);
                }
            })
            .catch(error => console.error('Error fetching stats:', error));
    }

    function fetchHabits(userId: string) {
        fetch("http://localhost:8001/habits")
            .then(response => response.json())
            .then((habits: Habit[]) => {
                let filteredHabits = habits.filter(habit => habit.userId === userId);
                let firstThree: Habit[] = filteredHabits;
                if (filteredHabits.length > 3) {
                    firstThree = filteredHabits.slice(0, 3);
                }
                displayHabits(firstThree);
            })
            .catch(error => console.error('Error fetching habits:', error));
    }

    function fetchUserProfile(userId: string) {
        fetch(`http://localhost:8001/users/${userId}`)
            .then(response => response.json())
            .then((user: User) => {
                displayUserProfile(user);
            })
            .catch(error => console.error('Error fetching user profile:', error));
    }

    function fetchMotivationalMessages() {
        const messages = [
            "Keep going, you're doing great!",
            "Every step counts, no matter how small.",
            "Believe in yourself and all that you are."
        ];
        displayMotivationalMessages(messages);
    }

    function displayStats(stats: Stats) {
        dashboardContainer.innerHTML = `
            <h3>Statistics</h3>
            <p>Total Habits: ${stats.totalHabits}</p>
            <p>Longest Streak: ${stats.longestStreak} days</p>
            <p>Current Streak: ${stats.currentStreak} days</p>
        `;
    }

    function displayHabits(habits: Habit[]) {
        habitHistoryContainer.innerHTML = habits.map(habit => `
            <div class="habit">
                <h4>${habit.name}</h4>
                <p>Started: ${new Date(habit.startDate).toLocaleDateString()}</p>
                <p>Ended: ${habit.endDate ? new Date(habit.endDate).toLocaleDateString() : 'Ongoing'}</p>
            </div>
        `).join('');
    }

    function displayUserProfile(user: User) {
        userProfileContainer.innerHTML = `
            <p>Name: ${user.name}</p>
        `;
    }

    function displayMotivationalMessages(messages: string[]) {
        motivationContainer.innerHTML = messages.map(message => `
            <p>${message}</p>
        `).join('');
    }
});
