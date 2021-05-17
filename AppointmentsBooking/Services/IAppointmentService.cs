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
        public Task<int> AddOrUpdateAppointment(AppointmentViewModel model);
        public List<AppointmentViewModel> DoctorEventsById(string doctorId);
        public List<AppointmentViewModel> PatientEventsById(string patientId);
        public AppointmentViewModel GetById(int id);
        public Task<int> DeleteAppointment(int id);
        public Task<int> ConfirmAppointment(int id);

    }
}
