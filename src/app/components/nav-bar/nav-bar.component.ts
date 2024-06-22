import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  public loggedIn = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loggedIn = this.loginService.isLoggedIn();
  }

  async logoutUser() {
    const { value: userLogout } = await Swal.fire({
      title: 'Are You Sure You Want to Logout?',
      icon: 'warning',
      confirmButtonText: 'Log Out',
      showCancelButton: true,
      reverseButtons: true,
      focusConfirm: true,
      focusCancel: true
    });

    if (userLogout) {
      this.loginService.loggedOut();
      this.router.navigate(['/login']);
    } else {

    }
  }
}