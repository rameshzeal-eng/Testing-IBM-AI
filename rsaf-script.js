// User roles and data
const users = {
  trainee: { name: 'John Tan', role: 'Trainee' },
  trainer: { name: 'Sarah Lim', role: 'Trainer' },
  examiner: { name: 'David Wong', role: 'Examiner' },
  commander: { name: 'Colonel Lee', role: 'Commander' },
};

// Current user (can be set based on login)
let currentUser = users.trainee;

// Qualifications data
const qualifications = [
  {
    id: 1,
    code: 'RSAF-F16-001',
    title: 'F-16 Fighter Pilot Qualification',
    category: 'Aircraft',
    description:
      'Complete qualification for F-16 fighter aircraft operations including flight procedures, weapons systems, and tactical operations.',
    duration: '6 months',
    level: 'Advanced',
  },
  {
    id: 2,
    code: 'RSAF-MNT-002',
    title: 'Aircraft Maintenance Engineering',
    category: 'Maintenance',
    description:
      'Comprehensive training in aircraft maintenance, systems diagnostics, and repair procedures for military aircraft.',
    duration: '4 months',
    level: 'Intermediate',
  },
  {
    id: 3,
    code: 'RSAF-OPS-003',
    title: 'Air Traffic Control Operations',
    category: 'Operations',
    description:
      'Training in air traffic control procedures, communication protocols, and airspace management for military operations.',
    duration: '3 months',
    level: 'Intermediate',
  },
  {
    id: 4,
    code: 'RSAF-SAF-004',
    title: 'Aviation Safety Officer',
    category: 'Safety',
    description:
      'Qualification in aviation safety protocols, accident investigation, and safety management systems.',
    duration: '2 months',
    level: 'Basic',
  },
  {
    id: 5,
    code: 'RSAF-AIR-005',
    title: 'Apache Helicopter Pilot',
    category: 'Aircraft',
    description:
      'Specialized training for Apache attack helicopter operations including weapons systems and combat tactics.',
    duration: '8 months',
    level: 'Advanced',
  },
  {
    id: 6,
    code: 'RSAF-MNT-006',
    title: 'Avionics Systems Technician',
    category: 'Maintenance',
    description:
      'Advanced training in aircraft avionics systems, radar, navigation, and communication equipment.',
    duration: '5 months',
    level: 'Advanced',
  },
  {
    id: 7,
    code: 'RSAF-OPS-007',
    title: 'Flight Operations Coordinator',
    category: 'Operations',
    description:
      'Training in flight planning, mission coordination, and operational resource management.',
    duration: '3 months',
    level: 'Intermediate',
  },
  {
    id: 8,
    code: 'RSAF-SAF-008',
    title: 'Emergency Response Procedures',
    category: 'Safety',
    description:
      'Certification in emergency response, fire safety, and crisis management for aviation incidents.',
    duration: '1 month',
    level: 'Basic',
  },
];

// Enrollments data (stores trainee enrollments)
let enrollments = [];

// Initialize application
window.onload = function () {
  // Check if user role is stored
  const storedRole = localStorage.getItem('userRole') || 'trainee';
  currentUser = users[storedRole];

  // Update UI based on user role
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('userRole').textContent = currentUser.role;

  // Show approval tab for trainers, examiners, and commanders
  if (currentUser.role !== 'Trainee') {
    document.getElementById('approvalTab').style.display = 'block';
  }

  // Load data
  loadEnrollments();
  displayQualifications(qualifications);
  updateStats();
};

