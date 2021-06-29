import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { VideMeetComponent } from './videoMeet/vide-meet/vide-meet.component';

const routes: Routes = [
  { path: "video-meet/:userId", component: VideMeetComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
