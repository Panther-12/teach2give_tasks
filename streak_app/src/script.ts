interface Habit {
  id: string;
  name: string;
  startDate: string; // ISO string date format
  icon: string;
}

class HabitTracker {
  private habitInput: HTMLInputElement;
  private dateInput: HTMLInputElement;
  private addHabitBtn: HTMLButtonElement;
  private habitsContainer: HTMLDivElement;
  private modal: HTMLDivElement;
  private openModalBtn: HTMLButtonElement;
  private closeModalBtn: HTMLSpanElement;

  private historyBtn: HTMLButtonElement;
  private historyModal: HTMLDivElement;
  private backToHomeLink: HTMLAnchorElement;
  private chartContainer: HTMLCanvasElement;

  private updateHabitModal: HTMLDivElement;
  private updateHabitForm: HTMLFormElement;
  private updateHabitInput: HTMLInputElement;
  private updateDateInput: HTMLInputElement;
  private updateHabitBtn: HTMLButtonElement;
  private closeUpdateModalBtn: HTMLSpanElement;

  private fontAwesomeIcons: string[];

  constructor() {
    this.habitInput = document.getElementById('habit-input') as HTMLInputElement;
    this.dateInput = document.getElementById('date-input') as HTMLInputElement;
    this.addHabitBtn = document.getElementById('add-habit-btn') as HTMLButtonElement;
    this.habitsContainer = document.getElementById('habits-container') as HTMLDivElement;
    this.modal = document.getElementById('habit-modal') as HTMLDivElement;
    this.openModalBtn = document.getElementById('open-modal-btn') as HTMLButtonElement;
    this.closeModalBtn = document.getElementById('close-modal-btn') as HTMLSpanElement;
    this.fontAwesomeIcons = [
      'fa-running', 'fa-biking', 'fa-hamburger', 'fa-bed', 'fa-walking', 'fa-smoking-ban'
    ];

    this.openModalBtn.addEventListener('click', () => this.openModal());
    this.closeModalBtn.addEventListener('click', () => this.closeModal());
    window.addEventListener('click', (event) => this.closeModalOnOutsideClick(event));
    this.addHabitBtn.addEventListener('click', () => this.addHabit());
    document.addEventListener('DOMContentLoaded', () => this.fetchHabits());

    this.historyBtn = document.getElementById('history-btn') as HTMLButtonElement;
    this.historyModal = document.getElementById('history-modal') as HTMLDivElement;
    this.backToHomeLink = document.getElementById('back-to-home-link') as HTMLAnchorElement;
    this.chartContainer = document.getElementById('chart-container') as HTMLCanvasElement;

    this.historyBtn.addEventListener('click', () => this.openHistoryModal());
    this.backToHomeLink.addEventListener('click', () => this.closeHistoryModal());

    this.updateHabitModal = document.getElementById('update-habit-modal') as HTMLDivElement;
    this.updateHabitForm = document.getElementById('update-habit-form') as HTMLFormElement;
    this.updateHabitInput = document.getElementById('update-habit-input') as HTMLInputElement;
    this.updateDateInput = document.getElementById('update-date-input') as HTMLInputElement;
    this.updateHabitBtn = document.getElementById('update-habit-btn') as HTMLButtonElement;
    this.closeUpdateModalBtn = document.getElementById('close-update-modal-btn') as HTMLSpanElement;

    this.closeUpdateModalBtn.addEventListener('click', () => this.closeUpdateModal());
    window.addEventListener('click', (event) => this.closeUpdateModalOnOutsideClick(event));
    this.updateHabitForm.addEventListener('submit', (event) => this.updateHabit(event));
  }

  private openUpdateModal(habit: Habit) {
    this.updateHabitInput.value = habit.name;
    this.updateDateInput.value = habit.startDate;
    this.updateHabitBtn.dataset.id = habit.id.toString();
    this.updateHabitModal.style.display = 'flex';
  }
  
  private closeUpdateModal() {
    this.updateHabitModal.style.display = 'none';
  }
  
