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

async function endTask(id, jwtToken) {

    const res = await fetch('/tasks/endTask', {
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


            if (data[i].status !== "Završen") {
                var td = document.createElement('td')
                var end_task_button = document.createElement("button")
                end_task_button.id = i + 1
                end_task_button.innerText = "Završi task"
                td.appendChild(end_task_button)
                tr.appendChild(td)

                end_task_button.addEventListener('click', function() {
                    var row = this.parentNode
                    row = row.parentNode
                    const rowData = row.getElementsByTagName('td')
                    const id = rowData[0].textContent
                    endTask(id, jwtToken);
                    location.reload();
                });
            }


            if (data[i].status === "Aktivan") {
                tr.classList.add("active");
                end_task_button.classList.add("active_end_task_button")
            }
            else if (data[i].status === "Kasni") {
                tr.classList.add("late");
                end_task_button.classList.add("late_end_task_button")
            }
            else {
                tr.classList.add("finished")
                var td = document.createElement('td')
                var empty = document.createTextNode("")
                td.appendChild(empty)
                tr.appendChild(td)
            }


            table.appendChild(tr)
        }
    }

})
