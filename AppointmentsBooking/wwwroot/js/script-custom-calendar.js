const routeUrl = location.protocol + "//" + location.host;
$(document).ready(() => {
    $("#appointmentDate").kendoDateTimePicker({
        value: new Date(),
        dateInput: false
    })
    initilazeCalendar();
})

const initilazeCalendar = () => {
   try {
       var calendarEl = document.getElementById('calendar');
       if (calendarEl) {
           var calendar = new FullCalendar.Calendar(calendarEl, {
               initialView: 'dayGridMonth',
               headerToolbar: {
                   left: 'prev,next,today',
                   center: 'title',
                   right: 'dayGridMonth ,timeGridWeek, timeGridDay'
               },
               selectable: true,
               editable: false,
               select: (e) => {
                   onShowModal(e, null);
               }
           });
           calendar.render();
       }
    } catch (e) {
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
    })
}