  private closeUpdateModalOnOutsideClick(event: MouseEvent) {
    if (event.target === this.updateHabitModal) {
      this.closeUpdateModal();
    }
  }
  
  private async updateHabit(event: Event) {
    event.preventDefault();
    const habitId = String(this.updateHabitBtn.dataset.id || "No data present");
    const updatedHabit: Habit = {
      id: habitId,
      name: this.updateHabitInput.value,
      startDate: this.updateDateInput.value,
      icon: this.fontAwesomeIcons[Math.floor(Math.random() * this.fontAwesomeIcons.length)]
    };
    const response = await fetch(`http://localhost:3001/habits/${habitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedHabit)
    });
    const habit = await response.json();
    this.fetchHabits();
    this.closeUpdateModal();
  }
  
  private async deleteHabit(habitId: string) {
    await fetch(`http://localhost:3001/habits/${habitId}`, {
      method: 'DELETE'
    });
    this.fetchHabits();
  }

  private openHistoryModal() {
    this.historyModal.style.display = 'flex';
    this.fetchHabitsAndDisplayCharts();
  }

  private closeHistoryModal() {
    this.historyModal.style.display = 'none';
  }

  private async fetchHabitsAndDisplayCharts() {
    const response = await fetch('http://localhost:3001/habits');
    const habits: Habit[] = await response.json();

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
  }

  private openModal() {
    this.modal.style.display = 'flex';
  }

  private closeModal() {
    this.modal.style.display = 'none';
  }

  private closeModalOnOutsideClick(event: MouseEvent) {
    if (event.target === this.modal) {
      this.closeModal();
    }
  }

  private async fetchHabits() {
    const response = await fetch('http://localhost:3001/habits');
    const habits: Habit[] = await response.json();
    this.habitsContainer.innerHTML = '';
    habits.forEach(habit => this.displayHabit(habit));
  }

  private async addHabit() {
    const startDate = new Date(this.dateInput.value);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for accurate comparison
  
    if (startDate > now) {
      alert('Start date cannot be in the future');
      return;
    } 
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: this.habitInput.value,
      startDate: this.dateInput.value,
      icon: this.fontAwesomeIcons[Math.floor(Math.random() * this.fontAwesomeIcons.length)]
    };

    const response = await fetch('http://localhost:3001/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newHabit)
    });
    const habit = await response.json();
    this.displayHabit(habit);
    this.habitInput.value = '';
    this.dateInput.value = '';
    this.closeModal();
  }

  private displayHabit(habit: Habit) {
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

    const updateBtn = habitElement.querySelector('.update-habit') as HTMLElement;
    const deleteBtn = habitElement.querySelector('.delete-habit') as  HTMLElement;
    updateBtn.addEventListener('click', () => this.openUpdateModal(habit));
    deleteBtn.addEventListener('click', () => this.deleteHabit(habit.id));
    
  }
  

  private calculateDays(startDate: string): { formatted: string, value: number } {
    const start = new Date(startDate);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - start.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  
    if (diffInDays < 7) {
      if(diffInDays === 1) {
        return { formatted: `${diffInDays} day`, value: diffInDays };
      }
      return { formatted: `${diffInDays} days`, value: diffInDays };
    } else if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      if(diffInWeeks === 1) {
        return { formatted: `${diffInWeeks} week`, value: diffInWeeks };
      }
      return { formatted: `${diffInWeeks} weeks`, value: diffInWeeks };
    } else if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      if(Math.floor(diffInDays / 30) === 1) {
        return { formatted: `${Math.floor(diffInDays / 30)} month`, value: Math.floor(diffInDays / 30) };
      }
      return { formatted: `${diffInMonths} months`, value: diffInMonths };
    } else {
      const diffInYears = Math.floor(diffInDays / 365);
      if(diffInYears === 1) {
        return { formatted: `${diffInYears} year`, value: diffInYears };
      }
      return { formatted: `${diffInYears} years`, value: diffInYears };
    }
  }
}

new HabitTracker();