import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/models/user';

@Component({
  selector: 'app-show-data',
  templateUrl: './show-data.component.html',
  styleUrls: ['./show-data.component.scss'],
})
export class ShowDataComponent implements OnInit {
  userData: UserDto[]|null = null;
  constructor() {}

  ngOnInit() {
    this.loadOfflineFormData();
    console.log(this.userData);
    
  }

  loadOfflineFormData(): void {
    const savedData = localStorage.getItem('formData');
    console.log(savedData);

    if (savedData) {
      this.userData = JSON.parse(savedData);
    
    } else {
      this.userData = null;
    }
  }
}
