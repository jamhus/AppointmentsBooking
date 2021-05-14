using AppointmentsBooking.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentsBooking.Services
{
    public interface IAppointmentService
    {
        public List<DoctorViewModel> GetAllDoctors();
        public List<PatientViewModel> GetAllPatients();

    }
}