// Display qualifications
function displayQualifications(quals) {
  const grid = document.getElementById('qualificationsGrid');

  grid.innerHTML = quals
    .map((qual) => {
      const isEnrolled = enrollments.some(
        (e) => e.qualificationId === qual.id && e.trainee === currentUser.name,
      );

      return `
            <div class="qual-card">
                <div class="qual-header">
                    <div class="qual-code">${qual.code}</div>
                    <div class="qual-title">${qual.title}</div>
                    <span class="qual-category">${qual.category}</span>
                </div>
                <div class="qual-body">
                    <div class="qual-description">${qual.description}</div>
                    <div class="qual-meta">
                        <div class="meta-item">
                            <strong>Duration</strong>
                            ${qual.duration}
                        </div>
                        <div class="meta-item">
                            <strong>Level</strong>
                            ${qual.level}
                        </div>
                    </div>
                    <div class="qual-actions">
                        <button class="btn-enroll" onclick="enrollQualification(${qual.id})" ${isEnrolled ? 'disabled' : ''}>
                            ${isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
                        </button>
                        <button class="btn-details" onclick="viewDetails(${qual.id})">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    })
    .join('');
}

// Filter qualifications
function filterQualifications() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;

  const filtered = qualifications.filter((qual) => {
    const matchesSearch =
      qual.title.toLowerCase().includes(searchTerm) ||
      qual.code.toLowerCase().includes(searchTerm) ||
      qual.description.toLowerCase().includes(searchTerm);
    const matchesCategory = !category || qual.category === category;

    return matchesSearch && matchesCategory;
  });

  displayQualifications(filtered);
}

// Enroll in qualification
function enrollQualification(qualId) {
  if (currentUser.role !== 'Trainee') {
    alert('Only trainees can enroll in qualifications.');
    return;
  }

  const qual = qualifications.find((q) => q.id === qualId);

  if (
    confirm(
      `Enroll in ${qual.title}?\n\nThis will be submitted for approval by your trainer.`,
    )
  ) {
    const enrollment = {
      id: Date.now(),
      qualificationId: qualId,
      qualificationCode: qual.code,
      qualificationName: qual.title,
      trainee: currentUser.name,
      enrolledDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      currentStage: 'Awaiting Trainer Approval',
      trainerApproval: null,
      examinerApproval: null,
      commanderApproval: null,
    };

    enrollments.push(enrollment);
    saveEnrollments();

    alert(
      `✅ Successfully enrolled in ${qual.title}!\n\nYour enrollment has been submitted for trainer approval.`,
    );

    displayQualifications(qualifications);
    updateStats();
  }
}

// View qualification details
function viewDetails(qualId) {
  const qual = qualifications.find((q) => q.id === qualId);
  alert(
    `📋 Qualification Details\n\n` +
      `Code: ${qual.code}\n` +
      `Title: ${qual.title}\n` +
      `Category: ${qual.category}\n` +
      `Level: ${qual.level}\n` +
      `Duration: ${qual.duration}\n\n` +
      `Description:\n${qual.description}`,
  );
}

// Switch tabs
function switchTab(tabName) {
  // Update tab buttons
  document
    .querySelectorAll('.nav-tab')
    .forEach((tab) => tab.classList.remove('active'));
  event.target.classList.add('active');

  // Update content
  document
    .querySelectorAll('.tab-content')
    .forEach((content) => content.classList.remove('active'));

  if (tabName === 'available') {
    document.getElementById('availableTab').classList.add('active');
  } else if (tabName === 'enrollments') {
    document.getElementById('enrollmentsTab').classList.add('active');
    displayMyEnrollments();
  } else if (tabName === 'approvals') {
    document.getElementById('approvalsTab').classList.add('active');
    displayPendingApprovals();
  }
}

// Display my enrollments (for trainees)
function displayMyEnrollments() {
  const tbody = document.getElementById('enrollmentsTableBody');
  const noEnrollments = document.getElementById('noEnrollments');

  const myEnrollments = enrollments.filter(
    (e) => e.trainee === currentUser.name,
  );

  if (myEnrollments.length === 0) {
    tbody.innerHTML = '';
    noEnrollments.style.display = 'block';
    return;
  }

  noEnrollments.style.display = 'none';
  tbody.innerHTML = myEnrollments
    .map(
      (enrollment) => `
        <tr>
            <td>${enrollment.qualificationCode}</td>
            <td>${enrollment.qualificationName}</td>
            <td>${enrollment.enrolledDate}</td>
            <td><span class="approval-status status-${enrollment.status.toLowerCase().replace(' ', '-')}">${enrollment.status}</span></td>
            <td>${enrollment.currentStage}</td>
            <td>
                <button class="action-btn btn-view" onclick="viewEnrollmentDetails(${enrollment.id})">View</button>
            </td>
        </tr>
    `,
    )
    .join('');
}

// Display pending approvals (for trainers, examiners, commanders)
function displayPendingApprovals() {
  const tbody = document.getElementById('approvalsTableBody');
  const noApprovals = document.getElementById('noApprovals');

  let pendingApprovals = [];

  // Filter based on role
  if (currentUser.role === 'Trainer') {
    pendingApprovals = enrollments.filter(
      (e) => e.status === 'Pending' && e.trainerApproval === null,
    );
  } else if (currentUser.role === 'Examiner') {
    pendingApprovals = enrollments.filter(
      (e) => e.status === 'Trainer Approved' && e.examinerApproval === null,
    );
  } else if (currentUser.role === 'Commander') {
    pendingApprovals = enrollments.filter(
      (e) => e.status === 'Examiner Approved' && e.commanderApproval === null,
    );
  }

  if (pendingApprovals.length === 0) {
    tbody.innerHTML = '';
    noApprovals.style.display = 'block';
    return;
  }

  noApprovals.style.display = 'none';
  tbody.innerHTML = pendingApprovals
    .map(
      (enrollment) => `
        <tr>
            <td>${enrollment.trainee}</td>
            <td>${enrollment.qualificationCode} - ${enrollment.qualificationName}</td>
            <td>${enrollment.enrolledDate}</td>
            <td><span class="approval-status status-${enrollment.status.toLowerCase().replace(' ', '-')}">${enrollment.status}</span></td>
            <td>
                <button class="action-btn btn-approve" onclick="approveEnrollment(${enrollment.id})">Approve</button>
                <button class="action-btn btn-reject" onclick="rejectEnrollment(${enrollment.id})">Reject</button>
                <button class="action-btn btn-view" onclick="viewEnrollmentDetails(${enrollment.id})">View</button>
            </td>
        </tr>
    `,
    )
    .join('');
}

// Approve enrollment
function approveEnrollment(enrollmentId) {
  const enrollment = enrollments.find((e) => e.id === enrollmentId);

  if (
    confirm(
      `Approve ${enrollment.trainee}'s enrollment in ${enrollment.qualificationName}?`,
    )
  ) {
    if (currentUser.role === 'Trainer') {
      enrollment.trainerApproval = {
        approver: currentUser.name,
        date: new Date().toISOString().split('T')[0],
      };
      enrollment.status = 'Trainer Approved';
      enrollment.currentStage = 'Awaiting Examiner Approval';
    } else if (currentUser.role === 'Examiner') {
      enrollment.examinerApproval = {
        approver: currentUser.name,
        date: new Date().toISOString().split('T')[0],
      };
      enrollment.status = 'Examiner Approved';
      enrollment.currentStage = 'Awaiting Commander Approval';
    } else if (currentUser.role === 'Commander') {
      enrollment.commanderApproval = {
        approver: currentUser.name,
        date: new Date().toISOString().split('T')[0],
      };
      enrollment.status = 'Commander Approved';
      enrollment.currentStage = 'Qualification Authorized';
    }

    saveEnrollments();
    alert(`✅ Enrollment approved successfully!`);
    displayPendingApprovals();
    updateStats();
  }
}

