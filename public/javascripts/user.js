document.addEventListener('DOMContentLoaded', async function() {
    const jwtToken = localStorage.getItem('jwt')
    console.log(jwtToken)
    const decodedToken = jwtDecode(jwtToken);
    const userID = decodedToken.id
    console.log(userID)

    const res = await fetch('/user', {
        method: 'POST',
        body: JSON.stringify({ userID }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    })

    var data = await res.json();

    if (data.err) {
        location.reload()
    }
    else {
        const id = document.getElementById('id')
        const first_name = document.getElementById('first_name')
        const last_name = document.getElementById('last_name')
        const email = document.getElementById('email')
        const number = document.getElementById('number')
        const gender = document.getElementById('gender')
        const role = document.getElementById('role')

        data = data.data[0]
        const sData = JSON.stringify(data);
        sessionStorage.setItem('data', sData)

        id.innerText = data.id
        first_name.innerText = data.first_name
        last_name.innerText = data.last_name
        email.innerText = data.email
        number.innerText = data.number
        gender.innerText = data.gender
        role.innerText = data.role
    }

});