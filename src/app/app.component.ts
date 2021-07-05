
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project1';
  renderStartPage = false;
  constructor(private router: Router) {
    this.renderStartPage = true;
  }


  onSubmit(form: NgForm) {
    console.log(form.value)
    this.router.navigate([`/video-meet/${form.value.name}`])
    form.reset()
    this.renderStartPage = false;

  }

}