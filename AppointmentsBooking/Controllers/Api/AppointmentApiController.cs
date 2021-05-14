using AppointmentsBooking.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AppointmentsBooking.Controllers.Api
{
    [Route("api/Appointment")]
    [ApiController]
    public class AppointmentApiController : Controller
    {
        private readonly IAppointmentService _service;
        private readonly IHttpContextAccessor _accessor;

        private readonly string loginUserId;
        private readonly string role;
        public AppointmentApiController(IAppointmentService service, IHttpContextAccessor accessor)
        {
            _service = service;
            _accessor = accessor;
            loginUserId = _accessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            role = _accessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
