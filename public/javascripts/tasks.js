function formatTheDate(x) {
    var date = new Date(x);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    const formattedDate = day + "." + month + "." + year + "."
    return formattedDate
}

function formatTheDate2(x) {
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

    const formattedDate = year + "-" + month + "-" + day
    return formattedDate
}

async function deleteRow(id, jwtToken) {
    const res = await fetch('/tasks/deleteTask', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })
}

function searchTasks(e) {
    e.preventDefault();

    var search_input = document.getElementById('search_input');
    var table = document.getElementById('tasks');
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

    const res = await fetch('/tasks/getData', {
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

        var table = document.getElementById('tasks')

        for (var i = 0; i < data.length; i++) {
            var tr = document.createElement('tr')
            var row = data[i]

            var currentDate = formatTheDate2(new Date())
            var date = formatTheDate2(data[i].end_date)
            currentDate = new Date(currentDate)
            date = new Date(date)

            if (date < currentDate && data[i].status !== "Završen") {
                data[i].status = "Kasni"
            }

            data[i].end_date = formatTheDate(data[i].end_date)

            for (var j = 0; j < Object.keys(data[i]).length; j++) {
                var td = document.createElement('td')
                var keys = Object.keys(row)
                var key = keys[j]
                var value = row[key]
                if (value === '') {
                    value = '/'
                }

                var text = document.createTextNode(value)

                td.appendChild(text)
                tr.appendChild(td)
            }

            var edit_button = document.createElement("button")
            edit_button.id = i + 1
            edit_button.innerHTML = "<ion-icon class='edit_icon' name=\"create-outline\"></ion-icon>"
            td = document.createElement('td')
            td.appendChild(edit_button)
            tr.appendChild(td)

            edit_button.addEventListener('click', function () {
                var row = this.parentNode
                row = row.parentNode
                const rowData = row.getElementsByTagName('td')
                const id = rowData[1].textContent
                sessionStorage.setItem('taskID', id)
                if (decodedToken.role === "Admin") {
                    location.assign('/admin/tasks/editTask')
                }
                else if (decodedToken.role === "Manager") {
                    location.assign('/manager/tasks/editTask')
                }
            })


            var delete_button = document.createElement("button")
            delete_button.id = i + 1
            delete_button.innerHTML = "<ion-icon class='delete_icon' name=\"trash-outline\"></ion-icon>"
            td.appendChild(delete_button)
            tr.appendChild(td)

            delete_button.addEventListener('click', function() {
                var row = this.parentNode
                row = row.parentNode
                const rowData = row.getElementsByTagName('td')
                const id = rowData[1].textContent
                deleteRow(id, jwtToken);
                row.parentNode.removeChild(row)
            });


            if (data[i].status === "Aktivan") {
                tr.classList.add("active");
                edit_button.classList.add("active_edit_button")
                delete_button.classList.add("active_delete_button")
            }
            else if (data[i].status === "Kasni") {
                tr.classList.add("late");
                edit_button.classList.add("late_edit_button")
                delete_button.classList.add("late_delete_button")
                delete_button.innerHTML = "<ion-icon class='late_delete_icon' name=\"trash-outline\"></ion-icon>"
            }
            else {
                tr.classList.add("finished");
                edit_button.classList.add("finished_edit_button")
                delete_button.classList.add("finished_delete_button")
            }


            table.appendChild(tr)
        }
    }

})
