import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  uploadTimeout: any;
  file: any;
  showNote = false;
  uploadInProgress = false;
  flag = true;
  fileData: any;
  excelData: any[] = [];
  event: any;
  pageSize = 10;
  currentPage = 1;
  displayedColumns = ['productId','productName','productDesc','productPrice'];
  dataSource!: MatTableDataSource<any>;
  fileUploadSuccess = false;

  constructor(private http: HttpClient) { }

  changePageSize(event: { target: { value: number; }; }) {
    this.pageSize = event.target.value;
  }

  selectFile(event: any) {
    this.file = event.target.files[0];

    if ((this.file && this.file.name.toLowerCase().endsWith('.xlsx')) || (this.file && this.file.name.toLowerCase().endsWith('.xls'))) {
      if (this.file.size > 5 * 1024 * 1024) {
        this.showFileSizeWarning();
      } else {
        this.readExcelFile(event);
      }
    } else {
      this.showInvalidFileFormatWarning();
    }
  }

  readExcelFile(event: any) {
    let fileInput = event.target.files[0];
    if (fileInput) {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(fileInput);
      fileReader.onload = (e) => {
        var workBook = XLSX.read(fileReader.result, { type: 'binary' });
        var sheetName = workBook.SheetNames;
        console.log('sheetName : ',sheetName);
        this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName[0]]);
        if (this.excelData.length > 200) {
          this.showRecordCountExceededWarning();
        } else {
          this.flag = true;
          this.fileUploadSuccess = false;
        }
        this.excelData = this.excelData.slice(0, 200);
      };
    }
  }

  uploadFile() {
    let formData = new FormData()
    formData.append("file",this.file);
    this.flag = false;

    this.http.post('http://localhost:8080/product/upload',formData).subscribe(
      (data:any)=>{
        this.flag = true;
        this.showUploadSuccessMessage();
        clearTimeout(this.uploadTimeout);
        this.fileUploadSuccess = true;
      },
      (error: any) => {
        this.uploadInProgress = false;
        let errorMessage = 'Error uploading file.';
        if (error && error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.showUploadErrorMessage(errorMessage);
        this.setRedirectTimeout();
      }
    )
  }

  private showFileSizeWarning() {
    Swal.fire({
      title: 'Please upload a file less than 5MB.',
      text: 'File size exceeded.',
      icon: 'warning',
      confirmButtonText: 'OK'
    }).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }

  private showInvalidFileFormatWarning() {
    Swal.fire({
      title: 'Please Upload Excel File Only',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }

  private showRecordCountExceededWarning() {
    Swal.fire({
      title: 'Please upload a file with less than or equal to 200 records.',
      text: 'File contains more than 200 records.',
      icon: 'warning',
      confirmButtonText: 'OK'
    }).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  private showUploadSuccessMessage() {
    Swal.fire({
      title: 'Thank you...',
      text: 'File Uploaded Successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  private showUploadErrorMessage(errorMessage: string) {
    Swal.fire({
      title: 'Error uploading file',
      text: 'Error uploading file: ' + errorMessage,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  private setRedirectTimeout() {
    this.uploadTimeout = setTimeout(() => {
      window.location.href = '/';
    }, 10000);
    Swal.fire({
      title: 'Upload Excel Only',
      text: 'Error while uploading:- !!! Excel Sheet Data Doesnt Reads !!! Redirecting in 10 seconds.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }
}
