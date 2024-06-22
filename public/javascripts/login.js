const form = document.querySelector('form');
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    const res = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: {'Content-Type': 'application/json'}
    })

    const data = await res.json();
    console.log(data)

    if (data.errors) {
        emailError.textContent = data.errors.email;
        passwordError.textContent = data.errors.password;
    }
    else {
        localStorage.setItem('jwt', data.token);
        const decodedToken = jwtDecode(data.token);
        const role = decodedToken.role
        if (role === "Admin") {
            location.assign('/admin/projects');
        }
        else if (role === "Manager") {
            location.assign('/manager/projects');
        }
        else if (role === "Worker") {
            location.assign('/worker/project');
        }
    }

})