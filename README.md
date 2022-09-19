# MonitorVA
This is web application for monitoring server docker containers (Client).
## Setup
1) Define backend API URL and Firebase credentials
2) npm start

## WORK EXAMPLES
### Containers list with information

Immediately after logging in, the user can see a list of containers and a control panel.

This page is also available in the menu "Containers" ⟶ "List"

To search for containers, you can enter the name of the container and/or use sorting by parameter.

To change the states of the container, the buttons "Start container", "Stop container", "Restart container", "Pause container", "Resume container" are available. To add a container, there is a button "Add container", to remove - "Delete container".

![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img.png)

### Monitoring using realtime charts

In the menu tab "Containers" ⟶ "Monitoring" graphs of CPU and RAM usage for running containers are available

![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_1.png)
![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_2.png)

### Detail information about container

When you click on a container row, a page with detailed information about the container appears in the list.

The page shows several sections: Status, Restart Policy, Environment, Network, Notification.

Depending on whether the container is running or not, the button to open the container console will be available.

There is also a button on the page to open container logs.

In the notifications section, you can enter emails and select the states in which messages will be sent to the entered emails.
You can also toggle the notification "off-on" here.

![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_3.png)

### Edit container settings

In the edit section there is a button that, when clicked, opens a page for changing container parameters.

The Relative CPU Load, Used Memory Limit, and Number of Restarts fields can be applied to a container all at once. 

The remaining fields (container name, image name, domain name, etc.) will require the container to be recreated. If the relevant information is present in the container, it will be displayed in the fields.

Application/recreation of the container occurs when you click the "Update" and "Recreate" buttons. You can use the blue back button to go to the detailed information page.

![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_5.png)

### Email message example
![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_9.png)

### Container logs
![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_6.png)

### Container console
![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_7.png)

### Images list with information
![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_4.png)

### Settings of report

In the menu tab “Reporting” ⟶ “Report”, a page for selecting containers and parameters for the report is available

After clicking on the "Create" button, a report will be created with the selected containers.

![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_10.png)

### Example of report
![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_11.png)
![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_12.png)

### User management

In the menu tab "Users" ⟶ "Management" there is a page for registering, changing user roles and deleting.

This page is available only to administrators.

![Alt text](https://github.com/AminLexs/monitorVA-frontend/blob/master/screenshots/img_8.png)


