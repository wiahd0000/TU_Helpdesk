// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const complaintsTable = document.getElementById('complaintsTable');
const adminComplaintsList = document.getElementById('adminComplaintsList');
const statusFilter = document.getElementById('statusFilter');
const urgencyFilter = document.getElementById('urgencyFilter');
const applyFilters = document.getElementById('applyFilters');
const complaintModal = document.getElementById('complaintModal');
const closeModal = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const pendingCount = document.getElementById('pendingCount');
const inProgressCount = document.getElementById('inProgressCount');
const resolvedCount = document.getElementById('resolvedCount');
const totalCount = document.getElementById('totalCount');

// Current complaint being viewed
let currentComplaintId = null;

// Event Listeners
logoutBtn.addEventListener('click', handleLogout);
applyFilters.addEventListener('click', loadComplaints);
closeModal.addEventListener('click', () => complaintModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === complaintModal) complaintModal.style.display = 'none';
});

// Functions
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function loadComplaints() {
    adminComplaintsList.innerHTML = '';
    
    const status = statusFilter.value;
    const urgency = urgencyFilter.value;
    
    let filteredComplaints = db.complaints;
    
    if (status !== 'all') {
        filteredComplaints = filteredComplaints.filter(c => c.status === status);
    }
    
    if (urgency !== 'all') {
        filteredComplaints = filteredComplaints.filter(c => c.urgency === urgency);
    }
    
    if (filteredComplaints.length === 0) {
        adminComplaintsList.innerHTML = '<tr><td colspan="8">No complaints found</td></tr>';
        return;
    }
    
    filteredComplaints.forEach(complaint => {
        const submittedBy = db.users.find(u => u.id === complaint.submittedBy);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${complaint.id.slice(-6)}</td>
            <td>${complaint.title}</td>
            <td>${complaint.category}</td>
            <td>${complaint.urgency}</td>
            <td>${submittedBy ? submittedBy.name : 'Unknown'}</td>
            <td>${complaint.date}</td>
            <td><span class="status-badge ${complaint.status.replace(' ', '-')}">${complaint.status}</span></td>
            <td>
                <button class="action-btn edit-btn" onclick="viewComplaintDetails('${complaint.id}')">View</button>
                <button class="action-btn resolve-btn" onclick="resolveComplaint('${complaint.id}')">Resolve</button>
            </td>
        `;
        adminComplaintsList.appendChild(row);
    });
}

function viewComplaintDetails(id) {
    currentComplaintId = id;
    const complaint = db.complaints.find(c => c.id === id);
    const submittedBy = db.users.find(u => u.id === complaint.submittedBy);
    
    if (complaint) {
        modalTitle.textContent = complaint.title;
        
        modalContent.innerHTML = `
            <div class="complaint-details">
                <div class="detail-row">
                    <label>Submitted By</label>
                    <p>${submittedBy ? submittedBy.name : 'Unknown'} (${submittedBy ? submittedBy.email : 'N/A'})</p>
                </div>
                <div class="detail-row">
                    <label>Category</label>
                    <p>${complaint.category}</p>
                </div>
                <div class="detail-row">
                    <label>Urgency</label>
                    <p>${complaint.urgency}</p>
                </div>
                <div class="detail-row">
                    <label>Date Submitted</label>
                    <p>${complaint.date}</p>
                </div>
                <div class="detail-row">
                    <label>Status</label>
                    <select id="updateStatus" class="status-select">
                        <option value="pending" ${complaint.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in progress" ${complaint.status === 'in progress' ? 'selected' : ''}>In Progress</option>
                        <option value="resolved" ${complaint.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                </div>
                <div class="detail-row">
                    <label>Description</label>
                    <p>${complaint.description}</p>
                </div>
                ${complaint.attachment ? `
                <div class="detail-row">
                    <label>Attachment</label>
                    <p>${complaint.attachment} <button onclick="downloadAttachment('${complaint.attachment}')">Download</button></p>
                </div>
                ` : ''}
                <button class="update-btn" onclick="updateComplaintStatus()">Update Status</button>
            </div>
        `;
        
        complaintModal.style.display = 'block';
    }
}

function updateComplaintStatus() {
    const newStatus = document.getElementById('updateStatus').value;
    const complaint = db.complaints.find(c => c.id === currentComplaintId);
    
    if (complaint) {
        complaint.status = newStatus;
        if (newStatus === 'resolved') {
            complaint.resolvedAt = new Date().toLocaleDateString();
        }
        saveToDB();
        loadComplaints();
        updateStats();
        complaintModal.style.display = 'none';
        alert('Status updated successfully!');
    }
}

function resolveComplaint(id) {
    const complaint = db.complaints.find(c => c.id === id);
    if (complaint) {
        complaint.status = 'resolved';
        complaint.resolvedAt = new Date().toLocaleDateString();
        saveToDB();
        loadComplaints();
        updateStats();
        alert('Complaint marked as resolved!');
    }
}

function downloadAttachment(filename) {
    alert(`In a real application, this would download: ${filename}`);
    // In a real app, you would fetch the file from your server
}

function updateStats() {
    const pending = db.complaints.filter(c => c.status === 'pending').length;
    const inProgress = db.complaints.filter(c => c.status === 'in progress').length;
    const resolved = db.complaints.filter(c => c.status === 'resolved').length;
    
    pendingCount.textContent = pending;
    inProgressCount.textContent = inProgress;
    resolvedCount.textContent = resolved;
    totalCount.textContent = db.complaints.length;
}

// Initialize
function init() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    loadComplaints();
    updateStats();
}

init();

// Make functions available globally
window.viewComplaintDetails = viewComplaintDetails;
window.resolveComplaint = resolveComplaint;
window.updateComplaintStatus = updateComplaintStatus;
window.downloadAttachment = downloadAttachment;





//will be remove anytime//
// Add to admin.js

// Add this to the admin dashboard HTML (in admin.html)
// Add this section before the complaints table
/*
<div class="admin-section">
    <h2>Pending User Approvals</h2>
    <table id="pendingUsersTable">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Department</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="pendingUsersList"></tbody>
    </table>
</div>
*/

// Add this to admin.js
function loadPendingUsers() {
    const pendingUsersList = document.getElementById('pendingUsersList');
    pendingUsersList.innerHTML = '';
    
    const pendingUsers = db.users.filter(u => u.status === 'pending');
    
    if (pendingUsers.length === 0) {
        pendingUsersList.innerHTML = '<tr><td colspan="5">No pending user approvals</td></tr>';
        return;
    }
    
    pendingUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.type}</td>
            <td>${user.department}</td>
            <td>
                <button class="action-btn approve-btn" onclick="approveUser('${user.id}')">Approve</button>
                <button class="action-btn reject-btn" onclick="rejectUser('${user.id}')">Reject</button>
            </td>
        `;
        pendingUsersList.appendChild(row);
    });
}

function approveUser(userId) {
    const user = db.users.find(u => u.id === userId);
    if (user) {
        user.status = 'approved';
        saveToDB();
        loadPendingUsers();
        // In a real app, send approval email here
        showNotification(`User ${user.email} approved successfully!`);
    }
}

function rejectUser(userId) {
    db.users = db.users.filter(u => u.id !== userId);
    saveToDB();
    loadPendingUsers();
    showNotification('User registration rejected');
}

// Update complaint status with notifications
function updateComplaintStatus() {
    const newStatus = document.getElementById('updateStatus').value;
    const resolutionNotes = document.getElementById('resolutionNotes').value || 'No notes provided';
    const complaint = db.complaints.find(c => c.id === currentComplaintId);
    
    if (complaint) {
        const oldStatus = complaint.status;
        complaint.status = newStatus;
        
        // Record update for notification
        if (!complaint.updates) complaint.updates = [];
        complaint.updates.push({
            date: new Date().toISOString(),
            from: oldStatus,
            to: newStatus,
            message: `Status changed from ${oldStatus} to ${newStatus}`,
            notes: resolutionNotes
        });
        
        if (newStatus === 'resolved') {
            complaint.resolvedAt = new Date().toLocaleDateString();
        }
        
        complaint.updatedAt = new Date().toISOString();
        saveToDB();
        loadComplaints();
        updateStats();
        complaintModal.style.display = 'none';
        showNotification('Status updated successfully!');
    }
}