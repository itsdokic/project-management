function formatTheDate(x) {
    var date = new Date(x);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    const formattedDate = day + "." + month + "." + year + "."
    return formattedDate
}



document.addEventListener('DOMContentLoaded', async function() {
    const jwtToken = localStorage.getItem('jwt')
    const decodedToken = jwtDecode(jwtToken);
    const role = decodedToken.role
    const id = decodedToken.id
    console.log(jwtToken)

    const res = await fetch('/projects/getData', {
        method: 'POST',
        body: JSON.stringify({ role, id }),
        headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`}
    })


    if (!res.ok) {
        localStorage.removeItem('jwt');
        location.assign('/login')
    }
    else {
        var data = await res.json();
        data = data.data[0];

        const title = document.getElementById('title')
        const id = document.getElementById('id')
        const name = document.getElementById('name')
        const start_date = document.getElementById('start_date')
        const end_date = document.getElementById('end_date')
        const manager = document.getElementById('manager')
        const description = document.getElementById('description')

        data.start_date = formatTheDate(data.start_date)
        data.end_date = formatTheDate(data.end_date)

        title.innerText = data.name
        id.innerText = data.id
        start_date.innerText = data.start_date
        end_date.innerText = data.end_date
        manager.innerText = data.manager
        description.innerText = data.description
    }

})