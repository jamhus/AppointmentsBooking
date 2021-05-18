
const routeUrl = location.protocol + "//" + location.host;
let calendar

$(document).ready(() => {
    $("#appointmentDate").kendoDateTimePicker({
        value: new Date(),
        dateInput: false,
        timeFormat: "HH:mm"
    });
    initilazeCalendar();
})

const initilazeCalendar = () => {
    try {
        const calendarEl = document.getElementById('calendar');
        if (calendarEl != null) {
           calendar = new FullCalendar.Calendar(calendarEl, {
               initialView: 'dayGridMonth',
               eventTimeFormat: { // like '14:30:00'
                   hour: '2-digit',
                   minute: '2-digit',
                   meridiem: false
               },
                headerToolbar: {
                    left: 'prev,next,today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                selectable: true,
                editable: false,
                select: (event) => {
                    onShowModal(event, null);
                },
               eventDisplay: 'block',
               eventClick: (info) => {
                   getEventById(info.event._def.publicId);
               },
                events: (fetchInfo, successCallback, failureCallback) => {
                    $.ajax({
                        url: routeUrl + '/api/Appointment/GetCalendarData?doctorId=' + $("#doctorId").val(),
                        type: 'GET',
                        dataType: 'JSON',
                        success: (response) => {
                            var events = [];
                            if (response.status === 1) {
                                $.each(response.dataenum, (i, data) => {
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
                            successCallback(events);
                        },
                        error: (xhr) => {
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

const onShowModal = (obj, isEevntDatails) => {
    if (isEevntDatails !== null) {
        $('#title').val(obj.title);
        $('#description').val(obj.description);
        $('#appointmentDate').val(obj.startDate);
        $('#duration').val(obj.duration);
        $('#doctorId').val(obj.doctorId);
        $('#patientId').val(obj.patientId);
        $("#lblPatientName").val(obj.patientName);
        $("#lblDoctorName").val(obj.doctorName);
        $("#lblStatus").val(obj.isDoctorApproved ? "Approved":"Pending");
        $('#id').val(obj.id);

        if (obj.isDoctorApproved) {
            $("#btnConfirm").addClass("d-none");
            $("#btnSubmit").addClass("d-none");
            $("#btnDelete").removeClass("d-none");

        }
        else {
            $("#btnSubmit").removeClass("d-none");
            $("#btnDelete").removeClass("d-none");
        }
    } else {
        $('#appointmentDate').val(obj.startStr + " " + new moment().format("hh:mm A"));
        $("#id").val(0);
        $("#btnDelete").addClass("d-none");
        $("#btnSubmit").removeClass("d-none");

    }
    $("#appointmentInput").modal("show");
}

const onCloseModal = () => {
    $("#appointmentForm")[0].reset();
    $('#title').val("");
    $('#description').val("");
    $('#id').val("");
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
                calendar.refetchEvents();
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

const getEventById = (id) => {
    const payload = {
        "url": `${routeUrl}/api/Appointment/GetById/${id}`,
        "method": "GET",
        "headers": {
            "dataTyoe": "JSON"
        },
    };

    $.ajax(payload).done(res => {
        if (res.status === 1 && res.dataenum != undefined) {
            onShowModal(res.dataenum,true);
        } else {
            $.notify(res.message, "error");
        }
    }).fail(() => {
        $.notify("Error", "error");
        onCloseModal();
    });
}

const onDoctorChange = () => {
    calendar.refetchEvents();
}

const onDeleteEvent = () => {

    const id = parseInt($("#id").val());

    const payload = {
        "url": `${routeUrl}/api/Appointment/DeleteById/${id}`,
        "method": "GET",
        "headers": {
            "dataTyoe": "JSON"
        },
    }

    $.ajax(payload).done(res => {
        if (res.status === 1) {
            $.notify(res.message, "success");
            calendar.refetchEvents();
            onCloseModal();
        } else {
            $.notify(res.message, "error");
        }
    });
}

const onConfirmEvent = () => {
    const id = parseInt($("#id").val());

    const payload = {
        "url": `${routeUrl}/api/Appointment/ConfirmById/${id}`,
        "method": "GET",
        "headers": {
            "dataTyoe": "JSON"
        },
    }

    $.ajax(payload).done(res => {
        if (res.status === 1) {
            $.notify(res.message, "success");
            calendar.refetchEvents();
        } else {
            $.notify(res.message, "error");
        }
    });
}
