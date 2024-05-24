"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class HabitTracker {
    constructor() {
        this.habitInput = document.getElementById('habit-input');
        this.dateInput = document.getElementById('date-input');
        this.addHabitBtn = document.getElementById('add-habit-btn');
        this.habitsContainer = document.getElementById('habits-container');
        this.modal = document.getElementById('habit-modal');
        this.openModalBtn = document.getElementById('open-modal-btn');
        this.closeModalBtn = document.getElementById('close-modal-btn');
        this.fontAwesomeIcons = [
            'fa-running', 'fa-biking', 'fa-hamburger', 'fa-bed', 'fa-walking', 'fa-smoking-ban'
        ];
        this.openModalBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (event) => this.closeModalOnOutsideClick(event));
        this.addHabitBtn.addEventListener('click', () => this.addHabit());
        document.addEventListener('DOMContentLoaded', () => this.fetchHabits());
        this.historyBtn = document.getElementById('history-btn');
        this.historyModal = document.getElementById('history-modal');
        this.backToHomeLink = document.getElementById('back-to-home-link');
        this.chartContainer = document.getElementById('chart-container');
        this.historyBtn.addEventListener('click', () => this.openHistoryModal());
        this.backToHomeLink.addEventListener('click', () => this.closeHistoryModal());
        this.updateHabitModal = document.getElementById('update-habit-modal');
        this.updateHabitForm = document.getElementById('update-habit-form');
        this.updateHabitInput = document.getElementById('update-habit-input');
        this.updateDateInput = document.getElementById('update-date-input');
        this.updateHabitBtn = document.getElementById('update-habit-btn');
        this.closeUpdateModalBtn = document.getElementById('close-update-modal-btn');
        this.closeUpdateModalBtn.addEventListener('click', () => this.closeUpdateModal());
        window.addEventListener('click', (event) => this.closeUpdateModalOnOutsideClick(event));
        this.updateHabitForm.addEventListener('submit', (event) => this.updateHabit(event));
    }
    openUpdateModal(habit) {
        this.updateHabitInput.value = habit.name;
        this.updateDateInput.value = habit.startDate;
        this.updateHabitBtn.dataset.id = habit.id.toString();
        this.updateHabitModal.style.display = 'flex';
    }
    closeUpdateModal() {
        this.updateHabitModal.style.display = 'none';
    }
    closeUpdateModalOnOutsideClick(event) {
        if (event.target === this.updateHabitModal) {
            this.closeUpdateModal();
        }
    }
    updateHabit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const habitId = String(this.updateHabitBtn.dataset.id || "No data present");
            const updatedHabit = {
                id: habitId,
                name: this.updateHabitInput.value,
                startDate: this.updateDateInput.value,
                icon: this.fontAwesomeIcons[Math.floor(Math.random() * this.fontAwesomeIcons.length)]
            };
            const response = yield fetch(`http://localhost:3001/habits/${habitId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedHabit)
            });
            const habit = yield response.json();
            this.fetchHabits();
            this.closeUpdateModal();
        });
    }
    deleteHabit(habitId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`http://localhost:3001/habits/${habitId}`, {
                method: 'DELETE'
            });
            this.fetchHabits();
        });
    }
    openHistoryModal() {
        this.historyModal.style.display = 'flex';
        this.fetchHabitsAndDisplayCharts();
    }
    closeHistoryModal() {
        this.historyModal.style.display = 'none';
    }
    fetchHabitsAndDisplayCharts() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('http://localhost:3001/habits');
            const habits = yield response.json();
            // Calculate the necessary values for the charts
            const habitNames = habits.map(habit => habit.name);
            const habitDurations = habits.map(habit => this.calculateDays(habit.startDate).value);
            console.log(habitDurations);
            // Create the charts
            new Chart(this.chartContainer, {
                type: 'bar',
                data: {
                    labels: habitNames,
                    datasets: [{
                            label: 'Habit Duration',
                            data: habitDurations,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                },
                options: {
                    scales: {
                        yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                    }
                }
            });
        });
    }
    openModal() {
        this.modal.style.display = 'flex';
    }
    closeModal() {
        this.modal.style.display = 'none';
    }
    closeModalOnOutsideClick(event) {
        if (event.target === this.modal) {
            this.closeModal();
        }
    }
    fetchHabits() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('http://localhost:3001/habits');
            const habits = yield response.json();
            this.habitsContainer.innerHTML = '';
            habits.forEach(habit => this.displayHabit(habit));
        });
    }
    addHabit() {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = new Date(this.dateInput.value);
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for accurate comparison
            if (startDate > now) {
                alert('Start date cannot be in the future');
                return;
            }
            const newHabit = {
                id: Date.now().toString(),
                name: this.habitInput.value,
                startDate: this.dateInput.value,
                icon: this.fontAwesomeIcons[Math.floor(Math.random() * this.fontAwesomeIcons.length)]
            };
            const response = yield fetch('http://localhost:3001/habits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newHabit)
            });
            const habit = yield response.json();
            this.displayHabit(habit);
            this.habitInput.value = '';
            this.dateInput.value = '';
            this.closeModal();
        });
    }
    displayHabit(habit) {
        const habitElement = document.createElement('div');
        habitElement.className = 'habit-card';
        habitElement.innerHTML = `
      <i class="fas ${habit.icon}"></i>
      <h3>${habit.name}</h3>
      <small>${habit.startDate}</small>
      <div class="overlay">
        <span class="neon-text">${this.calculateDays(habit.startDate).formatted}</span>
      </div>
      <div class="habit-actions">
      <button class="update-habit" data-id="${habit.id}" style="background-color:grey;" disabled>Update</button>
      <button class="delete-habit" data-id="${habit.id}">Delete</button>
    </div>
    `;
        this.habitsContainer.appendChild(habitElement);
        const updateBtn = habitElement.querySelector('.update-habit');
        const deleteBtn = habitElement.querySelector('.delete-habit');
        updateBtn.addEventListener('click', () => this.openUpdateModal(habit));
        deleteBtn.addEventListener('click', () => this.deleteHabit(habit.id));
    }
    calculateDays(startDate) {
        const start = new Date(startDate);
        const now = new Date();
        const diffInMilliseconds = now.getTime() - start.getTime();
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
        if (diffInDays < 7) {
            if (diffInDays === 1) {
                return { formatted: `${diffInDays} day`, value: diffInDays };
            }
            return { formatted: `${diffInDays} days`, value: diffInDays };
        }
        else if (diffInDays < 30) {
            const diffInWeeks = Math.floor(diffInDays / 7);
            if (diffInWeeks === 1) {
                return { formatted: `${diffInWeeks} week`, value: diffInWeeks };
            }
            return { formatted: `${diffInWeeks} weeks`, value: diffInWeeks };
        }
        else if (diffInDays < 365) {
            const diffInMonths = Math.floor(diffInDays / 30);
            if (Math.floor(diffInDays / 30) === 1) {
                return { formatted: `${Math.floor(diffInDays / 30)} month`, value: Math.floor(diffInDays / 30) };
            }
            return { formatted: `${diffInMonths} months`, value: diffInMonths };
        }
        else {
            const diffInYears = Math.floor(diffInDays / 365);
            if (diffInYears === 1) {
                return { formatted: `${diffInYears} year`, value: diffInYears };
            }
            return { formatted: `${diffInYears} years`, value: diffInYears };
        }
    }
}
new HabitTracker();
