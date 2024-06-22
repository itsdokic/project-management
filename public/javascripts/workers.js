async function deleteRow(id, jwtToken) {
    const res = await fetch('/workers/deleteWorker', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })
}

function searchWorkers(e) {
    e.preventDefault();

    var search_input = document.getElementById('search_input');
    var table = document.getElementById('workers');
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

    const res = await fetch('/workers/getData', {
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

        var table = document.getElementById('workers')

        for (var i = 0; i < data.length; i++) {
            var tr = document.createElement('tr')
            var row = data[i]


            for (var j = 0; j < Object.keys(data[i]).length; j++) {
                var td = document.createElement('td')
                var keys = Object.keys(row)
                var key = keys[j]
                var value = row[key]
                if (value === '' || value === 0) {
                    value = '/'
                }

                var text = document.createTextNode(value)

                td.appendChild(text)
                tr.appendChild(td)
            }


            var edit_button = document.createElement("button")
            edit_button.classList.add("edit_button")
            edit_button.id = i + 1
            edit_button.innerHTML = "<ion-icon class='edit_icon' name=\"create-outline\"></ion-icon>"
            td = document.createElement('td')
            td.appendChild(edit_button)
            tr.appendChild(td)

            edit_button.addEventListener('click', function () {
                var row = this.parentNode
                row = row.parentNode
                const rowData = row.getElementsByTagName('td')
                const id = rowData[0].textContent
                sessionStorage.setItem('workerID', id)
                if (decodedToken.role === "Admin") {
                    location.assign('/admin/workers/editWorker')
                }
                else if (decodedToken.role === "Manager") {
                    location.assign('/manager/workers/editWorker')
                }
            })


            if (role === "Admin") {
                var delete_button = document.createElement("button")
                delete_button.classList.add("delete_button")
                delete_button.id = i + 1
                delete_button.innerHTML = "<ion-icon class='delete_icon' name=\"trash-outline\"></ion-icon>"
                td.appendChild(delete_button)
                tr.appendChild(td)

                delete_button.addEventListener('click', function() {
                    var row = this.parentNode
                    row = row.parentNode
                    const rowData = row.getElementsByTagName('td')
                    const id = rowData[0].textContent
                    deleteRow(id, jwtToken);
                    row.parentNode.removeChild(row)
                });
            }

            table.appendChild(tr)
        }
    }

})
