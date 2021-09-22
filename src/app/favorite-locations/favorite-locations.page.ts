import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorite-locations',
  templateUrl: './favorite-locations.page.html',
  styleUrls: ['./favorite-locations.page.scss'],
})
export class FavoriteLocationsPage implements OnInit {

  public favoritLocations = [
    { title: 'محل کار', address: ' فولاد مبارکه، خیابان', description: 'توضیحات' },
    { title: 'خانه', address: ' فولاد شهر خیابان', description: 'توضیحات' },
    { title: 'ساختمان اداری', address: ' فولاد مبارکه، خیابان', description: 'توضیحات' },
    { title: 'دفتر مرکزی', address: '  اصفهان، خیابان', description: 'توضیحات' }
  ];
  constructor() { }

  ngOnInit() {
  }

}
