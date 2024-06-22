import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
  user: any;
  fileUploadService: any;
  http: any;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }

  getUser(): void {
    this.userService.getUser().subscribe(
      (user) => {
        console.log(user);
        this.user = user; // Assign received user data to the 'user' property
      },
      (error) => {
        console.log(error);
      }
    );
  }

    // saveUser()
    // {
    //   this.userService.saveUser(this.user).subscribe(
    //     user=>{
    //       console.log(user)
    //     },
    //     error=>{
    //       console.log(error)
    //     }
    //   )
    // }

    // saveUser(): void {
    //   if (this.user) {
    //     this.user.saveUser(this.user).subscribe(
    //       (savedUser: any) => {
    //         console.log('User saved:', savedUser);
    //       },
    //       (error: any) => {
    //         console.log('Error saving user:', error);
    //       }
    //     );
    //   } else {
    //     console.log('No user data to save.');
    //   }
    // }
    file: any

    selectFile(event: any)
    {
      console.log(event);
      this.file = event.target.files[0];
      console.log(this.file);
      
    }


    uploadFile()
    {
        let formData = new FormData()
        formData.append("file",this.file);

        this.http.post('http://localhost:8080/product/upload',formData).subscribe(
          (data:any)=>{
            alert("File Uploaded Successfully");
            console.log(data);
          },
          (error:any)=>
          {
            alert("File Not Uploaded Successfully");
            console.log(error);
            
          }
        )
    }

}

