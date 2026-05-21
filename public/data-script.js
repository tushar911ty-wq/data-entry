let allStudents = [];

document.addEventListener('DOMContentLoaded', () => {
    const password = sessionStorage.getItem('adminPassword');
    if (!password) {
        window.location.href = 'login.html';
        return;
    }
    
    fetchStudents(password);
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderStudents(e.target.value.toLowerCase());
        });
    }

    const generateDemoBtn = document.getElementById('generateDemoBtn');
    if (generateDemoBtn) {
        generateDemoBtn.addEventListener('click', generateFakeStudents);
    }
});

async function fetchStudents(password) {
    const tableBody = document.getElementById('studentTableBody');
    
    try {
        const response = await fetch('/api/students', {
            headers: {
                'x-admin-password': password
            }
        });
        
        if (response.status === 401) {
            alert('Incorrect password or session expired!');
            sessionStorage.removeItem('adminPassword');
            window.location.href = 'login.html';
            return;
        }
        
        if (!response.ok) throw new Error('Failed to fetch data');
        
        allStudents = await response.json();
        renderStudents('');
    } catch (error) {
        console.error('Error fetching students:', error);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red; padding: 40px;">Error loading data: ${error.message}</td></tr>`;
    }
}

function renderStudents(searchTerm) {
    const tableBody = document.getElementById('studentTableBody');
    
    if (allStudents.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No students found.</td></tr>';
        return;
    }
    
    const filteredStudents = allStudents.filter(student => {
        if (!searchTerm) return true;
        
        const date = new Date(student.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).toLowerCase();

        const searchableString = `
            ${student.personalInfo?.firstName || ''} 
            ${student.personalInfo?.lastName || ''} 
            ${student.personalInfo?.email || ''} 
            ${student.personalInfo?.phone || ''} 
            ${student.personalInfo?.country || ''} 
            ${student.academicInfo?.studentId || ''} 
            ${student.academicInfo?.collegeName || ''} 
            ${student.academicInfo?.course || ''} 
            ${student.academicInfo?.year || ''} 
            ${student.addressInfo?.city || ''} 
            ${student.addressInfo?.state || ''} 
            ${student.addressInfo?.zipCode || ''}
            ${date}
        `.toLowerCase();
        
        // Split search term by spaces and check if ALL parts match
        const searchTerms = searchTerm.split(' ').filter(term => term.trim() !== '');
        return searchTerms.every(term => searchableString.includes(term));
    });

    if (filteredStudents.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No matching students found.</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    filteredStudents.forEach(student => {
        const row = document.createElement('tr');
        
        const date = new Date(student.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        row.innerHTML = `
            <td>${student.personalInfo.firstName} ${student.personalInfo.lastName}</td>
            <td><span class="status-pill">${student.academicInfo.studentId}</span></td>
            <td>${student.academicInfo.course}</td>
            <td>${student.academicInfo.year}</td>
            <td>${student.addressInfo.city}</td>
            <td>${student.personalInfo.country}</td>
            <td>${date}</td>
        `;
        tableBody.appendChild(row);
    });
}

async function generateFakeStudents() {
    const firstNames = ["Rahul","Amit","Priya","Sneha","Rohit","Anjali","Vikas","Pooja","Arjun","Neha"];
    const lastNames = ["Sharma","Yadav","Patel","Singh","Verma","Gupta","Kumar","Mishra","Jain","Joshi"];
    const colleges = ["IIT Delhi","NIT Bhopal","SCA College","XYZ University","ABC Institute"];
    const courses = ["BCA","MCA","B.Tech","MBA","B.Com"];
    const locations = [
        { country: "India", state: "Delhi", city: "Delhi" },
        { country: "India", state: "Maharashtra", city: "Mumbai" },
        { country: "India", state: "Madhya Pradesh", city: "Bhopal" },
        { country: "India", state: "Madhya Pradesh", city: "Indore" },
        { country: "India", state: "Maharashtra", city: "Pune" },
        { country: "India", state: "Karnataka", city: "Bengaluru" },
        { country: "India", state: "Tamil Nadu", city: "Chennai" },
        { country: "India", state: "West Bengal", city: "Kolkata" },
        { country: "India", state: "Telangana", city: "Hyderabad" },
        { country: "India", state: "Gujarat", city: "Ahmedabad" },
        { country: "India", state: "Rajasthan", city: "Jaipur" },
        { country: "India", state: "Uttar Pradesh", city: "Lucknow" },
        { country: "India", state: "Bihar", city: "Patna" },
        { country: "India", state: "Punjab", city: "Amritsar" },
        { country: "India", state: "Haryana", city: "Gurgaon" },
        { country: "India", state: "Kerala", city: "Kochi" },
        { country: "India", state: "Assam", city: "Guwahati" },
        { country: "India", state: "Odisha", city: "Bhubaneswar" },
        { country: "India", state: "Goa", city: "Panaji" }
    ];

    let students = [];
    const count = 1000; 
    
    const btn = document.getElementById('generateDemoBtn');
    btn.disabled = true;
    btn.innerText = `Generating ${count} students...`;

    for (let i = 1; i <= count; i++) {
        // Generate a random date within the last 30 days
        const randomDays = Math.floor(Math.random() * 30);
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - randomDays);

        const randomLoc = locations[Math.floor(Math.random() * locations.length)];

        let student = {
            personalInfo: {
                firstName: firstNames[Math.floor(Math.random()*firstNames.length)],
                lastName: lastNames[Math.floor(Math.random()*lastNames.length)],
                email: `student${Date.now()}_${i}@gmail.com`,
                phone: `+91 ${9000000000 + i}`,
                country: randomLoc.country
            },
            academicInfo: {
                studentId: `STD${1000+i}`,
                collegeName: colleges[Math.floor(Math.random()*colleges.length)],
                course: courses[Math.floor(Math.random()*courses.length)],
                year: Math.floor(Math.random()*4)+1
            },
            addressInfo: {
                city: randomLoc.city,
                state: randomLoc.state,
                zipCode: `${100000 + i}`
            },
            createdAt: randomDate
        };

        students.push(student);
    }

    // Send all students to backend one by one
    let insertedCount = 0;
    for (let student of students) {
        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });

            if(response.ok){
                insertedCount++;
                if (insertedCount % 10 === 0) { // Update text every 10 to reduce UI lag
                    btn.innerText = `Generated ${insertedCount}/${count}...`;
                }
            }

        } catch(err){
            console.error(err);
        }
    }

    alert(`${insertedCount} fake students inserted!`);
    btn.innerText = "Generate Demo Data";
    btn.disabled = false;
    
    // Refresh list
    const password = sessionStorage.getItem('adminPassword');
    fetchStudents(password);
}

