document.addEventListener('DOMContentLoaded', async function() {
    var data = sessionStorage.getItem('data')
    data = JSON.parse(data);

    const first_name = document.getElementById('first_name')
    const last_name = document.getElementById('last_name')
    const email = document.getElementById('email')
    const number = document.getElementById('number')
    const password = document.getElementById('password')

    first_name.value = data.first_name
    last_name.value = data.last_name
    email.value = data.email
    number.value = data.number
    password.value = "********"

})


const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const jwtToken = localStorage.getItem('jwt')
    console.log(jwtToken)
    const decodedToken = jwtDecode(jwtToken);
    const role = decodedToken.role
    const id = decodedToken.id
    const first_name = form.first_name.value;
    const last_name = form.last_name.value;
    const email = form.email.value;
    const number = form.number.value;
    const password = form.password.value

    const res = await fetch('/user/edit', {
        method: 'POST',
        body: JSON.stringify({ id, first_name, last_name, email, number, password }),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })

    const info = await res.json();

    if (info.err) {
        alert('Greška prilikom uređivanja korisničkog računa')
    }
    else {
        alert('Uspješno ste uredili korisnički račun')
        if (role === "Admin") {
            location.assign('/admin/user')
        }
        else if (role === "Manager") {
            location.assign('/manager/user')
        }
        else if (role === "Worker") {
            location.assign('/worker/user')
        }
    }

});