import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../services/utils.service';
import { UserDto } from '../models/user';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SelectImageComponent } from '../shared/select-image/select-image.component';

@Component({
  selector: 'offline-form',
  templateUrl: 'offline-form.page.html',
  styleUrls: ['offline-form.page.scss'],
})
export class OfflineForm implements OnInit {
  imageName: string = '';
  @ViewChild(SelectImageComponent)
  selectImageComponent: SelectImageComponent=new SelectImageComponent(null,null);
  //record
  mediaRecorder: any;
  audioChunks: any[] = [];
  audioBlob: any;
  audioUrl: SafeUrl | null = null;
  isRecording = false;
  ///////////////////////
  constructor(
    private _fb: FormBuilder,
    private _utils: UtilsService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.initializeVoiceRecording();
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
  onSelectImg(base64: any) {
    this.offlineForm.controls['imgFile'].setValue(base64);
  }
  receiveFileName($event: string) {
    this.imageName = $event;
  }
  initializeVoiceRecording(): void {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);
        };
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/mpeg' });
          this._utils.convertFileToBase64(this.audioBlob, (base64: string) => {
            this.audioUrl = this.sanitizer.bypassSecurityTrustUrl(base64);
            this.offlineForm.controls['voiceInput'].setValue(base64);
            //this.saveFormData();
          });
          /*  this.audioUrl = URL.createObjectURL(this.audioBlob);
          this.offlineForm.controls['voiceInput'].setValue(this.audioBlob); */
          this.audioChunks = [];
          //this.saveFormDataLocally();
        };
      })
      .catch((error) => {
        this._utils.displayAlert('Error accessing microphone', 'Error');
        console.error('Error accessing microphone', error);
      });
  }

  startRecording() {
    try {
      if (this.mediaRecorder) {
        this.isRecording = true;
        this.mediaRecorder.start();
      }
    } catch (e) {
      this._utils.displayAlert('Please Enable accessing microphone', 'Error');
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.isRecording = false;
      this.mediaRecorder.stop();
    }
  }

  /*   playAudio(): void {
    if (this.audioUrl) {
      const audio = new Audio(this.audioUrl);
      audio.play();
    }
  } */
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
    this.audioUrl = null;
  }
  saveFormDataLocally(formDatafromForm: any): void {
    const formData: UserDto = {
      //this.offlineForm.controls['imgFile'].value
      name: this.offlineForm.controls['name'].value ?? '',
      imgFile: {
        imageUrl: this.offlineForm.controls['imgFile'].value ?? '',
        imgName: this.imageName,
      },
      voiceInput: this.offlineForm.controls['voiceInput'].value ?? '',
    };
    const submissions = JSON.parse(localStorage.getItem('formData') || '[]');

    submissions.push(formData);
    localStorage.setItem('formData', JSON.stringify(submissions));
  }

  sendFormDataToServer(formData: any): void {
    console.log('server data', formData);
    const formDataToserver: UserDto = {
      //this.offlineForm.controls['imgFile'].value
      name: this.offlineForm.controls['name'].value ?? '',
      imgFile: {
        imageUrl: this.offlineForm.controls['imgFile'].value ?? '',
        imgName: this.imageName,
      },
      voiceInput: this.offlineForm.controls['voiceInput'].value ?? '',
    };
    console.log('formDataToserver',formDataToserver);
    
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
          console.log(formData);
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
