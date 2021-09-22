import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { UserService } from './core/services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appMode: string;

  public appPages: any[];

  constructor(
    private platform: Platform,
    private userService: UserService,
    private route: Router) {

    this.appMode = this.userService.getAppMode();
    this.platform.backButton.subscribeWithPriority(-1, () => {

      navigator['app'].exitApp();

    });
    if (this.appMode == "driver")
      this.appPages = [
        { title: 'سفر', url: '/driver-home', icon: 'car-sport' },
        { title: 'حسابداری', url: '/driver-home', icon: 'cash' },
        { title: 'سفرهای من', url: '/driver-trip-report', icon: 'refresh' },
        { title: 'تنظیمات', url: '/setting', icon: 'settings' }
      ];
    else
      this.appPages = [
        { title: 'سفر', url: '/home', icon: 'car-sport' },
        { title: 'اعتبار', url: '/folder/Outbox', icon: 'cash' },
        { title: 'سفرهای من', url: 'trip-report', icon: 'refresh' },
        { title: 'مکان های منتخب', url: 'favorite-locations', icon: 'heart-circle' },
        { title: 'تنظیمات', url: '/setting', icon: 'settings' }
      ];
  }

  logout() {
    this.userService.logOut();
    this.route.navigate(['/'], { replaceUrl: true });
  }
}
