interface Habit {
  id: number;
  name: string;
  startDate: string; // ISO string date format
  icon: string;
}

const habitInput = document.getElementById('habit-input') as HTMLInputElement;
const dateInput = document.getElementById('date-input') as HTMLInputElement;
const addHabitBtn = document.getElementById('add-habit-btn') as HTMLButtonElement;
const habitsContainer = document.getElementById('habits-container') as HTMLDivElement;
const modal = document.getElementById('habit-modal') as HTMLDivElement;
const openModalBtn = document.getElementById('open-modal-btn') as HTMLButtonElement;
const closeModalBtn = document.getElementById('close-modal-btn') as HTMLSpanElement;

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

const fetchHabits = async () => {
  const response = await fetch('http://localhost:3001/habits');
  const habits: Habit[] = await response.json();
  habitsContainer.innerHTML = '';
  habits.forEach(displayHabit);
};

const addHabit = async () => {
  const newHabit: Habit = {
    id: Date.now(),
    name: habitInput.value,
    startDate: dateInput.value,
    icon: fontAwesomeIcons[Math.floor(Math.random() * fontAwesomeIcons.length)]
  };

  const response = await fetch('http://localhost:3001/habits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newHabit)
  });
  const habit = await response.json();
  displayHabit(habit);
  habitInput.value = '';
  dateInput.value = '';
  modal.style.display = 'none';
};

const displayHabit = (habit: Habit) => {
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

const calculateDays = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

addHabitBtn.addEventListener('click', addHabit);

document.addEventListener('DOMContentLoaded', fetchHabits);
