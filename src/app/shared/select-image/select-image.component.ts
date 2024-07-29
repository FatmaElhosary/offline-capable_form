import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.scss'],
})
export class SelectImageComponent implements OnInit {
/*   @Input() title: any
  @Input() message: any
  */
  selectedFile: any
  imageUrl: any
  @Output() imageSelected = new EventEmitter<any>();
  @Output() imageNameSelected = new EventEmitter<string>();
  constructor( private sanitizer: DomSanitizer |null, private _utils: UtilsService |null,) { }

  ngOnInit() { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      //this.offlineForm.patchValue({ imgFile: this.selectedFile });
      //Show image preview
      this._utils?.convertFileToBase64(this.selectedFile, (base64: string) => {
        this.imageSelected.emit(base64);
       this.imageNameSelected.emit(this.selectedFile.name);
       // this.offlineForm.controls['imgFile'].setValue(base64);
        this.imageUrl = this.sanitizer?.bypassSecurityTrustUrl(base64);
      });
      /*  let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
        // this.offlineForm.patchValue({ imgFile: this.imageUrl});
      };
      reader.readAsDataURL(this.selectedFile); */
    }
  }
  clearFormField(){
    this.imageUrl='';
    this.selectedFile=null;
  }
}
