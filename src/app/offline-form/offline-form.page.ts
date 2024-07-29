import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../services/utils.service';
import { UserDto } from '../models/user';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SelectImageComponent } from '../shared/select-image/select-image.component';
import { RecordVoiceComponent } from '../shared/record-voice/record-voice.component';

@Component({
  selector: 'offline-form',
  templateUrl: 'offline-form.page.html',
  styleUrls: ['offline-form.page.scss'],
})
export class OfflineForm implements OnInit {
  selectedImg: any = '';
  @ViewChild(SelectImageComponent)
  selectImageComponent: SelectImageComponent = new SelectImageComponent(null);
  @ViewChild(RecordVoiceComponent)
  recordVoiceComponent: any;
  constructor(
    private _fb: FormBuilder,
    private _utils: UtilsService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.checkOnlineStatus();
  }
  offlineForm = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    imgFile: ['', [Validators.required, this.imageValidator.bind(this)]],
    voiceInput: ['', [Validators.required]],
  });
  imageValidator(control: FormControl): { [key: string]: boolean } | null {
    const file = control.value;

    if (file) {
      const maxSize = 1 * 1024 * 1024; // 1MB
      // Decode base64 to check file size
      const decodedFileSize =
        file.length * (3 / 4) -
        (file.includes('==') ? 2 : file.includes('=') ? 1 : 0);
      if (decodedFileSize > maxSize) {
        return { fileSize: true };
      }
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/tif',
        'image/bmp',
      ];
      const fileType = file.split(';')[0].split(':')[1];
      if (!allowedTypes.includes(fileType)) {
        return { fileType: true };
      }
    }
    return null;
  }
  onSelectImg(file: any) {
    this.offlineForm.controls['imgFile'].setValue(file);
    //this.imageName= file.name;
    this.selectedImg = file;
  }
  /* receiveFileName($event: string) {
    this.imageName = $event;
  } */
  onRecordMake(base64: string) {
    this.offlineForm.controls['voiceInput'].setValue(base64);
  }

  onOfflineFormSubmit() {
    const formData = this.offlineForm.value;
    console.log('Form Submitted!', formData);

    if (navigator.onLine) {
      // this._utilsy.showLoading();
      this.sendFormDataToServer(formData);
      this._utils.displayAlert('data has been saved to server', 'success');
      // this._utils.dismissLoading();
    } else {
      this.saveFormDataLocally(formData);
      this._utils.displayAlert(
        'data has been saved localy untill your internet connection restored',
        'success'
      );
    }

    this.resetOfflineForm();
  }
  resetOfflineForm() {
    this.offlineForm.reset();
    this.selectImageComponent.clearFormField();
    this.recordVoiceComponent.clearFormField();
  }
  saveFormDataLocally(formDatafromForm: any): void {
    // console.log(this.selectedImg);

    const formData: UserDto = {
      //this.offlineForm.controls['imgFile'].value
      name: this.offlineForm.controls['name'].value ?? '',
      imgFile: {
        imageUrl: this.selectedImg,
        imgName: this.selectedImg.name,
      },
      voiceInput: this.offlineForm.controls['voiceInput'].value ?? '',
    };
    const submissions = JSON.parse(localStorage.getItem('formData') || '[]');

    submissions.push(formData);
    localStorage.setItem('formData', JSON.stringify(submissions));
  }
  sendFormDataToServer(formData: any): void {
    console.log('server data', formData);
    /*   const formDataToserver: UserDto = {
      //this.offlineForm.controls['imgFile'].value
      name: this.offlineForm.controls['name'].value ?? '',
      imgFile: {
        imageUrl: this.offlineForm.controls['imgFile'].value ?? '',
        imgName: this.imageName,
      },
      voiceInput: this.offlineForm.controls['voiceInput'].value ?? '',
    }; */
    //console.log('formDataToserver',formDataToserver);

    /*  // Adjust the URL and request options as needed
    this.http.post('https://your-server-url/upload', fileData).subscribe(
      response => {
        console.log('Data successfully sent to the server', response);
      },
      error => {
        console.error('Error sending data to the server', error);
        this.saveFormData();
      }
    ); */
  }
  checkOnlineStatus(): void {
    window.addEventListener('online', this.syncDataWithServer.bind(this));
    this.syncDataWithServer();
  }
  syncDataWithServer(): void {
    if (navigator.onLine) {
      const submissions = JSON.parse(localStorage.getItem('formData') || '[]');
      if (localStorage.getItem('formData')) {
        submissions.forEach((formData: any) => {
          this.sendFormDataToServer(formData);
          //   console.log(formData);
        });
        localStorage.removeItem('formData');
        this._utils.displayAlert(
          'local data has been saved to server',
          'success'
        );
      }
    }
  }

  ngOnDestroy() {}
}
