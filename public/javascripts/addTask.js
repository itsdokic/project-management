document.addEventListener('DOMContentLoaded', async function() {
    const jwtToken = localStorage.getItem('jwt')
    console.log(jwtToken)

    const res = await fetch('/tasks/addTask/jwtAuth', {
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
    const project_id = form.project_id.value;
    const name = form.name.value;
    const end_date = form.end_date.value;
    const responsible_worker = form.responsible_worker.value;


    const res = await fetch('/tasks/addTask', {
        method: 'POST',
        body: JSON.stringify({ project_id, name, end_date, responsible_worker }),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })

    const info = await res.json();

    if (info.err) {
        alert('Greška prilikom dodavanja taska')
    }
    else {
        alert('Uspješno ste dodali novi task')
        if (role === "Admin") {
            location.assign('/admin/tasks')
        }
        else if (role === "Manager") {
            location.assign('/manager/tasks')
        }
    }

});