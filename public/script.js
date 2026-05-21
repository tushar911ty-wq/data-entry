let currentStep = 1;
const totalSteps = 3;

// DOM Elements
const studentForm = document.getElementById('studentForm');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progress = document.getElementById('progress');
const steps = document.querySelectorAll('.step');
const tabs = document.querySelectorAll('.tab');
const successModal = document.getElementById('successModal');
const countrySelect = document.getElementById('country');
const phonePrefix = document.getElementById('phonePrefix');

// Initialize

// Update Phone Prefix on Country Change
countrySelect.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const code = selectedOption.getAttribute('data-code');
    phonePrefix.innerText = code;
});

// Event Listeners
nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateForm();
        } else {
            submitForm();
        }
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateForm();
    }
});

function updateForm() {
    // Show/Hide Tabs
    tabs.forEach((tab, index) => {
        tab.style.display = (index + 1 === currentStep) ? 'block' : 'none';
        
        // Animation
        if (index + 1 === currentStep) {
            tab.style.animation = 'fadeIn 0.5s ease';
        }
    });

    // Update Buttons
    prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
    nextBtn.innerText = currentStep === totalSteps ? 'Submit Registration' : 'Next Step';

    // Update Progress Bar
    const percent = ((currentStep - 1) / (totalSteps - 1)) * 66 + 33; // Starts at 33%, ends at 100%
    progress.style.width = `${percent}%`;

    // Update Step Indicators
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            step.classList.add('active');
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
        }
    });
}

function validateStep(step) {
    const currentTab = document.getElementById(`step-${step}`);
    const inputs = currentTab.querySelectorAll('input, select');
    let valid = true;

    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();
            valid = false;
        }
    });

    return valid;
}

async function submitForm() {
    const formData = new FormData(studentForm);
    const data = {
        personalInfo: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: phonePrefix.innerText + ' ' + formData.get('phone'),
            country: formData.get('country')
        },
        academicInfo: {
            studentId: formData.get('studentId'),
            collegeName: formData.get('collegeName'),
            course: formData.get('course'),
            year: formData.get('year')
        },
        addressInfo: {
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode')
        }
    };

    // Show loading state on button
    nextBtn.disabled = true;
    nextBtn.innerText = 'Processing...';

    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            successModal.style.display = 'flex';
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
            nextBtn.disabled = false;
            nextBtn.innerText = 'Submit Registration';
        }
    } catch (err) {
        console.error('Submission error:', err);
        alert('Could not connect to the server. Please ensure the backend is running.');
        nextBtn.disabled = false;
        nextBtn.innerText = 'Submit Registration';
    }
}


// Simple FadeIn Animation Keyframe added dynamically
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(10px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(style);

// Demo Autofill Feature
const demoProfiles = [
    {
        firstName: "Rahul",
        lastName: "Sharma",
        email: "rahul.sharma@gmail.com",
        country: "India",
        phone: "9876543210",
        studentId: "STD1001",
        collegeName: "IIT Delhi",
        course: "BCA",
        year: "1st Year",
        city: "Delhi",
        state: "Delhi",
        zipCode: "110001"
    },
    {
        firstName: "Pooja",
        lastName: "Mishra",
        email: "pooja.mishra@gmail.com",
        country: "India",
        phone: "9876543211",
        studentId: "STD1002",
        collegeName: "NIT Bhopal",
        course: "MCA",
        year: "2nd Year",
        city: "Bhopal",
        state: "MP",
        zipCode: "462001"
    },
    {
        firstName: "Amit",
        lastName: "Patel",
        email: "amit.patel@gmail.com",
        country: "India",
        phone: "9876543212",
        studentId: "STD1003",
        collegeName: "SCA College",
        course: "B.Tech",
        year: "3rd Year",
        city: "Indore",
        state: "MP",
        zipCode: "452001"
    }
];

const firstNameInput = document.getElementById('firstName');
if (firstNameInput) {
    firstNameInput.addEventListener('input', (e) => {
        const val = e.target.value;
        const profile = demoProfiles.find(p => p.firstName.toLowerCase() === val.toLowerCase());
        if (profile) {
            // Autofill!
            document.getElementById('lastName').value = profile.lastName;
            document.getElementById('email').value = profile.email;
            
            const countrySelect = document.getElementById('country');
            countrySelect.value = profile.country;
            // Trigger change event to update prefix
            countrySelect.dispatchEvent(new Event('change'));
            
            document.getElementById('phone').value = profile.phone;
            document.getElementById('studentId').value = profile.studentId;
            document.getElementById('collegeName').value = profile.collegeName;
            document.getElementById('course').value = profile.course;
            document.getElementById('year').value = profile.year;
            document.getElementById('city').value = profile.city;
            document.getElementById('state').value = profile.state;
            document.getElementById('zipCode').value = profile.zipCode;
            
            alert(`Demo profile for ${profile.firstName} found! Form has been autofilled.`);
        }
    });
}
