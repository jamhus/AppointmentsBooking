using AppointmentsBooking.Data;
using AppointmentsBooking.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentsBooking.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly DataContext _context;
        public AppointmentService(DataContext context)
        {
            _context = context;
        }
        public List<DoctorViewModel> GetAllDoctors()
        {
            var doctors = (
                from user in _context.Users
                join userRoles in _context.UserRoles on user.Id equals userRoles.UserId
                join roles in _context.Roles.Where(r=> r.Name == Helpers.Helper.Doctor) on userRoles.RoleId equals roles.Id
                select new DoctorViewModel
                {
                    Id = user.Id,
                    Name = user.Name
                }
            ).ToList();

            return doctors;
        }

        public List<PatientViewModel> GetAllPatients()
        {
            var patients = (
                from user in _context.Users
                join userRoles in _context.UserRoles on user.Id equals userRoles.UserId
                join roles in _context.Roles.Where(r => r.Name == Helpers.Helper.Patient) on userRoles.RoleId equals roles.Id
                select new PatientViewModel
                {
                    Id = user.Id,
                    Name = user.Name
                }
            ).ToList();

            return patients;
        }
    }
}
