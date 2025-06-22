// // Initialize database if not exists
// if (!localStorage.getItem('university_it_db')) {
//   const db = {
//       users: [
//           {
//               id: '1',
//               email: 'admin@tu.edu',
//               password: 'admin123',
//               type: 'admin',
//               name: 'Admin User'
//           },
//           {
//               id: '2',
//               email: 'professor@tu.edu',
//               password: '123',
//               type: 'faculty',
//               name: 'Professor Smith'
//           },
//           {
//               id: '3',
//               email: 'student@tu.edu',
//               password: '123',
//               type: 'student',
//               name: 'John Doe'
//           }
//       ],
//       complaints: [
//           {
//               id: '1001',
//               title: 'WiFi not working in library',
//               category: 'network',
//               urgency: 'high',
//               description: 'Cannot connect to Eduroam on the 3rd floor of the library',
//               status: 'pending',
//               date: '2023-05-15',
//               submittedBy: '3',
//               attachment: null
//           },
//           {
//               id: '1002',
//               title: 'Projector not working',
//               category: 'hardware',
//               urgency: 'medium',
//               description: 'Projector in room B203 keeps turning off',
//               status: 'in progress',
//               date: '2023-05-10',
//               submittedBy: '2',
//               attachment: 'projector_issue.jpg'
//           }
//       ]
//   };
//   localStorage.setItem('university_it_db', JSON.stringify(db));
// }

// // Load database
// const db = JSON.parse(localStorage.getItem('university_it_db'));


// new update with the above code //
// Initialize database if not exists
if (!localStorage.getItem('university_it_db')) {
    const db = {
        users: [
            {
                id: '1',
                name: 'Admin User',
                email: 'admin@university.edu',
                password: 'admin123',
                type: 'admin',
                universityId: 'ADM001',
                department: 'IT',
                status: 'approved',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Professor Smith',
                email: 'professor@university.edu',
                password: 'prof123',
                type: 'faculty',
                universityId: 'FAC002',
                department: 'Computer Science',
                status: 'approved',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'John Doe',
                email: 'student@university.edu',
                password: 'student123',
                type: 'student',
                universityId: 'STU003',
                department: 'Engineering',
                status: 'approved',
                createdAt: new Date().toISOString()
            }
        ],
        complaints: [
            {
                id: '1001',
                title: 'WiFi not working in library',
                category: 'network',
                urgency: 'high',
                description: 'Cannot connect to Eduroam on the 3rd floor of the library',
                status: 'pending',
                date: new Date().toLocaleDateString(),
                submittedBy: '3',
                attachment: null,
                updates: [],
                createdAt: new Date().toISOString()
            }
        ]
    };
    localStorage.setItem('university_it_db', JSON.stringify(db));
}

// Load database
const db = JSON.parse(localStorage.getItem('university_it_db'));

// Initialize file uploads if not exists
if (!localStorage.getItem('file_uploads')) {
    localStorage.setItem('file_uploads', JSON.stringify({}));
}