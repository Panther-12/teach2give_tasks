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
const habitInput = document.getElementById('habit-input');
const dateInput = document.getElementById('date-input');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitsContainer = document.getElementById('habits-container');
const modal = document.getElementById('habit-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const fontAwesomeIcons = [
    'fa-running', 'fa-biking', 'fa-hamburger', 'fa-bed', 'fa-walking', 'fa-smoking-ban'
];
openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
const fetchHabits = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('http://localhost:3001/habits');
    const habits = yield response.json();
    habitsContainer.innerHTML = '';
    habits.forEach(displayHabit);
});
const addHabit = () => __awaiter(void 0, void 0, void 0, function* () {
    const newHabit = {
        id: Date.now(),
        name: habitInput.value,
        startDate: dateInput.value,
        icon: fontAwesomeIcons[Math.floor(Math.random() * fontAwesomeIcons.length)]
    };
    const response = yield fetch('http://localhost:3001/habits', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHabit)
    });
    const habit = yield response.json();
    displayHabit(habit);
    habitInput.value = '';
    dateInput.value = '';
    modal.style.display = 'none';
});
const displayHabit = (habit) => {
    const habitElement = document.createElement('div');
    habitElement.className = 'habit-card';
    habitElement.innerHTML = `
    <i class="fas ${habit.icon}"></i>
    <h3>${habit.name}</h3>
    <small>${habit.startDate}</small>
    <div class="overlay">
      <span class="neon-text">${calculateDays(habit.startDate)} days</span>
    </div>
  `;
    habitsContainer.appendChild(habitElement);
};
const calculateDays = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};
addHabitBtn.addEventListener('click', addHabit);
document.addEventListener('DOMContentLoaded', fetchHabits);
