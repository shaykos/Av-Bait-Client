import 'jquery';
import $ from 'jquery';
import 'bootstrap';
import 'popper.js';
import swal from 'sweetalert';
import moment from 'moment';
import 'moment/locale/he';
/*import 'fullcalendar';
import 'fullcalendar-scheduler';*/

import { HttpClient } from 'aurelia-fetch-client';

export class App {
  constructor(HttpClient) {
    moment.locale('he');
    this.httpClient = HttpClient;
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

  configureRouter(config, router) {
    config.title = 'אב הבית';
    config.addAuthorizeStep(AuthorizeStep);

    const handleUnknownRoutes = () => {
      return { route: 'not-found', redirect: '404' };
    }

    config.mapUnknownRoutes(handleUnknownRoutes);

    config.map([
      { route: '', redirect: 'login' },
      { route: 'login', name: 'login', moduleId: './admin/login/login', title: 'התחבר' },
      { route: 'dashboard', name: 'dashboard', moduleId: './admin/dashboard/dashboard', title: 'ראשי', settings: { auth: true } },
      { route: 'orders', name: 'orders', moduleId: './admin/orders/orders', title: 'קריאות', settings: { auth: true } },
      { route: 'order/new', name: 'add-order', moduleId: './admin/add-order/add-order', title: 'יצירת קריאה חדשה', settings: { auth: true } },
      { route: 'order/edit/:id', name: 'edit-order', moduleId: './admin/edit-order/edit-order', title: 'עדכון קריאה', settings: { auth: true } },
      { route: 'order/details/:id', name: 'order-details', moduleId: './admin/order-details/order-details', title: 'פרטי קריאה', settings: { auth: true } },
      { route: 'calendar', name: 'calendar', moduleId: './admin/calendar/calendar', title: 'יומנים', settings: { auth: true } },
      { route: 'companies', name: 'companies', moduleId: './admin/companies/companies', title: 'חברות ביטוח', settings: { auth: true, forRole: 1 } },
      { route: 'company/new', name: 'add-company', moduleId: './admin/add-company/add-company', title: 'הוספת חברת ביטוח', settings: { auth: true, forRole: 1 } },
      { route: 'handymen', name: 'handymen', moduleId: './admin/handymen/handymen', title: 'בעלי מקצוע', settings: { auth: true, forRole: 1 } },
      { route: 'handyman/new', name: 'add-handyman', moduleId: './admin/add-handyman/add-handyman', title: 'הוספת בעל מקצוע', settings: { auth: true, forRole: 1 } },
      { route: 'handyman/edit/:id', name: 'edit-handyman', moduleId: './admin/edit-handyman/edit-handyman', title: 'עדכון פרטי בעל מקצוע', settings: { auth: true, forRole: 1 } },
      { route: 'categories', name: 'categories', moduleId: './admin/categories/categories', title: 'ניהול קטגוריות ותקלות', settings: { auth: true, forRole: 1 } },
      { route: '404', name: '404', moduleId: './admin/not-found/not-found', title: '404' }
    ]);

    this.router = router;
  }
}


class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      var isLoggedIn = (sessionStorage.getItem('user') != null);
      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'));
      }
    }

    if(navigationInstruction.getAllInstructions().some(i => i.config.settings.forRole)){
      let user = JSON.parse(sessionStorage.getItem('user'));
      if(navigationInstruction.config.settings.forRole != user.roleId)
      return next.cancel(new Redirect('dashboard'));
    }

    return next();
  }
}
