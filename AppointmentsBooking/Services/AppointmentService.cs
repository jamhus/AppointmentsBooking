using AppointmentsBooking.Data;
using AppointmentsBooking.Models;
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

        public async Task<int> AddOrUpdateAppointment(AppointmentViewModel model)
        {
            var startDate = DateTime.Parse(model.StartDate);
            var endDate = DateTime.Parse(model.StartDate).AddMinutes(Convert.ToDouble(model.Duration));

            if (model != null && model.Id > 0)
            {
                //update
                var appointment = _context.Appointments.Find(model.Id);
                return 1;
            }
            else
            {
                // create
                Appointment appointment = new Appointment()
                {
                    Title = model.Title,
                    Description = model.Description,
                    StartDate = startDate,
                    EndDate = endDate,
                    Duration = model.Duration,
                    DoctorId = model.DoctorId,
                    PatientId = model.PatientId,
                    IsDoctorApproved = false,
                    AdminId = model.AdminId
                };
                _context.Add(appointment);
                await _context.SaveChangesAsync();
                return 2;
            }
        }

        public async Task<int> ConfirmAppointment(int id)
        {
            var appointment = _context.Appointments.FirstOrDefault(x => x.Id == id);
            if (appointment != null)
            {
                appointment.IsDoctorApproved = true;
                return await _context.SaveChangesAsync();
            }
            else
            {
                return 0;
            }
        }

        public async Task<int> DeleteAppointment(int id)
        {
            var appointment = _context.Appointments.FirstOrDefault(x => x.Id == id);
            if (appointment != null)
            {
                _context.Appointments.Remove(appointment);
                return await _context.SaveChangesAsync();
            }
            else
            {
                return 0;
            }
        }

        public List<AppointmentViewModel> DoctorEventsById(string doctorId)
        {
            return _context.Appointments.Where(x => x.DoctorId == doctorId).ToList().Select(c => new AppointmentViewModel()
            {
                Id = c.Id,
                Description = c.Description,
                StartDate = c.StartDate.ToString("yyyy-MM-dd HH:mm:ss"),
                EndDate = c.EndDate.ToString("yyyy-MM-dd HH:mm:ss"),
                Title = c.Title,
                Duration = c.Duration,
                IsDoctorApproved = c.IsDoctorApproved
            }).ToList();
        }

        public List<DoctorViewModel> GetAllDoctors()
        {
            var doctors = (
                from user in _context.Users
                join userRoles in _context.UserRoles on user.Id equals userRoles.UserId
                join roles in _context.Roles.Where(r => r.Name == Helpers.Helper.Doctor) on userRoles.RoleId equals roles.Id
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

        public AppointmentViewModel GetById(int id)
        {
            return _context.Appointments.Where(x => x.Id == id).ToList().Select(c => new AppointmentViewModel()
            {
                Id = c.Id,
                Description = c.Description,
                StartDate = c.StartDate.ToString("yyyy-MM-dd HH:mm:ss"),
                EndDate = c.EndDate.ToString("yyyy-MM-dd HH:mm:ss"),
                Title = c.Title,
                Duration = c.Duration,
                IsDoctorApproved = c.IsDoctorApproved,
                PatientId = c.PatientId,
                DoctorId = c.DoctorId,
                PatientName = _context.Users.Where(x => x.Id == c.PatientId).Select(x => x.Name).FirstOrDefault(),
                DoctorName = _context.Users.Where(x => x.Id == c.DoctorId).Select(x => x.Name).FirstOrDefault(),
            }).SingleOrDefault();
        }

        public List<AppointmentViewModel> PatientEventsById(string patientId)
        {

            return _context.Appointments.Where(x => x.PatientId == patientId).ToList().Select(c => new AppointmentViewModel()
            {
                Id = c.Id,
                Description = c.Description,
                StartDate = c.StartDate.ToString("yyyy-MM-dd HH:mm:ss"),
                EndDate = c.EndDate.ToString("yyyy-MM-dd HH:mm:ss"),
                Title = c.Title,
                Duration = c.Duration,
                IsDoctorApproved = c.IsDoctorApproved
            }).ToList();
        }
    }
}
