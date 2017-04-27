import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component( {
  selector: 'home-section',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  constructor(private router: Router) {}
  query = "";

  search(term: string) {
    if (term) {
      this.router.navigate(['search'], { queryParams: { query: term } });
    }
  }
}