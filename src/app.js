import 'jquery';
import $ from 'jquery';
import 'bootstrap';
import 'popper.js';
import swal from 'sweetalert';
import moment from 'moment';
import 'moment/locale/he';
import 'fullcalendar';
import 'fullcalendar-scheduler';

export class App {
  constructor() {
    this.message = 'שלום וברכה';
  }

  attached() {
    //this.setCalendar();
  }

  setCalendar() {
    $('#calendar').fullCalendar({
      header: {
        left: 'next,prev,today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listWeek'
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      navLinks: true,
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      isRTL: true,
      locale: 'he',
      timeFormat: 'H(:mm)',
      buttonText: {
        today: 'היום',
        month: 'חודש',
        week: 'שבוע',
        day: 'יום',
        listWeek: 'רשימה שבועית'
      },
      allDayText: 'כל היום',
      businessHours: {
        dow: [0, 1, 2, 3, 4],
        start: '09:00',
        end: '20:00',
      },
      eventClick: (event) => this.eventClick(event)
    });
  }

  eventClick(calEvent) {
    this.httpClient.fetch('order/get', {
      method: 'post',
      body: json({ id: calEvent.id })
    })
      .then(response => response.json())
      .then(res => {
        if (res.state == 1) {
          this.eventInfo = res.Orders[0];
          $('#fullCalModal').modal();
        }
      })
      .catch(error => {
        swal("אופס", "ארעה שגיאה", "warning");
      });
  }
}
