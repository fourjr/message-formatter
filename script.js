var messages = [];
var names = [];

examples = [
    [
`1000 (Group 1)\t1100 (Group 2)\t1200 (Group 3)
Tom\tWilliam\tOliver
Liam\tJames\tHarry
\tElijah\t`,
`Hi {name},

We would like to meet you tomorrow, 2 March at {time}.

See you!`
    ],
    [
`11 May, 12 pm (Group 1)\t12 May, 10 am (Group 2)\t12 May, 3 pm (Group 3)
Emma\tMia\tAmelia
\t\tHarper
\t\tAmy`,
`Dear {name},

Please note the following details for your interview:
Date: *{date}*
Time: *{time}*
Location: Room B

Best regards`
    ]
]

$('textarea').keydown(function (e) {
    var keyCode = e.keyCode || e.which

    if (keyCode === $.ui.keyCode.TAB) {
        e.preventDefault()

        // The one-liner that does the magic
        document.execCommand('insertText', false, '\t')
    }
})

String.prototype.toTitleCase = function() {
    // Converts 'apple pie' to 'Apple Pie'
    return this.replace(
        /\w*/g,
        txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
}

function inputChange() {
    let val = $('#input-value').val()
    let messageFMT = $('#message-fmt').val()
    let table = $('#input-table')

    if (!val || !messageFMT) {
        $('.inputTable').css('display', 'none')
        $('.textAreaSingle').css('display', 'none')
        return
    }

    let splitVal = val.split('\n')

    table.html('')
    $('.inputTable').css('display', 'block')
    $('.textAreaSingle').css('display', 'block')

    let header = true
    for (i of splitVal) {
        let row = $('<tr>')                
        for (j of i.split('\t')) {
            let col
            if (header) {
                col = $('<th>')
            }
            else {
                col = $('<td>')
            }
            col.text(j)
            row.append(col)
        }
        table.append(row)
        header = false
    }

    let users = []
    let linenum = 0
    for (line of splitVal) {
        if (linenum > 0) {
            let usernum = 0
            for (user of line.split('\t')) {
                if (linenum == 1) {
                    users.push([user.split('(')[0].trim()])
                }
                else {
                    users[usernum].push(user.split('(')[0].trim())
                }
            }
        }
        linenum += 1
    }

    let groupno = 0
    for (group of users) {
        for (name of group) {
            if (name) {
                let header = val.split('\n')[0].split('\t')[groupno].split('(')[0].trim()
                let timeDate = header.split(',')
                let time, date
                if (timeDate.length == 1) {
                    time = timeDate[0].trim()
                    date = '{date}'
                }
                else {
                    time = timeDate[timeDate.length - 1].trim()
                    date = timeDate.slice(0, timeDate.length - 1).join(',').trim()
                }
                names.push(name.toTitleCase())
                messages.push(
                    messageFMT.replace(/{name}/g, name.toTitleCase())
                              .replace(/{time}/g, time)
                              .replace(/{date}/g, date)
                )
            }
        }
        groupno += 1
    }

    result = $('#result')
    result.val('')
    result.val(messages.join('\n----------------------\n'))
    $('#copyOne').attr('max', messages.length)
}


function resizeField(elem) {
    elem.style.width = (elem.value.length + 4) + 'ch';
}

function example(index) {
    $('#input-value').val(examples[index][0])
    $('#message-fmt').val(examples[index][1])
    inputChange()
}

function copy(index) {
    if (index) {
        index = parseInt($('#copyOne').val()) - 1;
        if (index >= messages.length) {
            $('#copyOne').val(1)
            alert('Maximum value to copy from is ' + messages.length)
        }
        else {
            let temp = $("<textarea>");
            $("body").append(temp);
            temp.val(messages[index]).select()
            document.execCommand("copy");
            temp.remove();

            $('#copyOne').val(parseInt($('#copyOne').val()) + 1)
            $('#copySelectedMessage').html('Copied ' + names[index])
            setTimeout(() => {
                elem = $('#copySelectedMessage')
                if (elem.html() == 'Copied ' + names[index]) {
                    elem.html('')
                }
            }, 1000)
        }
    }
    else {
        $('#result').select()
        document.execCommand('copy')
        $('#copyAllMessage').html('Copied All')
        setTimeout(() => {
            elem = $('#copyAllMessage')
            elem.html('')
        }, 1000)
    }
}

function reset() {
    $('#result').val('')
    $('#input-value').val('')
    $('#message-fmt').val('')
    $('.inputTable').css('display', 'none')
    $('.textAreaSingle').css('display', 'none')
}