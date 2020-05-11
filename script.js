
        $('textarea').keydown(function (e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode === $.ui.keyCode.TAB) {
                e.preventDefault();

                // The one-liner that does the magic
                document.execCommand('insertText', false, "\t");
            }
        });

        String.prototype.toTitleCase = function() {
            // Converts 'apple pie' to 'Apple Pie'
            return this.replace(
                /\w*/g,
                txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        };

        function inputChange() {
            let val = $('#input-value').val()
            let messageFMT = $('#message-fmt').val()
            let table = $('#input-table')

            if (!val || !messageFMT) {
                $('.inputTable').css('display', 'none');
                $('.textAreaSingle').css('display', 'none')
                return
            }

            let splitVal = val.split('\n')

            table.html('')
            $('.inputTable').css('display', 'block');
            $('.textAreaSingle').css('display', 'block')

            let header = true;
            for (i of splitVal) {
                let row = $('<tr>')                
                for (j of i.split('\t')) {
                    let col;
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
                header = false;
            }

            let users = [];
            let linenum = 0;
            for (line of splitVal) {
                if (linenum > 0) {
                    let usernum = 0;
                    for (user of line.split("\t")) {
                        if (linenum == 1) {
                            users.push([user.split("(")[0].trim()])
                        }
                        else {
                            users[usernum].push(user.split("(")[0].trim())
                        }
                    }
                }
                linenum += 1
            }

            let messages = []
            let groupno = 0;
            for (group of users) {
                for (name of group) {
                    if (name) {
                        messages.push(messageFMT.replace(/{name}/g, name.toTitleCase()).replace(/{time}/g, val.split("\n")[0].split("\t")[groupno].split(" ")[0]))
                    }
                }
            }

            result = $('#result')
            result.val('')
            result.val(messages.join("\n----------------------\n"))
        }

        function copy() {
            $('#result').select()
            document.execCommand('copy')
        }

        function reset() {
            $('#result').val('')
            $('#input-value').val('')
            $('#message-fmt').val('')
            $('.inputTable').css('display', 'none');
            $('.textAreaSingle').css('display', 'none')
        }