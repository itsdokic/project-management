function formatTheDate(x) {
    var date = new Date(x);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    const formattedDate = day + "." + month + "." + year + "."
    return formattedDate
}

async function deleteRow(id, jwtToken) {
    const res = await fetch('/projects/deleteProject', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })
}

function searchProjects(e) {
    e.preventDefault();

    var search_input = document.getElementById('search_input');
    var table = document.getElementById('projects');
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


function createPDF() {
    const jwtToken = localStorage.getItem('jwt')
    const decodedToken = jwtDecode(jwtToken);
    const role = decodedToken.role
    var projects = document.getElementById('table_div').innerHTML;

    if (role === "Admin") {
        var style = "<style>";
        style = style + "table {width: 100%;font: 17px Calibri;}";
        style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
        style = style + "padding: 2px 3px;text-align: center;}";
        style = style + "th:nth-child(7) {display: none;}";
        style = style + "td:nth-child(7) {display: none;}";
        style = style + "</style>";
    }
    else if (role === "Manager") {
        var style = "<style>";
        style = style + "table {width: 100%;font: 17px Calibri;}";
        style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
        style = style + "padding: 2px 3px;text-align: center;}";
        style = style + "th:nth-child(6) {display: none;}";
        style = style + "td:nth-child(6) {display: none;}";
        style = style + "</style>";
    }

    var win = window.open('', '', 'height=700,width=700');

    win.document.write('<html><head>');
    win.document.write('<title>Projekti</title>');
    win.document.write(style);
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(projects);
    win.document.write('</body></html>');

    win.document.close();

    win.print();
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
        data = data.data

        var table = document.getElementById('projects')

        for (var i = 0; i < data.length; i++) {
            var tr = document.createElement('tr')
            var row = data[i]

            data[i].start_date = formatTheDate(data[i].start_date)
            data[i].end_date = formatTheDate(data[i].end_date)

            for (var j = 0; j < Object.keys(data[i]).length; j++) {
                var td = document.createElement('td')
                var keys = Object.keys(row)
                var key = keys[j]
                var value = row[key]

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
                sessionStorage.setItem('projectID', id)
                if (decodedToken.role === "Admin") {
                    location.assign('/admin/projects/editProject')
                }
                else if (decodedToken.role === "Manager") {
                    location.assign('/manager/projects/editProject')
                }
            })


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

            table.appendChild(tr)
        }
    }

})
