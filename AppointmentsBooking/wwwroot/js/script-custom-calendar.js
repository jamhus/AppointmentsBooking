
const routeUrl = location.protocol + "//" + location.host;
$(document).ready(() => {
    $("#appointmentDate").kendoDateTimePicker({
        value: new Date(),
        dateInput: false,
    })
    initilazeCalendar();
})
const initilazeCalendar=()=> {
    try {
        var calendarEl = document.getElementById('calendar');
        if (calendarEl != null) {
           const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next,today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                selectable: true,
                editable: false,
                select: function (event) {
                    onShowModal(event, null);
                },
                eventDisplay: 'block',
                events: function (fetchInfo, successCallback, failureCallback) {
                    $.ajax({
                        url: routeUrl + '/api/Appointment/GetCalendarData?doctorId=' + $("#doctorId").val(),
                        type: 'GET',
                        dataType: 'JSON',
                        success: function (response) {
                            var events = [];
                            if (response.status === 1) {
                                $.each(response.dataenum, function (i, data) {
                                    events.push({
                                        title: data.title,
                                        description: data.description,
                                        start: data.startDate,
                                        end: data.endDate,
                                        backgroundColor: data.isDoctorApproved ? "#28a745" : "#dc3545",
                                        borderColor: "#162466",
                                        textColor: "white",
                                        id: data.id
                                    });
                                })
                            }
                            console.log(events,"events")
                            successCallback(events);
                        },
                        error: function (xhr) {
                            $.notify("Error", "error");
                        }
                    });
                },
               
            });
            calendar.render();
        }
    }
    catch (e) {
        alert(e);
    }

}


const onShowModal = (obj,isEevntDatails) => {
    $("#appointmentInput").modal("show");
}

const onCloseModal = () => {
    $("#appointmentInput").modal("hide");
}

const onSubmitForm = () => {
    const requestData = {
        Id: parseInt($('#id').val()),
        Title: $('#title').val(),
        Description: $('#description').val(),
        StartDate: $('#appointmentDate').val(),
        Duration: $('#duration').val(),
        PatientId: $('#patientId').val(),
        DoctorId: $('#doctorId').val(),
    }
    if (checkValidation(requestData)) {
        const payload = {
            "url": `${routeUrl}/api/Appointment/SaveCalendarData`,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(requestData),
        };

        $.ajax(payload).done(res => {
            if (res.status === 1 || res.status === 2) {
                $.notify(res.message, "success");
                onCloseModal();
            } else {
                $.notify(res.message, "error");
            }
        }).fail(() => {
            $.notify("Error", "error");
            onCloseModal();
        });
    }
}

const checkValidation = (data) => {
    let isValid = true;
    if (data.Title === "" || data.Title === undefined) {
        isValid = false;
        $("#title").addClass('error');
    }
    else {
        $("#title").removeClass('error');

    }
    if (data.StartDate === "" || data.StartDate === undefined) {
        isValid = false;
        $("#appointmentDate").addClass('error');
    }
    else {
        $("#appointmentDate").removeClass('error');
    }
    return isValid;
}