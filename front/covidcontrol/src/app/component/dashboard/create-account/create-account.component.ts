import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoutingService } from 'src/app/service/routing/routing.service';
import { ParameterService } from 'src/app/service/service/parameters/parameter.service';
import { DocumentType } from 'src/app/model/parameters/document.model';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { NoticeService } from 'src/app/service/notice/notice.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  private adminForm: FormGroup;
  private documents: DocumentType[] = [];

  constructor(public routing: RoutingService, 
              private formBuilder: FormBuilder, 
              private parameterService: ParameterService, 
              private authenticationService: AuthenticationService, 
              private noticeService: NoticeService) {
    this.adminForm = this.formBuilder.group({
      username: ['',Validators.required],  
      email: ['',Validators.required],
      password: ['', Validators.required],
      docType: ['', Validators.required],
      docNum:['', Validators.required],
      name:['', Validators.required],
      lastname:['', Validators.required]
    });
  }  

  ngOnInit(): void {
    this.setDocumentTypes();
  }

  public getDocumentTypes(): DocumentType[] {
    return this.documents;
  }

  public setDocumentTypes(): void {
    this.parameterService.getDocumentTypes().then(result => {
      this.documents = result;
    });
  }

  public getAdminForm(): FormGroup {
    return this.adminForm;
  }

  public create(): void {
    let data: Object = this.adminForm.value;
    this.authenticationService.registerAdmin(data).then(result => {
      if (result) {
        this.noticeService.alertMessageRestart(environment.VALUE.MESSAGE.REGISTER.SUCESS);
      } else {
        this.noticeService.alertMessage(environment.VALUE.MESSAGE.REGISTER.ERROR);
      }
    });
  }

}
