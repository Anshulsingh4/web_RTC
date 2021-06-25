import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './User/user/user.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RemoteUserComponent } from './remoteUser/remote-user/remote-user.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RemoteUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
