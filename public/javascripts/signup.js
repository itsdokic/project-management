const form = document.querySelector('form');
var form_size = document.getElementById('form');
const first_nameError = document.querySelector('.first_name.error');
const last_nameError = document.querySelector('.last_name.error');
const emailError = document.querySelector('.email.error');
const numberError = document.querySelector('.number.error');
const genderError = document.querySelector('.gender.error');
const password1Error = document.querySelector('.password1.error');
const password2Error = document.querySelector('.password2.error');
const password3Error = document.querySelector('.password3.error');
const password4Error = document.querySelector('.password4.error');

function getErrors(first_name, last_name, email, number, gender, password) {

    const errors = {
        first_name: '',
        last_name: '',
        email: '',
        number: '',
        gender: '',
        password1: '',
        password2: '',
        password3: '',
        password4: '',
        error: false
    }

    if (first_name.length > 50) {
        errors.error = true
        errors.first_name = 'Predugačko ime'
    }
    else if (first_name.length < 2) {
        errors.error = true
        errors.first_name = 'Nevažeći unos'
    }
    if (last_name.length > 100) {
        errors.error = true
        errors.last_name = 'Predugačko prezime'
    }
    else if (last_name.length < 2) {
        errors.error = true
        errors.last_name = 'Nevažeći unos'
    }
    if (email === '') {
        errors.error = true
        errors.email = 'Nevažeći unos'
    }
    if (number.length > 50 || number.length < 9) {
        errors.error = true
        errors.number = 'Nevažeći broj telefona'
    }
    if (gender === '') {
        errors.error = true
        errors.gender = 'Molimo odaberite spol'
    }

    if (password.length < 8) {
        errors.error = true
        errors.password1 = 'Password mora sadržavati minimalno 8 karaktera'
    }

    var upperCaseLetters = /[A-Z]/g;
    if (!password.match(upperCaseLetters)) {
        errors.error = true
        errors.password2 = 'Password mora sadržavati barem jedno veliko slovo'
    }

    var lowerCaseLetters = /[a-z]/g;
    if (!password.match(lowerCaseLetters)) {
        errors.error = true
        errors.password3 = 'Password mora sadržavati barem jedno malo slovo'
    }

    var numbers = /[0-9]/g;
    if (!password.match(numbers)) {
        errors.error = true
        errors.password4 = 'Password mora sadržavati barem jedan broj'
    }

    return errors;
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const first_name = form.first_name.value;
    const last_name = form.last_name.value;
    const email = form.email.value;
    const number = form.number.value;
    const gender = form.gender.value;
    const password = form.password.value;

    const errors = getErrors(first_name, last_name, email, number, gender, password)

    if (errors.error === true) {
        first_nameError.textContent = errors.first_name;
        last_nameError.textContent = errors.last_name;
        emailError.textContent = errors.email;
        numberError.textContent = errors.number;
        genderError.textContent = errors.gender;
        password1Error.textContent = errors.password1;
        password2Error.textContent = errors.password2;
        password3Error.textContent = errors.password3;
        password4Error.textContent = errors.password4;
        var n = 0
        var n2 = 0
        if (errors.first_name !== '') {
            n = n + 1
        }
        if (errors.last_name !== '') {
            n = n + 1
        }
        if (errors.email !== '') {
            n = n + 1
        }
        if (errors.number !== '') {
            n = n + 1
        }
        if (errors.gender !== '') {
            n = n + 1
        }
        if (errors.password1 !== '') {
            n = n + 1
        }
        if (errors.password2 !== '') {
            n = n + 1
        }
        if (errors.password3 !== '') {
            n = n + 1
        }
        if (errors.password4 !== '') {
            n = n + 1
        }
        n2 = n
        n2 = n * 10
        n = n * 16
        n = 700 + n
        form_size.style.height = n + "px";
        form_size.style.marginBottom = n2 + "px";
    }
    else {
        const res = await fetch('/signup', {
            method: 'POST',
            body: JSON.stringify({first_name, last_name, email, number, gender, password}),
            headers: {'Content-Type': 'application/json'}
        })

        const data = await res.json();

        if (data.errors) {
            first_nameError.textContent = data.errors.first_name;
            last_nameError.textContent = data.errors.last_name;
            emailError.textContent = data.errors.email;
            numberError.textContent = data.errors.number;
            genderError.textContent = data.errors.gender;
            password1Error.textContent = data.errors.password1;
            password2Error.textContent = data.errors.password2;
            password3Error.textContent = data.errors.password3;
            password4Error.textContent = data.errors.password4;
        }
        else {
            localStorage.setItem('jwt', data.token);
            location.assign('/worker/project');
        }

    }
})