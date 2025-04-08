import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  logined = false;
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.logined = true;
    }
  }

}