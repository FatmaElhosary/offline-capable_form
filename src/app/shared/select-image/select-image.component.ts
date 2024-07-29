import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.scss'],
})
export class SelectImageComponent implements OnInit {
  @Input() title: any
  @Input() message: any
  @Input() hint: any
  imageName = ""
  @Output() imageSelected = new EventEmitter<any>()
  constructor() { }

  ngOnInit() { }
  selectImage(event:any) {
    this.imageName = event.target.files[0].name
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (result) => {
      this.imageSelected.emit(reader.result?.toString().replace(/.*base64,/, ""))
    };
  }
}
