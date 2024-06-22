document.addEventListener('DOMContentLoaded', async function() {
    const jwtToken = localStorage.getItem('jwt')
    console.log(jwtToken)
    const id = sessionStorage.getItem('workerID')

    const res = await fetch('/workers/editWorker/getData', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })

    var data = await res.json();
    data = data.data[0]

    if (data.err) {
        location.reload();
    }
    else {
        const project = document.getElementById('project')
        const supervisor = document.getElementById('supervisor')

        project.value = data.project
        supervisor.value = data.supervisor
    }

})


const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const jwtToken = localStorage.getItem('jwt')
    console.log(jwtToken)
    const decodedToken = jwtDecode(jwtToken);
    const role = decodedToken.role
    const id = sessionStorage.getItem('workerID')
    sessionStorage.removeItem('workerID')
    const project = form.project.value
    const supervisor = form.supervisor.value

    const res = await fetch('/workers/editWorker', {
        method: 'POST',
        body: JSON.stringify({ id, project, supervisor }),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })

    const info = await res.json();

    if (info.err) {
        alert('Greška prilikom uređivanja radnika')
    }
    else {
        alert('Uspješno ste uredili radnika')
        if (role === "Admin") {
            location.assign('/admin/workers')
        }
        else if (role === "Manager") {
            location.assign('/manager/workers')
        }
    }

});