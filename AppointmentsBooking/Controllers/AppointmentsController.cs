using AppointmentsBooking.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentsBooking.Controllers
{
    public class AppointmentsController : Controller
    {
        public readonly IAppointmentService _service;
        public AppointmentsController(IAppointmentService service)
        {
            _service = service;
        }
        public IActionResult Index()
        {
            ViewBag.ListOfDoctors = _service.GetAllDoctors();
            ViewBag.ListOfPatients = _service.GetAllPatients();
            ViewBag.Duration = Helpers.Helper.GetTimeDropDown();

            return View();
        }
    }
}
