import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StudentModel } from '../StudentModel';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  path = 'assets/Students.json';
  userForm: FormGroup;
  students: StudentModel[] = [];
  searchId: string = '';
  filteredStudents: StudentModel[] = [];
  selectedStudent: StudentModel = new StudentModel();


  ngOnInit(): void {
    this.fetchDataAndStoreLocally();
    this.getDataFromLocalStorage();
  }

  constructor(private fb: FormBuilder, private httpClient: HttpClient) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      idNumber: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }




  onSubmit() {
    console.log(this.userForm.value);
    this.addStudent();
  }
  getDataFromLocalStorage() {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      this.students = JSON.parse(storedStudents);
      this.updateFilteredStudents();
    }
  }
  private async fetchDataAndStoreLocally(): Promise<void> {
    try {
      // שלב 1: קריאה מקובץ JSON
      const data = await this.httpClient.get(this.path).toPromise();
      // שלב 2: שמירה בלוקל סטורייג'
      localStorage.setItem('students', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching or storing data:', error);
    }
  }


  search(): void {
    this.updateFilteredStudents();
  }

  updateFilteredStudents(): void {
    this.filteredStudents = this.students.filter(student =>
      student.idNumber.includes(this.searchId)
    );
  }

  fillForm(student: any): void {
    // מילוי הטופס עם נתוני הסטודנט שנבחר
    this.userForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      idNumber: student.idNumber,
      phone: student.phone,
      email: student.email
    });
    this.selectedStudent = student;
  }
  addStudent(): void {
    const newStudent = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      idNumber: this.userForm.get('idNumber')?.value,
      phone: this.userForm.get('phone')?.value,
      email: this.userForm.get('email')?.value,
    };
    this.students.push(newStudent);
    this.updateFilteredStudents();
    this.resetForm();
  }
  saveChanges(): void {
    // קבלת הנתונים מהטופס
    const updatedStudent = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      idNumber: this.userForm.get('idNumber')?.value,
      phone: this.userForm.get('phone')?.value,
      email: this.userForm.get('email')?.value,
    };

    // אם יש סטודנט שנבחר בטבלה
    const index = this.students.findIndex(student =>
      student.firstName === this.selectedStudent.firstName &&
      student.lastName === this.selectedStudent.lastName &&
      student.idNumber === this.selectedStudent.idNumber &&
      student.phone === this.selectedStudent.phone &&
      student.email === this.selectedStudent.email
    );

    // אם נמצא הסטודנט במערך, עדכון הנתונים במערך
    if (index !== -1) {
      this.students[index] = updatedStudent;
      this.updateFilteredStudents();
      // עדכון המערך ב-LocalStorage
      localStorage.setItem('students', JSON.stringify(this.students));
    }
    this.resetForm();
  }

  resetForm(): void {
    this.userForm.reset();
  }

  deleteStudent() {
    // קבלת הנתונים מהטופס
    const studentToDelete = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      idNumber: this.userForm.get('idNumber')?.value,
      phone: this.userForm.get('phone')?.value,
      email: this.userForm.get('email')?.value,
    };

    // אם יש סטודנט שנבחר בטבלה
    const index = this.students.findIndex(student =>
      student.firstName === this.selectedStudent.firstName &&
      student.lastName === this.selectedStudent.lastName &&
      student.idNumber === this.selectedStudent.idNumber &&
      student.phone === this.selectedStudent.phone &&
      student.email === this.selectedStudent.email
    );

    // אם נמצא הסטודנט במערך, מחיקת הנתונים במערך
    if (index !== -1) {
      this.students.splice(index, 1);
      this.updateFilteredStudents();
      // עדכון המערך ב-LocalStorage
      localStorage.setItem('students', JSON.stringify(this.students));
    }
    this.resetForm();
  }
  isValid(name: string): boolean {
    let control = null;
    control = this.userForm?.get(name);
    if (control) {
      return control.invalid && control.touched;
    } else {
      return true;
    }
  }
}

