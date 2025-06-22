// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const complaintSection = document.getElementById('complaintSection');
const complaintForm = document.getElementById('complaintForm');
const complaintsList = document.getElementById('complaintsList');

// Current user
let currentUser = null;

// Event Listeners
loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
closeModal.addEventListener('click', () => loginModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
});

loginForm.addEventListener('submit', handleLogin);
complaintForm.addEventListener('submit', handleComplaintSubmit);

// Functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('userType').value;
    
    // Simple validation (in a real app, you'd check against a database)
    if (email && password) {
        currentUser = {
            email,
            type: userType,
            id: Date.now().toString()
        };
        
        // Store user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Hide modal and show complaint section
        loginModal.style.display = 'none';
        complaintSection.classList.remove('hidden');
        
        // Load user's complaints
        loadUserComplaints();
        
        // If admin, redirect to admin page
        if (userType === 'admin') {
            window.location.href = 'admin.html';
        }
    } else {
        alert('Please enter both email and password');
    }
}

function handleComplaintSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('complaintTitle').value;
    const category = document.getElementById('complaintCategory').value;
    const urgency = document.getElementById('complaintUrgency').value;
    const description = document.getElementById('complaintDescription').value;
    const attachment = document.getElementById('complaintAttachment').files[0];
    
    const newComplaint = {
        id: Date.now().toString(),
        title,
        category,
        urgency,
        description,
        status: 'pending',
        date: new Date().toLocaleDateString(),
        submittedBy: currentUser.id,
        attachment: attachment ? attachment.name : null
    };
    
    // Add to database
    db.complaints.push(newComplaint);
    saveToDB();
    
    // Reset form
    complaintForm.reset();
    
    // Reload complaints
    loadUserComplaints();
    
    alert('Complaint submitted successfully!');
}

function loadUserComplaints() {
    complaintsList.innerHTML = '';
    
    const userComplaints = db.complaints.filter(
        complaint => complaint.submittedBy === currentUser.id
    );
    
    if (userComplaints.length === 0) {
        complaintsList.innerHTML = '<tr><td colspan="6">No complaints submitted yet</td></tr>';
        return;
    }
    
    userComplaints.forEach(complaint => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${complaint.id.slice(-6)}</td>
            <td>${complaint.title}</td>
            <td>${complaint.category}</td>
            <td class="status-${complaint.status.replace(' ', '-')}">${complaint.status}</td>
            <td>${complaint.date}</td>
            <td><button onclick="viewComplaint('${complaint.id}')">View</button></td>
        `;
        complaintsList.appendChild(row);
    });
}

function viewComplaint(id) {
    const complaint = db.complaints.find(c => c.id === id);
    if (complaint) {
        alert(`Complaint Details:\n\nTitle: ${complaint.title}\nCategory: ${complaint.category}\nStatus: ${complaint.status}\nDescription: ${complaint.description}`);
    }
}

function saveToDB() {
    localStorage.setItem('university_it_db', JSON.stringify(db));
}

// Check if user is already logged in
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        complaintSection.classList.remove('hidden');
        loadUserComplaints();
        
        // Redirect admin to admin page
        if (currentUser.type === 'admin') {
            window.location.href = 'admin.html';
        }
    }
}

// Initialize
checkAuth();


// Add to existing script.js

// Registration functionality

//i commint the below function due to varible redeclaration, it will be fix later//
// const registerBtn = document.getElementById('registerBtn');
const registerModal = document.getElementById('registerModal');
const registerForm = document.getElementById('registerForm');

registerBtn.addEventListener('click', () => registerModal.style.display = 'block');
document.querySelectorAll('.close')[1].addEventListener('click', () => registerModal.style.display = 'none');

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;
    const userType = document.getElementById('registerType').value;
    const universityId = document.getElementById('registerId').value;
    const department = document.getElementById('registerDepartment').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Check if email already exists
    if (db.users.some(u => u.email === email)) {
        alert('This email is already registered!');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In real app, hash this password
        type: userType,
        universityId,
        department,
        status: 'pending', // Requires admin approval
        createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    saveToDB();
    
    registerForm.reset();
    registerModal.style.display = 'none';
    alert('Registration request submitted! An admin will review your application.');
});

// File upload handling in complaint form
complaintForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('complaintTitle').value;
    const category = document.getElementById('complaintCategory').value;
    const urgency = document.getElementById('complaintUrgency').value;
    const description = document.getElementById('complaintDescription').value;
    const attachment = document.getElementById('complaintAttachment').files[0];
    
    let attachmentPath = null;
    if (attachment) {
        // In a real app, you would upload to a server here
        // For demo, we'll just store the filename
        attachmentPath = 'uploads/' + Date.now() + '_' + attachment.name;
        // Simulate upload by storing in localStorage
        const uploads = JSON.parse(localStorage.getItem('file_uploads') || '{}');
        uploads[attachmentPath] = {
            name: attachment.name,
            size: attachment.size,
            type: attachment.type,
            lastModified: attachment.lastModified
        };
        localStorage.setItem('file_uploads', JSON.stringify(uploads));
    }
    
    const newComplaint = {
        id: Date.now().toString(),
        title,
        category,
        urgency,
        description,
        status: 'pending',
        date: new Date().toLocaleDateString(),
        submittedBy: currentUser.id,
        attachment: attachmentPath,
        updates: [] // Track status changes for notifications
    };
    
    db.complaints.push(newComplaint);
    saveToDB();
    complaintForm.reset();
    loadUserComplaints();
    
    // Show notification
    showNotification('Complaint submitted successfully!');
});

// Notification system
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : ''}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Check for status updates periodically
setInterval(() => {
    if (!currentUser) return;
    
    const userComplaints = db.complaints.filter(c => c.submittedBy === currentUser.id);
    userComplaints.forEach(complaint => {
        if (!complaint.lastChecked || new Date(complaint.lastChecked) < new Date(complaint.updatedAt)) {
            if (complaint.updates && complaint.updates.length > 0) {
                const lastUpdate = complaint.updates[complaint.updates.length - 1];
                showNotification(`Complaint #${complaint.id.slice(-4)}: ${lastUpdate.message}`);
            }
            complaint.lastChecked = new Date().toISOString();
            saveToDB();
        }
    });
}, 30000); // Check every 30 seconds