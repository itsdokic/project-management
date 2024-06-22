document.addEventListener('DOMContentLoaded', async function() {
    const jwtToken = localStorage.getItem('jwt')
    console.log(jwtToken)

    const res = await fetch('/projects/addProject/jwtAuth', {
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
    const decodedToken = jwtDecode(jwtToken);
    const role = decodedToken.role
    const name = form.name.value;
    const start_date = form.start_date.value;
    const end_date = form.end_date.value;
    const description = form.description.value;

    if (decodedToken.role === "Admin") {
        var manager = form.manager.value;
    }
    else {
        var manager = decodedToken.id;
    }

    const res = await fetch('/projects/addProject', {
        method: 'POST',
        body: JSON.stringify({name, start_date, end_date, manager, description}),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })

    const info = await res.json();

    if (info.err) {
        alert('Greška prilikom dodavanja projekta')
    }
    else {
        alert('Uspješno ste dodali novi projekat')
        if (role === "Admin") {
            location.assign('/admin/projects')
        }
        else if (role === "Manager") {
            location.assign('/manager/projects')
        }
    }

});