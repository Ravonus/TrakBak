function jQPost(url, data) {
    $.post(url, data)
        .done(function (data) {
            //TODO: check to see if fail and revert text back if not... 
            if (data.err) alert('THIS WAS AN ERROR');
        });
}

function ipPost(url, data) {
    $.post(url, data)
        .done(function (data) {
            //TODO: check to see if fail and revert text back if not... 
            if (data.err) alert('THIS WAS AN ERROR');

            if (data.type && data.type === 'ip') {
                app.dspTable.forEach(function (row, index) {
                    app.dspTable[index].zoneip = data.value;
                });
            }
        });
}

function confPost(url, data) {
    $.post(url, data)
        .done(function (data) {

            if (data.err) alert('THIS WAS AN ERROR');
            app.confContents[data.file].forEach(function (line, index) {
                if (line.includes(data.key.trim())) {
                    $('#' + data.key).attr('data-last', data.value);
                    $('#' + data.key).data('last', data.value);
                    let newA = app.confContents[data.file][index].split(':');
                    newA[1] = data.value;
                    let string = newA.join(':');
                    app.confContents[data.file][index] = string;
                }
            });

        });
}

var mgSync = {}
function postApi(url, data, type) {

    $.ajax
        ({
            type: "POST",
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(data),
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success: function (data) {

                data = JSON.parse(data);


                if(type === 'mailer') {
                    
                    if(data.err) return navAlert('error', { title: 'Email sending', text: data.err });

                    $('#sendEmail').find("input, #contact_textarea").each((index, data) => console.log(data.value = ''));
                    $('#sendEmailButton').html('Send Email');

                    navAlert('info', { title: 'Email sending', text: "contact request was sent successfully. Please reply back to email if you have any questions." });


                    return;
                }

         //       console.log(type);
                // if(typeof type === 'object' && type.body) socketSocketPush({room:'5c89ea1b1f550d408dbb8f8c', action:'send', body:type.body});
                    
                

                if (data.alert) {
                    navAlert(data.alert.type, { title: data.alert.title, text: data.alert.text });
                    if (type === 'rp') {

                        window.history.replaceState({}, document.title, "/" + "");
                        userApp.showTab('panel7', true);
                        $('#userModal').modal('hide');
                    }
                }

                if (type === 'login') {
                    userApp.mgSync = data;
                    userHead.mgSync = data;
                    setCookie('jwt', data.token, 1);
                    $('#userModal').modal('hide');
                    window.history.replaceState({}, document.title, "/" + "");
                    $('#userLogin').each(function () {
                        this.reset();
                    });
                    if (userApp.mgSync.registration) {
                        navAlert('success', { title: 'Registration Successful', text: 'Please check email for registration.' });
                    } else {
                        navAlert('info', { title: 'Login Successful', text: 'Logged in successfully.' });
                        if (userApp.mgSync.user.verified && userApp.mgSync.user.verified !== '') {
                            userApp.alerts.push({
                                type: 'alert-danger', title: 'Email registration ', text: 'You must register your email before playing.', close: 'alert-dismissible', vue: "resendEmail",
                                link: {
                                    href: "#",
                                    text: "Resend registration email"
                                }
                            });
                        }
                    }

                }

                if (type === 'rp') {
                    let obj = data;
                    if (obj.success) {
                        window.history.replaceState({}, document.title, "/" + "");
                        if (obj.success !== 'Reset password successfully') {
                            userApp.mgSync.resetToken = obj.success;
                            $('#resetPW').modal('show');
                        } else {
                            $('#resetPW').modal('hide');
                            $('#userModal').modal('show')

                            navAlert('info', { title: 'Password reset successful', text: obj.success });
                        }


                    }

                }
            },
            error: function (err) {
                err = err.responseText ? JSON.parse(err.responseText) : JSON.parse(err);
                if (err.alert) {

                    navAlert(err.alert.type, { title: err.alert.title, text: err.alert.text });
                    $('#sendEmailButton').html('Send Email');
                } else {

                    if (type === 'login') {
                        navAlert('error', { title: 'Login Error', text: err.errorMsg });
                    }

                    if (type === 'rp') {

                        if (err) {
                            let obj = err.errorMsg;
                            window.history.replaceState({}, document.title, "/" + "");
                            navAlert('error', { title: 'Reset password error', text: obj.err });
                        }
                    }
                }

            }
        });
}