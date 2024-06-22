import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  visible: boolean = true;
  changetype: boolean = true;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  credentials = {
    username: '',
    password: ''
  }


  ngOnInit(): void {
  }


  OnSubmit() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    if (username && password) {
      console.log('Username : ',username);
      console.log('Password : ',password);
      this.loginService.generateToken({ username, password }).subscribe(
        (response: any) => {
          console.log(response.token);
          Swal.fire({
            title: 'Thank you...',
            text: 'Login Successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.loginService.loginUser(response.token);
              window.location.href = '/dashboard';
            }
          });
        },
        (error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          let errorMessage = 'An error occurred while processing your request';

          if (error.status === 400) {
            errorMessage = 'Invalid Username or Password';
            Swal.fire({
              title: 'Check Your Username & Password',
              text: 'Invalid Username & Password',
              icon: 'error',
              confirmButtonText: 'Check'
            });
          } else {
            Swal.fire({
              title: 'Connect with Backend Server',
              imageUrl: './assets/wired-flat-1330-rest-api.gif',
              imageWidth: 100,
              imageHeight: 100,
              animation: true,
              showClass: {
                popup: 'animate__heartBeat'
              },
              confirmButtonText: 'Ok'
            });
            console.log('Connect with Backend Server');
          }
        }
      );
    } else if (username && !password) {
      Swal.fire({
        title: 'Please Enter Password',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok'
      });
    } else {
      Swal.fire({
        title: 'Please Enter Both Username & Password',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok'
      });
    }
  }

}
