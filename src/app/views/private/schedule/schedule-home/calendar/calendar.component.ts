import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventInput,
} from '@fullcalendar/angular';
import { SchedulingFormComponent } from '../scheduling-form/scheduling-form.component';
import { ScheduleService } from '../../schedule.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { CustomerService } from '../../../customer/customer.service';
import { WhatsAppService } from '../../../whats-app/whats-app.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  user = this.auth.getUser();

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      list: 'Lista',
    },
    allDaySlot: false,
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
    initialView: 'timeGridWeek',
    initialEvents: [],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.onInsertScheduling.bind(this),
    eventClick: this.onEditScheduling.bind(this),
    eventDrop: this.onDragAndDrop.bind(this),
    eventResize: this.onDragAndDrop.bind(this),
    selectLongPressDelay: 250,
    locale: 'pt-br',
  };

  scheduling: EventInput[] = [];
  loading = false;

  constructor(
    public dialog: MatDialog,
    private scheduleService: ScheduleService,
    private auth: AuthService,
    private router: Router,
    private utilsService: UtilsService,
    private customerService: CustomerService,
    private whatsAppService: WhatsAppService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    let hasLocalStorage = localStorage.getItem('scheduling') || '';

    if (hasLocalStorage.length) {
      let schedulingLocalStorage = JSON.parse(hasLocalStorage);
      this.calendarOptions.initialEvents = schedulingLocalStorage;
      this.loading = false;
    } else {
      this.scheduleService.getScheduling(this.user).subscribe(
        (response) => {
          response.forEach((element: any) => {
            this.scheduling.push({
              id: element.id.toString(),
              title: element.title,
              start: this.utilsService.formatStringData(element.start),
              end: this.utilsService.formatStringData(element.end),
              customer: element.paciente_id,
            });
          });

          localStorage.setItem('scheduling', JSON.stringify(this.scheduling));

          this.calendarOptions.initialEvents = this.scheduling;
        },
        (error) => {
          alert('Seu token venceu, faça login novamente');
          this.auth.logout();
          this.router.navigate(['login']);
        },
        () => {
          this.loading = false;
        }
      );

      this.customerService.getCustomer(this.user).subscribe(
        (response) => {
          localStorage.removeItem('customer');
          localStorage.setItem('customer', JSON.stringify(response));
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  onDragAndDrop(data: any) {
    let start = this.utilsService.clearStringData(data.event.startStr);
    let end = this.utilsService.clearStringData(data.event.endStr);

    const schedule = {
      id: data.event._def.publicId,
      title: data.event._def.title,
      start,
      end,
      status: true,
      login_usuario: this.auth.getUser()?.login,
      paciente_id:
        data.event._def.extendedProps.paciente_id ||
        data.event._def.extendedProps.customer,
    };

    // debugger;

    console.log(schedule);

    this.scheduleService.updateScheduling(schedule, schedule.id).subscribe(
      (result) => {
        console.log(result);

        this.scheduleService.getScheduling(this.user).subscribe((response) => {
          localStorage.removeItem('scheduling');

          localStorage.setItem('scheduling', JSON.stringify(response));

          // debugger;
        });
      },
      (error) => {
        console.log(error, 'update');
      }
    );
  }

  getScheduling(update: boolean) {
    let hasLocalStorage = localStorage.getItem('scheduling') || '';

    if (hasLocalStorage.length && !update) {
      let schedulingLocalStorage = JSON.parse(hasLocalStorage);
      this.calendarOptions.initialEvents = schedulingLocalStorage;
      this.loading = false;
      return;
    }

    this.loading = true;

    if (!hasLocalStorage.length || update) {
      this.scheduling = [];

      this.scheduleService.getScheduling(this.user).subscribe(
        (response) => {
          // debugger;
          response.forEach((element: any) => {
            this.scheduling.push({
              id: element.id.toString(),
              title: element.title,
              start: this.utilsService.formatStringData(element.start),
              end: this.utilsService.formatStringData(element.end),
              customer: element.paciente_id,
            });
          });

          localStorage.removeItem('scheduling');

          localStorage.setItem('scheduling', JSON.stringify(this.scheduling));

          this.calendarOptions.initialEvents = this.scheduling;
        },
        (error) => {
          alert('Seu token venceu, faça login novamente');
          this.auth.logout();
          this.router.navigate(['login']);
        },
        () => {
          this.loading = false;
        }
      );
    }
  }

  onInsertScheduling(selectInfo: DateSelectArg) {
    console.log(localStorage.getItem('customer')?.length);

    let customer = localStorage.getItem('customer') || '';

    if (!JSON.parse(customer).length) {
      alert('você precisa cadastrar seu primeiro cliente');

      this.router.navigate(['/clientes']);
      return;
    }
    const dialogRef = this.dialog.open(SchedulingFormComponent, {
      width: '500px',
      maxWidth: '100vw',
      data: selectInfo,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // debugger;
      if (result) {
        const date = new Date(result.date).toISOString() + '0';

        let clearDate = this.utilsService.clearStringData(date);

        let split = clearDate.split(' ');

        let start = `${split[0]} ${result.timeStart}`;
        let end = `${split[0]} ${result.timeEnd}`;

        const schedule = {
          title: result.title,
          start,
          end,
          status: true,
          login_usuario: this.auth.getUser()?.login,
          paciente_id: result.paciente_id,
        };

        this.scheduleService.postScheduling(schedule).subscribe(
          (response) => {
            // debugger;
            const calendarApi = selectInfo.view.calendar;

            calendarApi.unselect();

            calendarApi.addEvent({
              id: response.id,
              title: response.title,
              start: this.utilsService.formatStringData(start),
              end: this.utilsService.formatStringData(end),
              paciente_id: response.paciente.id,
            });

            let scheduling = {
              id: response.id,
              title: response.title,
              start: this.utilsService.formatStringData(start),
              end: this.utilsService.formatStringData(end),
              paciente_id: response.paciente.id,
            };

            this.scheduleService
              .getScheduling(this.user)
              .subscribe((response) => {
                localStorage.removeItem('scheduling');

                localStorage.setItem('scheduling', JSON.stringify(response));

                // debugger;
              });

            this.customerService.getCustomerId(response.paciente.id).subscribe(
              (customer) => {
                this.whatsAppService.getWhatsAppSession().subscribe(
                  (result) => {
                    this.whatsAppService
                      .postWhatsAppMessage({
                        sessionName: this.user?.login.slice(0, 4),
                        number: '55' + customer.telefone1,
                        text: `*[Atendente Virtual]*
Oi, ${
                          customer.nome
                        }! Foi criado um agendamento para você na data e horário: ${scheduling.start.slice(
                          8,
                          10
                        )}/${scheduling.start.slice(
                          5,
                          7
                        )}/${scheduling.start.slice(
                          2,
                          4
                        )}, às ${schedule.start.slice(
                          11,
                          16
                        )} _Caso seja um equivoco, entre em contato, respondendo esta mensagem_`,
                      })
                      .subscribe(
                        (result) => {
                          console.log(result);
                        },
                        (error) => {
                          console.log(error);
                        }
                      );
                  },
                  (error) => {
                    console.log(error);
                  }
                );
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  onEditScheduling(clickInfo: EventClickArg) {
    const dialogRef = this.dialog.open(SchedulingFormComponent, {
      width: '500px',
      maxWidth: '100vw',
      data: clickInfo.event,
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        // debugger;
        if (result?.id) {
          this.scheduleService.updateScheduling(result, result.id).subscribe(
            (result) => {
              this.getScheduling(true);
            },
            (error) => {
              console.log(error, 'update');
            }
          );
        } else {
          if (!localStorage.getItem('scheduling')?.length) {
            this.scheduleService.getScheduling(this.user).subscribe(
              (response) => {
                localStorage.setItem('scheduling', JSON.stringify(response));
              },
              (error) => {
                console.log(error);
              }
            );

            clickInfo.event.remove();

            return;
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
