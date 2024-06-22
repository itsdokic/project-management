function formatTheDate(x) {
    var date = new Date(x);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    const formattedDate = day + "." + month + "." + year + "."
    return formattedDate
}


function searchLog(e) {
    e.preventDefault();

    var search_input = document.getElementById('search_input');
    var table = document.getElementById('logs');
    var rows = table.getElementsByTagName('tr');

    var filter = search_input.value.toLowerCase();

    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var data = row.innerText.toLowerCase();

        if (data.includes(filter)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
};


document.addEventListener('DOMContentLoaded', async function() {
    const jwtToken = localStorage.getItem('jwt')
    const decodedToken = jwtDecode(jwtToken);
    const role = decodedToken.role
    const id = decodedToken.id
    console.log(jwtToken)

    const res = await fetch('/logs/getData', {
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
        data = data.data

        var table = document.getElementById('logs')

        for (var i = 0; i < data.length; i++) {
            var tr = document.createElement('tr')
            var row = data[i]

            data[i].date = formatTheDate(data[i].date)

            for (var j = 0; j < Object.keys(data[i]).length; j++) {
                var td = document.createElement('td')
                var keys = Object.keys(row)
                var key = keys[j]
                var value = row[key]

                var text = document.createTextNode(value)

                td.appendChild(text)
                tr.appendChild(td)
            }

            table.appendChild(tr)
        }
    }

})
