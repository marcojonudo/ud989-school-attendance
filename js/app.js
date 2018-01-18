/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
 $(function() {

     let getRandom = function() {
         return (Math.random() >= 0.5);
     };

     let model = {
         students: [
             { name: 'Slappy the Frog', attendance: [], missedDays: 0 },
             { name: 'Lilly the Lizard', attendance: [], missedDays: 0 },
             { name: 'Paulrus the Walrus', attendance: [], missedDays: 0 },
             { name: 'Gregory the Goat', attendance: [], missedDays: 0 },
             { name: 'Adam the Anaconda', attendance: [], missedDays: 0 },
         ],
         daysNumber: 12,
         getStudents: function() {
             return this.students;
         },
         getDaysNumber: function() {
             return this.daysNumber;
         }
     };

     let octopus = {
         init: function() {
             if (!localStorage.students) {
                 model.getStudents().forEach((student) => {
                     for (let i=0; i<model.getDaysNumber(); i++) {
                         student.attendance.push(getRandom());
                     }
                 });

                 localStorage.students = JSON.stringify(model.getStudents());
             }

             view.init();
             view.render();
         },
         getLocalStorageStudents: function() {
             return localStorage.students;
         },
         getDaysNumber: function() {
             return model.getDaysNumber();
         },
         updateMissedDays: function(student, increase) {
             student.missedDays = student.missedDays + (increase == true ? 1 : -1);
             localStorage.students = JSON.stringify(model.getStudents());
         }
     };

     let view = {
         tableHead: null,
         tableBody: null,

         init: function() {
             view.tableHead = $('#tableHead');
             view.tableBody = $('#tableBody');
         },

         render: function() {
             let students = JSON.parse(octopus.getLocalStorageStudents());
             let daysNumber = octopus.getDaysNumber();
             view.setTableHead(daysNumber);
             view.setTableContent(students, daysNumber);
         },

         setTableHead: function(daysNumber) {
             let tr = $('<tr></tr>');
             let th = $('<th class="name-col"></th>').text('Student Name');
             tr.append(th);
             for (let i=0; i<daysNumber; i++) {
                 th = $('<th></th>').text(+i+1);
                 tr.append(th);
             }
             th = $('<th class="missed-col"></th>').text('Days Missed-col');
             tr.append(th);

             view.tableHead.append(tr);
         },

         setTableContent: function(students, daysNumber) {
             let tr, td, checkbox;
             students.forEach((student) => {
                 tr = $('<tr class="student"></tr>');
                 td = $(`<td class="name-col">${student.name}</td>`);
                 tr.append(td);

                 student.attendance.forEach((value) => {
                     td = $(`<td class="attend-col"></td>`);
                     checkbox = $('<input type="checkbox">');
                     checkbox.prop('checked', value == 1 ? false : true);
                     view.setCheckboxListener(student, checkbox);
                     tr.append(td.append(checkbox));
                 })

                 student.missedDays = student.attendance.filter(day => day == 0).length;
                 td = $(`<td class="missed-col">${student.missedDays}</td>`);
                 tr.append(td);

                 view.tableBody.append(tr);
             })
         },

         setCheckboxListener: function(student, checkbox) {
             checkbox.click(((actualStudent, chbox) => {
                 return function() {
                     octopus.updateMissedDays(actualStudent, chbox.prop('checked'));

                     let studentToUpdate = $.grep($('.student'), (stdnt, i) => {
                         return stdnt.firstChild.innerHTML == actualStudent.name;
                     })[0];
                     studentToUpdate.lastChild.innerHTML = actualStudent.missedDays;
                 }
             })(student, checkbox));
         }
     };

     octopus.init();
});
