import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  fcm_token: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.fcm_token = this.userService.getFcmToken();
  }

}
