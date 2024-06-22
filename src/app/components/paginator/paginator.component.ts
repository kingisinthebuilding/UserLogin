import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  uploadTimeout: any;
  file: any;
  showNote: boolean = false;
  uploadInProgress: boolean = false;
  flag = true;
  fileData: any;
  excelData: any[] = [];
  event: any;
  pageSize = 10;
  currentPage = 1;
  displayedColumns = ['productId', 'productName', 'productDesc', 'productPrice', 'Options', 'action'];
  dataSource!: MatTableDataSource<any>;
  selectedRecords: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private _liveAnnouncer: any;
  i: any;
  element: any;
  excelExportService: any;
  productId: any;
  status: any;


  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>([]);
    this.service.getData().subscribe((response: any) => {
      console.log('Excel Response ', response);
      this.excelData = response;
      this.dataSource.data = this.excelData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  FilterChange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  alert(recordIndex: number, record: any): void {

    console.log(this.alert);
    // Display a SweetAlert2 pop-up with the record details
    Swal.fire({
      title: `Record Details of ProductId:-${recordIndex + 1}`,
      html: `
        <b>Product ID:</b> ${record.productId}<br>
        <b>Product Name:</b> ${record.productName}<br>
        <b>Product Description:</b> ${record.productDesc}<br>
        <b>Product Price:</b> ${record.productPrice}<br>
      `,
      confirmButtonText: 'OK'
    });
  }

  displayRecords(record: any, recordIndex: number): void {
    // Ensure the record and its details are valid
    if (record) {

      console.log('Product ID:', record.productId);
      console.log('Product Name:', record.productName);
      console.log('Product Description:', record.productDesc);
      console.log('Product Price:', record.productPrice);

      // Display a SweetAlert2 pop-up with the record details
      Swal.fire({
        title: `Record Details of <font color="green">${record.productId}</font>`,
        html: `
          <div>
            <b>Product ID:&nbsp;</b><span style="color:red;background-color:yellow"><strong>${record.productId}</strong></span><br><br>
            <b>Product Name:&nbsp;</b><span style="color:red;background-color:yellow"><strong>${record.productName}</strong></span><br><br>
            <b>Product Description:&nbsp;</b><span style="color:red;background-color:yellow"><strong>${record.productDesc}</strong></span><br><br>
            <b>Product Price:&nbsp;</b><span style="color:red;background-color:yellow"><strong>${record.productPrice}</strong></span><br><br>
          </div>
        `,
        showClass: {
          popup: 'animate__hinge'
        },
        confirmButtonText: 'OK',
      });
    } else {
      console.error('Invalid record or details.');
    }
  }

  downloadFile(record: any) {
    // Show confirmation pop-up before downloading
    Swal.fire({
      title: 'Download...',
      text: 'Are you sure you want to download the records?',
      imageUrl: './assets/downloads.gif',
      imageWidth: 100,
      imageHeight: 100,
      animation: true,
      showCancelButton: true,
      showClass: {
        popup: 'animate__flipOutY'
      },
      confirmButtonText: 'Download',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Yes"
        this.performDownload(record);
      }
    });
  }

  performDownload(record: any) {
    const excelBuffer = this.exportRecordToExcel(record);

    const fileName = `Record_${record.productId}.xlsx`;

    const blobData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    saveAs(blobData, fileName);

    Swal.fire({
      title: 'Excel Downloaded',
      text: `Record Details of ProductId: ${record.productId}`,
      imageUrl: './assets/thumb.gif',
      imageWidth: 200,
      imageHeight: 200,
      animation: false,
      confirmButtonText: 'OK'
    });
  }

  exportRecordToExcel(record: any): any {
    const worksheet = XLSX.utils.json_to_sheet([record]);

    const workbook = {
      Sheets: {
        'Sheet': worksheet
      },
      SheetNames: ['Sheet']
    };

    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  }

  downloadAllRecords() {
    Swal.fire({
      title: 'Download All Records',
      text: 'Are you sure you want to download all records?',
      imageUrl: './assets/download.gif',
      imageWidth: 100,
      imageHeight: 100,
      animation: true,
      showCancelButton: true,
      showClass: {
        popup: 'animate__flipOutY'
      },
      confirmButtonText: 'Download',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.performDownloadAllRecords();
      }
    });
  }

  performDownloadAllRecords() {
    console.log(this.excelData); // Log the data to the console (optional)

    // Prepare all records for download by exporting to Excel
    const excelBuffer = this.exportRecordsToExcel(this.excelData);

    // Set the desired file name
    const fileName = 'AllRecords.xlsx';

    // Create a Blob with the Excel data
    const blobData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Save the file using the saveAs function
    saveAs(blobData, fileName);

    // Display a SweetAlert success message
    Swal.fire({
      title: 'Excel Downloaded',
      text: 'Downloaded Successfully',
      imageUrl: './assets/thumb.gif',
      imageWidth: 200,
      imageHeight: 200,
      animation: false,
      confirmButtonText: 'OK'
    });
  }

  exportRecordsToExcel(records: any[]): any {
    const worksheet = XLSX.utils.json_to_sheet(records);

    const workbook = {
      Sheets: {
        'Sheet': worksheet
      },
      SheetNames: ['Sheet']
    };

    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  }

  selectAllChecked = false;

  selectAllCheckboxChanged() {
    this.selectedRecords = [];

    this.dataSource.data.forEach(element => {
      element.isChecked = this.selectAllChecked;

      if (this.selectAllChecked) {
        this.selectedRecords.push(element);
      }
    });
  }

  // Method to handle changes in individual checkboxes
  checkboxChanged(element: any) {
    // Toggle the 'isChecked' property for the selected record
    element.isChecked = !element.isChecked;

    // Update the array of selected records based on the checkbox state
    if (element.isChecked) {
      this.selectedRecords.push(element);
    } else {
      // Remove the record from the array if the checkbox is unchecked
      const index = this.selectedRecords.findIndex((record: any) => record === element);
      if (index !== -1) {
        this.selectedRecords.splice(index, 1);
      }
    }
  }

  updateStatus(element: any) {

    this.service.updateProductStatus(this.productId, this.status)
      .subscribe(
        (response: any) => {
          Swal.fire({
            title: 'Activated',
            text: "Status is Active",
            icon: 'success',
            confirmButtonText: 'OK'
          })
          console.log('Product status updated successfully:', response);
        },
        (error: any) => {
          Swal.fire({
            title: 'Getting Error',
            text: "Status not Updating",
            icon: 'error',
            confirmButtonText: 'OK'
          })
          console.error('Error updating product status:', error);
        }
      );
  }
}