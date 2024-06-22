function formatTime(time) {

    var hours = time.getHours();
    if (hours < 10) {
        hours = "0" + hours
    }
    var minutes = time.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    var seconds = time.getSeconds();
    if (seconds < 10) {
        seconds = "0" + seconds
    }

    const formattedTime = hours + ":" + minutes + ":" + seconds
    return formattedTime
}

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

function formatTheDate2(x) {
    var date = new Date(x);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    const formattedDate = day + "." + month + "." + year + "."
    return formattedDate
}

function startWorkTime() {
    var workStartTime = new Date();
    localStorage.setItem('workStartTime', workStartTime)
    workStartTime = formatTime(workStartTime)

    document.getElementById('start_info').innerText = "Radno vrijeme započeto u: " + workStartTime
}

async function endWorkTime() {

    var workStartTime = localStorage.getItem('workStartTime')
    workStartTime = new Date(workStartTime)
    var workEndTime = new Date();


    const timeDifferenceMs = workEndTime - workStartTime;
    var timeDifferenceS = Math.floor(timeDifferenceMs / 1000);
    var timeDifferenceM = Math.floor(timeDifferenceS / 60);
    var timeDifferenceH = Math.floor(timeDifferenceM / 60);

    if (timeDifferenceS >= 30) {
        timeDifferenceM = timeDifferenceM + 1
    }
    if (timeDifferenceM >= 30) {
        timeDifferenceH = timeDifferenceH + 1
    }

    const jwtToken = localStorage.getItem('jwt')
    const decodedToken = jwtDecode(jwtToken);
    const id = decodedToken.id
    workStartTime = formatTime(workStartTime)
    workEndTime = formatTime(workEndTime)
    var date = new Date()
    date = formatTheDate(date)


    const res = await fetch('/workHours/addWorkHours', {
        method: 'POST',
        body: JSON.stringify({ id, workStartTime, workEndTime, timeDifferenceH, date }),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })

    var info = await res.json();

    if (info.err) {
        alert('Greška prilikom dodavanja radnih sati')
    }
    else {
        alert('Završili ste radno vrijeme')
        localStorage.removeItem('workStartTime')
        location.reload()
    }
}


async function addWorkHours(e) {
    e.preventDefault();

    const jwtToken = localStorage.getItem('jwt')
    const decodedToken = jwtDecode(jwtToken);
    const id = decodedToken.id
    const form = document.querySelector('form');
    const input = form.workTime.value;
    const parts = input.split('#');

    const workStartTime = "09:00:00"
    const date = parts[2]
    var timeDifferenceH = parts[3]
    timeDifferenceH = Number(timeDifferenceH);
    const workEndTime = 9 + timeDifferenceH + ":" + "00:00"


    const res = await fetch('/workHours/addWorkHours', {
        method: 'POST',
        body: JSON.stringify({ id, workStartTime, workEndTime, timeDifferenceH, date }),
        headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`}
    })

    var info = await res.json();

    if (info.err) {
        alert('Greška prilikom dodavanja radnih sati! Provjerite format unosa')
    }
    else {
        alert('Uspješno ste dodali radne sate!')
        location.reload()
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    const jwtToken = localStorage.getItem('jwt')
    const decodedToken = jwtDecode(jwtToken);
    const id = decodedToken.id
    console.log(jwtToken)

    const res = await fetch('/workHours/workerGetData', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`}
    })


    if (!res.ok) {
        localStorage.removeItem('jwt');
        location.assign('/login')
    }
    else {
        var data = await res.json();

        document.getElementById('hours_spent_info').innerText = "UTROŠENI RADNI SATI NA PROJEKTU: " + data.hours_spent.hours_spent
        data = data.work_hours

        var table = document.getElementById('workHours')

        for (var i = 0; i < data.length; i++) {
            var tr = document.createElement('tr')
            var row = data[i]

            data[i].date = formatTheDate2(data[i].date)

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