import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-select-version',
  templateUrl: './select-version.page.html',
  styleUrls: ['./select-version.page.scss'],
})
export class SelectVersionPage implements OnInit {

  constructor(
    private userService: UserService,
    private route: Router) { }

  ngOnInit() {
  }

  selectVersion(type) {
    if (type == 1)
      this.userService.setAppMode("driver");
    else
      this.userService.setAppMode("rider");

    this.route.navigate(['/login']);
  }
}
