using AppointmentsBooking.Models.ViewModels;
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
    public class AppointmentApiController : ControllerBase
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

        [HttpPost]
        [Route("SaveCalendarData")]
        public IActionResult SaveCalendarData([FromBody] AppointmentViewModel data)
        {
            CommonResponse<int> commonResponse = new CommonResponse<int>();
            try
            {
                commonResponse.status = _service.AddOrUpdateAppointment(data).Result;
                if(commonResponse.status == 1)
                {
                    commonResponse.message = Helpers.Helper.appointmentUpdated;
                }
                if (commonResponse.status == 2)
                {
                    commonResponse.message = Helpers.Helper.appointmentAdded;
                }

            }
            catch (Exception e)
            {

                commonResponse.message = e.Message;
                commonResponse.status = Helpers.Helper.failure_code;
            }
            return Ok(commonResponse);
        }

        [HttpGet]
        [Route("GetCalendarData")]
        public IActionResult GetCalendarData(string doctorId)
        {
            CommonResponse<List<AppointmentViewModel>> commonResponse = new CommonResponse<List<AppointmentViewModel>>();
            try
            {
                if (role == Helpers.Helper.Patient)
                {
                    commonResponse.dataenum = _service.PatientEventsById(loginUserId);
                    commonResponse.status = Helpers.Helper.success_code;
                }
                else if (role == Helpers.Helper.Doctor)
                {
                    commonResponse.dataenum = _service.DoctorEventsById(loginUserId);
                    commonResponse.status = Helpers.Helper.success_code;
                }
                else
                {
                    commonResponse.dataenum = _service.DoctorEventsById(doctorId);
                    commonResponse.status = Helpers.Helper.success_code;
                }
            }
            catch (Exception e)
            {

                commonResponse.message = e.Message;
                commonResponse.status = Helpers.Helper.failure_code;
            }

            return Ok(commonResponse);
        }
    }
}
