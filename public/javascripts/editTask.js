function formatTheDate(x) {
    var date = new Date(x);

    var day = date.getDate();
    if (day < 10) {
        day = "0" + day
    }
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month
    }
    var year = date.getFullYear();

    date = year + "-" + month + "-" + day

    return date
}


document.addEventListener('DOMContentLoaded', async function() {
    const jwtToken = localStorage.getItem('jwt')
    console.log(jwtToken)
    const id = sessionStorage.getItem('taskID')

    const res = await fetch('/tasks/editTask/getData', {
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
        const project_id = document.getElementById('project_id')
        const name = document.getElementById('name')
        const end_date = document.getElementById('end_date')
        const responsible_worker = document.getElementById('responsible_worker')

        project_id.value = data.project_id
        name.value = data.name
        end_date.value = formatTheDate(data.end_date)
        responsible_worker.value = data.responsible_worker
    }

})


const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const jwtToken = localStorage.getItem('jwt')
    console.log(jwtToken)
    const decodedToken = jwtDecode(jwtToken);
    const role = decodedToken.role;
    const id = sessionStorage.getItem('taskID')
    sessionStorage.removeItem('taskID')
    const project_id = form.project_id.value
    const name = form.name.value
    const end_date = form.end_date.value
    const responsible_worker = form.responsible_worker.value

    const res = await fetch('/tasks/editTask', {
        method: 'POST',
        body: JSON.stringify({ id, project_id, name, end_date, responsible_worker }),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })

    const info = await res.json();

    if (info.err) {
        alert('Greška prilikom uređivanja taska')
    }
    else {
        alert('Uspješno ste uredili task')
        if (role === "Admin") {
            location.assign('/admin/tasks')
        }
        else if (role === "Manager") {
            location.assign('/manager/tasks')
        }
    }

});