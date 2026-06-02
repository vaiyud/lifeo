let tasks = [
    { id: 1, name: "Open the windows", status: "Fresh air feels good.", icon: "wind", isOutdoor: false, completed: false, deferred: false },
    { id: 2, name: "Draw the curtains", status: "Let the light find you.", icon: "sun", isOutdoor: false, completed: false, deferred: false },
    { id: 3, name: "Take a shower", status: "A gentle refresh.", icon: "droplet", isOutdoor: false, completed: false, deferred: false },
    { id: 4, name: "Eat something nourishing", status: "Fueling your body.", icon: "coffee", isOutdoor: false, completed: false, deferred: false },
    { id: 5, name: "Walk around the block", status: "Small steps count.", icon: "map-pin", isOutdoor: true, completed: false, deferred: false }
];

const taskList = document.getElementById('task-list');
const aiModal = document.getElementById('ai-modal');
const closeModal = document.querySelector('.close-modal');
const confirmBtn = document.getElementById('confirm-task');
const aiStatus = document.getElementById('ai-status');
const modalTaskName = document.getElementById('modal-task-name');
const previewImg = document.getElementById('preview-img');
const greetingEl = document.getElementById('greeting');
const addTaskBtn = document.getElementById('add-task-btn');
const newTaskInput = document.getElementById('new-task-input');
const completionMessage = document.getElementById('completion-message');

let activeTaskId = null;

const greetings = [
    "The garden is waiting for you at your own pace.",
    "Breathe in the soft light of today.",
    "You are exactly where you need to be.",
    "Gentle steps are still progress.",
    "The world is soft today, and so are you."
];

function setRandomGreeting() {
    greetingEl.innerText = greetings[Math.floor(Math.random() * greetings.length)];
}

function createBubbles(e) {
    const count = 15;
    const x = e ? e.clientX : window.innerWidth / 2;
    const y = e ? e.clientY : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = Math.random() * 30 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        bubble.style.left = `${x + (Math.random() - 0.5) * 150}px`;
        bubble.style.top = `${y + (Math.random() - 0.5) * 150}px`;
        
        document.body.appendChild(bubble);
        
        setTimeout(() => {
            bubble.remove();
        }, 2000);
    }
}

function checkAllCompleted() {
    const allDone = tasks.length > 0 && tasks.every(t => t.completed || t.deferred);
    if (allDone) {
        completionMessage.style.display = 'block';
    } else {
        completionMessage.style.display = 'none';
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-card ${task.completed ? 'is-done' : ''} ${task.deferred ? 'is-deferred' : ''}`;
        li.style.animationDelay = `${index * 0.1}s`;
        
        li.innerHTML = `
            <div class="task-info">
                <span class="task-name">${task.name}</span>
                <span class="task-status">${task.completed ? 'Completed' : (task.deferred ? 'Resting until tomorrow' : task.status)}</span>
            </div>
            <div class="task-actions">
                ${!task.completed && !task.deferred ? `
                    <button class="task-btn check" title="Check off" onclick="completeTask(${task.id}, event)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                    <button class="task-btn photo" title="Share a moment" onclick="openPhotoModal(${task.id})">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    </button>
                ` : ''}
            </div>
        `;
        taskList.appendChild(li);
    });
    checkAllCompleted();
}

function completeTask(id, event) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = true;
        createBubbles(event);
        renderTasks();
    }
}

function deferTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.deferred = true;
        renderTasks();
    }
}

function openPhotoModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    activeTaskId = id;
    modalTaskName.innerText = task.name;
    aiStatus.innerText = "Share a picture of your progress...";
    previewImg.style.display = "none";
    previewImg.src = ""; // Clear previous image
    confirmBtn.style.display = "none";
    confirmBtn.disabled = true;
    document.querySelector('.pulse').style.display = "flex";
    aiModal.style.display = "flex";

    // Standard file input logic
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                previewImg.src = event.target.result;
                previewImg.style.display = "block";
                document.querySelector('.pulse').style.display = "none";
                evaluateImage(task);
            };
            reader.readAsDataURL(file);
        }
    };

    document.querySelector('.pulse').onclick = () => fileInput.click();
}

function evaluateImage(task) {
    aiStatus.innerText = "Gently observing...";
    
    setTimeout(() => {
        const isOutdoorTask = task.isOutdoor;
        // Simulating AI check: indoor photo (fake check) vs outdoor task
        // We'll simulate a 50/50 chance for outdoor tasks to be "indoor" for demonstration
        const looksOutdoor = !isOutdoorTask || Math.random() > 0.5;

        if (looksOutdoor) {
            aiStatus.innerText = "Everything looks wonderful. You did it!";
            confirmBtn.innerText = "Finish Task";
            confirmBtn.disabled = false;
            confirmBtn.style.display = "inline-block";
            confirmBtn.onclick = (e) => {
                completeTask(task.id, e);
                aiModal.style.display = "none";
            };
        } else {
            aiStatus.innerText = "It looks like you're choosing to stay cozy inside today. That's perfectly okay. Let's try this one tomorrow instead?";
            confirmBtn.innerText = "Rest for now";
            confirmBtn.disabled = false;
            confirmBtn.style.display = "inline-block";
            confirmBtn.onclick = () => {
                deferTask(task.id);
                aiModal.style.display = "none";
            };
        }
    }, 2000);
}

addTaskBtn.onclick = () => {
    const name = newTaskInput.value.trim();
    if (name) {
        const newTask = {
            id: Date.now(),
            name: name,
            status: "A new intention.",
            icon: "star",
            isOutdoor: name.toLowerCase().includes("walk") || name.toLowerCase().includes("outside"),
            completed: false,
            deferred: false
        };
        tasks.push(newTask);
        newTaskInput.value = '';
        renderTasks();
        createBubbles();
    }
};

newTaskInput.onkeypress = (e) => {
    if (e.key === 'Enter') addTaskBtn.click();
};

closeModal.onclick = () => aiModal.style.display = "none";
window.onclick = (event) => {
    if (event.target == aiModal) aiModal.style.display = "none";
};

// Initialize
setRandomGreeting();
renderTasks();
