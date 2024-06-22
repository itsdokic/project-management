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
    const decodedToken = jwtDecode(jwtToken);
    const role = decodedToken.role
    console.log(jwtToken)
    const id = sessionStorage.getItem('projectID')

    const res = await fetch('/projects/editProject/getData', {
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
        const name = document.getElementById('name')
        const start_date = document.getElementById('start_date')
        const end_date = document.getElementById('end_date')
        const description = document.getElementById('description')

        if (role === "Admin") {
            const manager = document.getElementById('manager')
            manager.value = data.manager
        }

        name.value = data.name
        start_date.value = formatTheDate(data.start_date)
        end_date.value = formatTheDate(data.end_date)
        description.value = data.description
    }

})


const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const jwtToken = localStorage.getItem('jwt')
    console.log(jwtToken)
    const decodedToken = jwtDecode(jwtToken);
    const role = decodedToken.role
    const id = sessionStorage.getItem('projectID')
    sessionStorage.removeItem('projectID')
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

    const res = await fetch('/projects/editProject', {
        method: 'POST',
        body: JSON.stringify({id, name, start_date, end_date, manager, description}),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })

    const info = await res.json();

    if (info.err) {
        alert('Greška prilikom uređivanja projekta')
    }
    else {
        alert('Uspješno ste uredili projekat')
        if (role === "Admin") {
            location.assign('/admin/projects')
        }
        else if (role === "Manager") {
            location.assign('/manager/projects')
        }
    }

});