$(document).ready(()=> {
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