# Interview Scheduler
Interview Scheduler is a front end component built using React. it uses custom hooks, useReduce and useEffect to allow user to schedule an interview from a list of interviewers that are available for that day. It dynamically displays content so the scheduling function is executed in a user friendly way, while allowing multiple clients to use the app with syncrhonized information display by using webSocket.

!["Interview Scheduler"](https://github.com/tmslee/scheduler/blob/master/docs/interview-scheduler.png)

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

# Features

## days bar
- the days bar displays a selectable list of days and shows the number of spots left for each day.
- when a day has no more spots remaining that day will be greyed out
!["days bar"](https://github.com/tmslee/scheduler/blob/master/docs/days-bar.png)

## list of appointments
- list of appointments show a list of slots from 12pm to 5pm
!["appointment list"](https://github.com/tmslee/scheduler/blob/master/docs/appointment-list.png)

- if a slot has an appointment booked, it will display the appointment as the following:
!["appointment item"](https://github.com/tmslee/scheduler/blob/master/docs/appointment-item.png)

- if a slot isn't booked, the empty slot will display a button which when pressed prompts the user to the add appointment form:
!["empty appointment"](https://github.com/tmslee/scheduler/blob/master/docs/empty-appointment.png)
!["create appointment form"](https://github.com/tmslee/scheduler/blob/master/docs/create-form.png)

## add/edit/delete appointment
- hovering over an exisitng appointment will show an edit and delete button on the bottom right corner of the item:
!["appointment item hover"](https://github.com/tmslee/scheduler/blob/master/docs/appointment-item-hover.png)

- clicking edit will display the slot as an edit appointment form, displaying the information that was previously set for that appointment. this form is identical to the create form aside from the displayed information:
!["appointment edit form"](https://github.com/tmslee/scheduler/blob/master/docs/edit-form.png)

- clicking cancel at this point will display the appointment that was displayed prior to edit, or an empty appointment if you were in the process of creating a new appointment.
- clicking save will place the newly edited/created appointment in the slot you created

- clicking delete from the create/edit form will prompt the user to confirm their action:
!["confirm delete"](https://github.com/tmslee/scheduler/blob/master/docs/delete-confirm.png)
- clicking cancel will send user back to create/edit form
- clicking confirm will delete the appointment and show an empty appointment in its place

- during deleting and editing the following displays will show to let the user know that their actions have been submitted:
!["saving progress display"](https://github.com/tmslee/scheduler/blob/master/docs/saving.png)
!["deleting progress display"](https://github.com/tmslee/scheduler/blob/master/docs/deleting.png)

- if saving or deleting has failed the following errors will show in place:
!["error during saving"](https://github.com/tmslee/scheduler/blob/master/docs/error-save.png)
!["error during deleting"](https://github.com/tmslee/scheduler/blob/master/docs/error-delete.png)
- closing the error message will send you back to the create/edit form


## webSocket
- with websocket enabled, the app can handle multiple users connected to the server with synchronized rendering of the appointments
- deleting/creating/editing an appointment by one client will update the days (if spots for that day has changed) and the appointment list accordingly