// Reject enrollment
function rejectEnrollment(enrollmentId) {
  const enrollment = enrollments.find((e) => e.id === enrollmentId);
  const reason = prompt('Please provide a reason for rejection:');

  if (reason) {
    enrollment.status = 'Rejected';
    enrollment.currentStage = `Rejected by ${currentUser.role}`;
    enrollment.rejectionReason = reason;
    enrollment.rejectedBy = currentUser.name;
    enrollment.rejectedDate = new Date().toISOString().split('T')[0];

    saveEnrollments();
    alert(`❌ Enrollment rejected.`);
    displayPendingApprovals();
    updateStats();
  }
}

// View enrollment details
function viewEnrollmentDetails(enrollmentId) {
  const enrollment = enrollments.find((e) => e.id === enrollmentId);

  let details =
    `📋 Enrollment Details\n\n` +
    `Trainee: ${enrollment.trainee}\n` +
    `Qualification: ${enrollment.qualificationCode}\n` +
    `${enrollment.qualificationName}\n` +
    `Enrolled Date: ${enrollment.enrolledDate}\n` +
    `Status: ${enrollment.status}\n` +
    `Current Stage: ${enrollment.currentStage}\n\n`;

  details += `Approval Progress:\n`;
  details += `Trainer: ${enrollment.trainerApproval ? '✅ Approved by ' + enrollment.trainerApproval.approver : '⏳ Pending'}\n`;
  details += `Examiner: ${enrollment.examinerApproval ? '✅ Approved by ' + enrollment.examinerApproval.approver : '⏳ Pending'}\n`;
  details += `Commander: ${enrollment.commanderApproval ? '✅ Approved by ' + enrollment.commanderApproval.approver : '⏳ Pending'}\n`;

  if (enrollment.status === 'Rejected') {
    details += `\n❌ Rejection Details:\n`;
    details += `Rejected by: ${enrollment.rejectedBy}\n`;
    details += `Reason: ${enrollment.rejectionReason}\n`;
  }

  alert(details);
}

// Update statistics
function updateStats() {
  const totalQuals = qualifications.length;
  const myEnrollments = enrollments.filter(
    (e) => e.trainee === currentUser.name,
  );
  const completed = myEnrollments.filter(
    (e) => e.status === 'Commander Approved',
  ).length;

  let pending = 0;
  if (currentUser.role === 'Trainer') {
    pending = enrollments.filter(
      (e) => e.status === 'Pending' && e.trainerApproval === null,
    ).length;
  } else if (currentUser.role === 'Examiner') {
    pending = enrollments.filter(
      (e) => e.status === 'Trainer Approved' && e.examinerApproval === null,
    ).length;
  } else if (currentUser.role === 'Commander') {
    pending = enrollments.filter(
      (e) => e.status === 'Examiner Approved' && e.commanderApproval === null,
    ).length;
  } else {
    pending = myEnrollments.filter(
      (e) => e.status !== 'Commander Approved' && e.status !== 'Rejected',
    ).length;
  }

  document.getElementById('totalQuals').textContent = totalQuals;
  document.getElementById('myEnrollments').textContent = myEnrollments.length;
  document.getElementById('pendingApprovals').textContent = pending;
  document.getElementById('completedQuals').textContent = completed;
}

// Save enrollments to localStorage
function saveEnrollments() {
  localStorage.setItem('rsaf_enrollments', JSON.stringify(enrollments));
}

// Load enrollments from localStorage
function loadEnrollments() {
  const saved = localStorage.getItem('rsaf_enrollments');
  if (saved) {
    enrollments = JSON.parse(saved);
  }
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
  }
}

// Role selector for demo (you can create a role selector page)
function switchRole(role) {
  if (users[role]) {
    localStorage.setItem('userRole', role);
    window.location.reload();
  }
}
