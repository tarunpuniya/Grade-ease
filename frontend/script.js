document.addEventListener('DOMContentLoaded', function() {
    // Basic elements jo pehle bhi the
    const welcomeText = document.getElementById('welcomeText');
    const roleSelection = document.getElementById('roleSelection');
    const teacherLoginForm = document.getElementById('teacherLoginForm');
    const studentLoginForm = document.getElementById('studentLoginForm');

    // Naye elements jo student OTP form se aayenge
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const resendLink = document.getElementById('resendLink');
    const emailStep = document.getElementById('emailStep');
    const otpStep = document.getElementById('otpStep');

    // Role selection aur animation function (Same as before)
    function showLoginForm(formElement, welcomeMsg) {
        roleSelection.classList.add('role-hidden');
        setTimeout(() => {
            roleSelection.style.display = 'none';
            formElement.style.display = 'block';
            requestAnimationFrame(() => {
                formElement.classList.add('form-active');
            });
            welcomeText.textContent = welcomeMsg;
        }, 300); 
    }
    

    document.getElementById('teacherBtn').addEventListener('click', () => showLoginForm(teacherLoginForm, 'Welcome, Faculty!'));
    document.getElementById('studentBtn').addEventListener('click', () => showLoginForm(studentLoginForm, 'Welcome, Student!'));

    
    // ------------------------------------------------------------------
    // 1. Teacher Login (Password-based - /api/login)
    // ------------------------------------------------------------------
    teacherLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('teacherEmail').value;
        const password = document.getElementById('teacherPassword').value;

        if (!email || !password) return alert('Please enter both email and password.');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password }) 
            });

            const data = await response.json();

            if (data.success) {
                alert('Teacher Login Successful! Redirecting...');
                setTimeout(() => window.location.href = data.redirectUrl, 600); 
            } else {
                alert(data.message || 'Login failed! Check credentials.');
            }
        } catch (error) {
            console.error('Teacher Login Fetch error:', error);
            alert('Server connection error. Is server.js running?');
        }
    });

    // ------------------------------------------------------------------
    // 2. Student OTP Process (Step 1: Send OTP - /api/send-otp)
    // ------------------------------------------------------------------
    sendOtpBtn.addEventListener('click', async () => {
        const email = document.getElementById('studentEmail').value;
        if (!email) return alert('Please enter your email.');

        try {
            sendOtpBtn.disabled = true;
            sendOtpBtn.textContent = 'Sending...';

            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });
            
            const data = await response.json();

            if (data.success) {
                alert('OTP sent successfully. Check your inbox.');
                // UI change: Email field chhupao, OTP field dikhao
                emailStep.style.display = 'none';
                otpStep.style.display = 'block';
            } else {
                alert(data.message || 'Failed to send OTP. Check console for details.');
                sendOtpBtn.disabled = false;
                sendOtpBtn.textContent = 'Send OTP';
            }
        } catch (error) {
            console.error('Send OTP network error:', error);
            alert('A network error occurred. Server down?');
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = 'Send OTP';
        }
    });

    // ------------------------------------------------------------------
    // 3. Student OTP Process (Step 2: Verify OTP and Login - /api/verify-otp)
    // ------------------------------------------------------------------
    studentLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('studentEmail').value;
        const otp = document.getElementById('studentOtp').value;

        if (otp.length !== 4) return alert('Please enter the 4-digit OTP.');

        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, otp: otp })
            });

            const data = await response.json();

            if (data.success) {
                alert('OTP Verified! Logging in...');
                setTimeout(() => window.location.href = data.redirectUrl, 300);
            } else {
                alert(data.message || 'OTP verification failed. Check OTP.');
            }
        } catch (error) {
            console.error('Verify OTP network error:', error);
            alert('Server connection error during verification.');
        }
    });
    
    // Resend Link functionality
    resendLink.addEventListener('click', (e) => {
        e.preventDefault();
        // UI ko wapas email step par le jaao
        emailStep.style.display = 'block';
        otpStep.style.display = 'none';
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = 'Send OTP';
    });

    // ----------------------------
    // Dashboard quick-actions
    // ----------------------------
    const dashboardSearch = document.getElementById('dashboard-search');
    const subjectList = document.getElementById('subject-list');
    const submitAssignmentBtn = document.getElementById('submit-assignment-btn');
    const payFeesBtn = document.getElementById('pay-fees-btn');

    if (dashboardSearch && subjectList) {
        dashboardSearch.addEventListener('input', (e) => {
            const q = e.target.value.trim().toLowerCase();
            const cards = Array.from(subjectList.querySelectorAll('.dashboard-card'));
            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(q) ? '' : 'none';
            });
        });
    }

    if (submitAssignmentBtn) {
        submitAssignmentBtn.addEventListener('click', () => {
            // open local assignment submission UI or page
            window.location.href = 'assignment_submission.html';
        });
    }

    if (payFeesBtn) {
        payFeesBtn.addEventListener('click', () => {
            window.location.href = 'payment.html';
        });
    }
});