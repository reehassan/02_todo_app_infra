// Enhanced version of original main.js with backend API integration
// Maintains the same structure while adding API functionality

// Configuration
const API_BASE_URL = '/api/todos';
const USE_API = true; // Set to false to use localStorage only

// SVG icons (unchanged)
var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

// Initialize data structure with fallback to localStorage
var data = {
    todo: [],
    completed: []
};

// API utility functions
async function apiRequest(endpoint, method = 'GET', body = null) {
    try {
        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (body) {
            config.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return method === 'DELETE' ? null : await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Load data from API or localStorage
async function loadData() {
    if (USE_API) {
        try {
            const todos = await apiRequest('');
            data.todo = todos.filter(todo => !todo.completed).map(todo => ({ ...todo, text: todo.text }));
            data.completed = todos.filter(todo => todo.completed).map(todo => ({ ...todo, text: todo.text }));
        } catch (error) {
            console.error('Failed to load from API, falling back to localStorage:', error);
            loadFromLocalStorage();
        }
    } else {
        loadFromLocalStorage();
    }
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('todoList');
    if (stored) {
        const parsedData = JSON.parse(stored);
        data.todo = parsedData.todo || [];
        data.completed = parsedData.completed || [];
    }
}

// Save data to API or localStorage
async function saveData() {
    if (USE_API) {
        try {
            // Note: Individual operations are saved via API calls
            // This function mainly handles localStorage sync
            dataObjectUpdated();
        } catch (error) {
            console.error('Failed to save to API:', error);
            dataObjectUpdated();
        }
    } else {
        dataObjectUpdated();
    }
}

// Initialize the app
async function initializeApp() {
    await loadData();
    renderTodoList();
    setupEventListeners();
}

// Setup event listeners (unchanged structure)
function setupEventListeners() {
    document.getElementById('add').addEventListener('click', function() {
        var value = document.getElementById('item').value;
        if (value) {
            addItem(value);
        }
    });

    document.getElementById('item').addEventListener('keydown', function (e) {
        var value = this.value;
        if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
            addItem(value);
        }
    });
}

// Enhanced addItem function with API integration
async function addItem(value) {
    if (USE_API) {
        try {
            const newTodo = await apiRequest('', 'POST', { text: value, completed: false });
            data.todo.push(newTodo);
            addItemToDOM(newTodo.text, false, newTodo.id);
        } catch (error) {
            console.error('Failed to add item via API:', error);
            // Fallback to localStorage
            data.todo.push(value);
            addItemToDOM(value);
        }
    } else {
        data.todo.push(value);
        addItemToDOM(value);
    }
    
    document.getElementById('item').value = '';
    dataObjectUpdated();
}

// Enhanced renderTodoList function
function renderTodoList() {
    if (!data.todo.length && !data.completed.length) return;
    
    for (var i = 0; i < data.todo.length; i++) {
        var todoItem = data.todo[i];
        var text = typeof todoItem === 'object' ? todoItem.text : todoItem;
        var id = typeof todoItem === 'object' ? todoItem.id : null;
        addItemToDOM(text, false, id);
    }
    
    for (var j = 0; j < data.completed.length; j++) {
        var completedItem = data.completed[j];
        var text = typeof completedItem === 'object' ? completedItem.text : completedItem;
        var id = typeof completedItem === 'object' ? completedItem.id : null;
        addItemToDOM(text, true, id);
    }
}

// Enhanced dataObjectUpdated function
function dataObjectUpdated() {
    localStorage.setItem('todoList', JSON.stringify(data));
}

// Enhanced removeItem function with API integration
async function removeItem() {
    var item = this.parentNode.parentNode;
    var parent = item.parentNode;
    var id = parent.id;
    var value = item.innerText;
    var itemId = item.dataset.itemId;
    
    if (USE_API && itemId) {
        try {
            await apiRequest(`/${itemId}`, 'DELETE');
        } catch (error) {
            console.error('Failed to delete item via API:', error);
        }
    }
    
    if (id === 'todo') {
        if (USE_API) {
            data.todo = data.todo.filter(todo => 
                (typeof todo === 'object' ? todo.id : todo) !== (itemId || value)
            );
        } else {
            data.todo.splice(data.todo.indexOf(value), 1);
        }
    } else {
        if (USE_API) {
            data.completed = data.completed.filter(todo => 
                (typeof todo === 'object' ? todo.id : todo) !== (itemId || value)
            );
        } else {
            data.completed.splice(data.completed.indexOf(value), 1);
        }
    }
    
    dataObjectUpdated();
    parent.removeChild(item);
}

// Enhanced completeItem function with API integration
async function completeItem() {
    var item = this.parentNode.parentNode;
    var parent = item.parentNode;
    var id = parent.id;
    var value = item.innerText;
    var itemId = item.dataset.itemId;
    
    var isCompleting = (id === 'todo');
    var todoItem;
    
    if (USE_API && itemId) {
        try {
            todoItem = await apiRequest(`/${itemId}`, 'PUT', { 
                text: value, 
                completed: isCompleting 
            });
        } catch (error) {
            console.error('Failed to update item via API:', error);
            // Fallback to local operation
            todoItem = { id: itemId, text: value, completed: isCompleting };
        }
    } else {
        todoItem = value;
    }
    
    if (isCompleting) {
        // Moving from todo to completed
        if (USE_API) {
            data.todo = data.todo.filter(todo => 
                (typeof todo === 'object' ? todo.id : todo) !== (itemId || value)
            );
            data.completed.push(todoItem);
        } else {
            data.todo.splice(data.todo.indexOf(value), 1);
            data.completed.push(value);
        }
    } else {
        // Moving from completed back to todo
        if (USE_API) {
            data.completed = data.completed.filter(todo => 
                (typeof todo === 'object' ? todo.id : todo) !== (itemId || value)
            );
            data.todo.push(todoItem);
        } else {
            data.completed.splice(data.completed.indexOf(value), 1);
            data.todo.push(value);
        }
    }
    
    dataObjectUpdated();
    
    // Move item in DOM
    var target = isCompleting ? document.getElementById('completed') : document.getElementById('todo');
    parent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);
}

// Enhanced addItemToDOM function with ID support
function addItemToDOM(text, completed, itemId) {
    var list = completed ? document.getElementById('completed') : document.getElementById('todo');
    var item = document.createElement('li');
    item.innerText = text;
    
    // Store item ID for API operations
    if (itemId) {
        item.dataset.itemId = itemId;
    }
    
    var buttons = document.createElement('div');
    buttons.classList.add('buttons');
    
    var remove = document.createElement('button');
    remove.classList.add('remove');
    remove.innerHTML = removeSVG;
    remove.addEventListener('click', removeItem);
    
    var complete = document.createElement('button');
    complete.classList.add('complete');
    complete.innerHTML = completeSVG;
    complete.addEventListener('click', completeItem);
    
    buttons.appendChild(remove);
    buttons.appendChild(complete);
    item.appendChild(buttons);
    list.insertBefore(item, list.childNodes[0]);
}

// Health check function
async function checkApiHealth() {
    try {
        const response = await fetch('/api/health');
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Check if API is available
    if (USE_API) {
        const apiAvailable = await checkApiHealth();
        if (!apiAvailable) {
            console.warn('API not available, falling back to localStorage');
            USE_API = false;
        }
    }
    
    await initializeApp();
});

// Sync data periodically if using API
if (USE_API) {
    setInterval(async function() {
        try {
            await loadData();
        } catch (error) {
            console.error('Failed to sync data:', error);
        }
    }, 30000); // Sync every 30 seconds
}