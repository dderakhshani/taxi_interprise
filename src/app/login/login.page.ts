import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { ToastController } from '@ionic/angular';
import { UserModel } from '../core/models/user-model';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  fcmToken: string = "test token";
  actionWaiting: boolean = false;

  constructor(private firebaseX: FirebaseX,
    private userService: UserService,
    private toastCtrl: ToastController,
    private route: Router) {
  }

  ngOnInit() {
    this.firebaseX.getToken().then(token => {
      this.fcmToken = token;
      this.userService.setFcmToken(token);
    });
    let currentUser = this.userService.getCurrentUser();
    if (currentUser != null)
      if (currentUser.UserType == 1) {
        this.userService.setAppMode("driver");
        this.route.navigate(['/driver-home'], { replaceUrl: true });
      }
      else {
        this.userService.setAppMode("rider");
        this.route.navigate(['/home'], { replaceUrl: true });
      }

    this.loginForm = new FormGroup({
      userName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {


    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    // display form values on success
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
    const formValues = JSON.stringify(this.loginForm.value, null, 4);
    this.actionWaiting = true;
    this.userService.login(this.loginForm.value.userName, this.loginForm.value.password, this.fcmToken).then(
      (response: UserModel) => {

        this.actionWaiting = false;
        this.userService.saveUser(response);

        if (response.UserType == 1) {
          this.userService.setAppMode("driver");
          this.route.navigate(['/driver-home'], { replaceUrl: true });
        }
        else {
          this.userService.setAppMode("rider");
          this.route.navigate(['/home'], { replaceUrl: true });
        }
      }, (error: any) => {
        console.log('error on login');
        this.actionWaiting = false;
        let errorMessage: any;
        if (error != null && error.error != null && error.error.status_message != null) {
          errorMessage = error.error.status_message;
        }
        else {
          errorMessage = error;
        }
        const toast = this.toastCtrl.create({
          message: errorMessage,
          duration: 3000,
          position: 'top',
          cssClass: 'toaster-custom-class'
        });
        toast.then(data => data.present());
      }
    );
  }

}
