document.addEventListener('DOMContentLoaded', async function() {
    const jwtToken = localStorage.getItem('jwt')
    console.log(jwtToken)

    const res = await fetch('/workers/addWorker/jwtAuth', {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })


    if (!res.ok) {
        localStorage.removeItem('jwt');
        location.assign('/login')
    }

})


const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const jwtToken = localStorage.getItem('jwt')
    console.log(jwtToken)

    const first_name = form.first_name.value;
    const last_name = form.last_name.value;
    const email = form.email.value;
    const number = form.number.value;
    const gender = form.gender.value;
    const password = form.password.value;

    const res = await fetch('/workers/addWorker', {
        method: 'POST',
        body: JSON.stringify({first_name, last_name, email, number, gender, password}),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })

    const info = await res.json();

    if (info.err) {
        alert('Greška prilikom dodavanja radnika')
    }
    else {
        alert('Uspješno ste dodali novog radnika')
        location.assign('/admin/workers')
    }

});