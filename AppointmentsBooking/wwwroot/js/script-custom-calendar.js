$(document).ready(()=> {
    initilazeCalendar();
})

const initilazeCalendar = () => {
   try {
        $("#calendar").fullCalendar({
            timezone: false,
            header: {
                left: 'prev,next,today',
                center: 'title',
                right: 'month ,agendaWeek, agendaDay'
            },
            selectable: true,
            editable: false,
            select: (e) => {
                onShowModal(e, null);
            }

        })
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