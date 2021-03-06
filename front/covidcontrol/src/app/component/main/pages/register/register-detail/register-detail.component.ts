import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { RoutingService } from 'src/app/service/routing/routing.service';
import { environment } from 'src/environments/environment';
import { Department } from 'src/app/model/parameters/department.model';
import { City } from 'src/app/model/parameters/city.model';
import { Neighborhood } from 'src/app/model/parameters/neighborhood.model';
import { ParameterService } from 'src/app/service/service/parameters/parameter.service';
import { DocumentType } from 'src/app/model/parameters/document.model';
import { Category } from 'src/app/model/parameters/category.model';
import { NoticeService } from 'src/app/service/notice/notice.service';

@Component({
  selector: 'app-register-detail',
  templateUrl: './register-detail.component.html',
  styleUrls: ['./register-detail.component.scss']
})
export class RegisterDetailComponent implements OnInit {

  private citizenForm: FormGroup;
  private healthEnForm: FormGroup;
  private publicEsForm: FormGroup;

  private roles: Object[] = [];
  private role: string = null;
  private registerData: Object = null;


  private departments: Department[] = [];
  private cities: Map<string, City[]> = new Map();
  private department: Department = new Department();
  private neighborhoods: Map<string, Neighborhood[]> = new Map();
  private city: City = new City();
  private documentTypes: DocumentType[] = [];
  private categories: Category[] = [];

  constructor(public routing: RoutingService, 
              private formBuilder: FormBuilder, 
              private authenticationService: AuthenticationService, 
              private parameterService: ParameterService, 
              private noticeService: NoticeService) {
     
      this.citizenForm = this.formBuilder.group({
        docType:['',Validators.required],
        email: ['',Validators.required],
        username: ['',Validators.required],
        docNum: ['',Validators.required],
        name: ['',Validators.required], 
        gender: ['',Validators.required], 
        lastname: ['', Validators.required],
        address: ['', Validators.required],
        phoneNum: ['', Validators.required],
        neighHood: ['', Validators.required],
        password: ['', Validators.required],
        city: ['',Validators.required],
        department: ['',Validators.required],
        birthdate:['',Validators.required]
    });


    this.healthEnForm = this.formBuilder.group({
      docType:['',Validators.required],
      email: ['',Validators.required],
      username: ['',Validators.required],
      docNum: ['',Validators.required],
      name: ['',Validators.required],
      totalCap:  ['',Validators.required],
      totalBeds: ['',Validators.required],
      totalRes: ['',Validators.required],
      totalDocts: ['',Validators.required],
      address: ['', Validators.required],
      phoneNum: ['', Validators.required],
      neighHood: ['', Validators.required],
      password: ['', Validators.required],
      city: ['',Validators.required],
      department: ['',Validators.required]
    });

    this.publicEsForm = this.formBuilder.group({
      docType:['',Validators.required],
      email: ['',Validators.required],
      username: ['',Validators.required],
      docNum: ['',Validators.required],
      name: ['',Validators.required],
      totalCap:  ['',Validators.required],
      address: ['', Validators.required],
      phoneNum: ['', Validators.required],
      neighHood: ['', Validators.required],
      password: ['', Validators.required],
      category: ['', Validators.required],
      city: ['',Validators.required],
      department: ['',Validators.required],
    });

    this.setRoles();
  }

  ngOnInit(): void {
    this.setRegisterData();
    this.setDepartments();
    this.setDocumentTypes();
    this.setCategories();
  }

  private setRegisterData(): void {
    this.registerData = this.authenticationService.getRegisterData();
    if (this.registerData == null) {
      this.routing.absoluteRoute("register");
    } else {
      this.patchRegisterData();
    }
  }

  private patchRegisterData(): void {
    this.publicEsForm.patchValue({
      "username": this.registerData['username'],
      "password": this.registerData['password']
    });
    this.healthEnForm.patchValue({
      "username": this.registerData['username'],
      "password": this.registerData['password']
    });
    this.citizenForm.patchValue({
      "username": this.registerData['username'],
      "password": this.registerData['password']
    });
  }

  private setRoles(): void {
    let types: string[] = Object.keys(environment.AUTHENTICATION.ROLES);
    types.forEach(element => {
      if (environment.AUTHENTICATION.ROLES[element] != environment.AUTHENTICATION.ROLES.ADMIN){
        this.roles.push({
          NAME: environment.AUTHENTICATION.ROLES[element],
          ID: element
        });
      }
    });
  }

  public getRoles(): Object[] {
    return this.roles;
  }

  public selectRoles(id: string): void {
    this.role = environment.AUTHENTICATION.ROLES[id];
    this.resetData();
  }

  public isRoleEqual(role: string): boolean {
    return this.role == role;
  }

  public getRoleName(role: string): string {
    return environment.AUTHENTICATION.ROLES[role];
  }

  public getCitizenForm(): FormGroup {
    return this.citizenForm;
  }

  public getHealthEnForm(): FormGroup{
    return this.healthEnForm;
  }

  public getPublicEsForm(): FormGroup{
    return this.publicEsForm;
  }

  public getFormAccordingToRole(): FormGroup {
    let result: FormGroup;
    switch (this.role) {
      case environment.AUTHENTICATION.ROLES.CITIZEN:
        result = this.citizenForm;
        break;
      case environment.AUTHENTICATION.ROLES.EP:
        result = this.publicEsForm;
        break;
      case environment.AUTHENTICATION.ROLES.ES:
        result = this.healthEnForm;
        break;
      default:
        result = this.citizenForm;
        break;
    }
    return result;
  }

  public register(): void {
    let form: FormGroup = this.getFormAccordingToRole();
    let values: Object = form.value;
    values['rol'] = this.role;
    this.authenticationService.register(values).then(result => {
      if (result) {
        this.noticeService.alertMessage(environment.VALUE.MESSAGE.REGISTER.SUCESS);
        this.routing.absoluteRoute("login");
      } else {
        this.noticeService.alertMessage(environment.VALUE.MESSAGE.REGISTER.ERROR);
      }
    });
  }

  public setDepartments(): void {
    this.parameterService.getDepartmentAll().then(result => {
      this.departments = result;
    })
  }

  public getDepartments(): Department[] {
    return this.departments;
  }

  public selectDepartment(departmentId: string): void {
    this.department = this.departments.filter((department) => {
      return department.getId() == departmentId;
    })[0];
    this.setCities();
  }

  public setCities(): void {
    let department: Department = this.department;
    if (!this.cities.has(department.getId())) {
      this.parameterService.getCitiesByDepartment(department).then(result => {
        this.cities.set(department.getId(), result);
      }) 
    }
  }

  public getCities(): City[] {
    return this.cities.get(this.department.getId());
  }

  public selectCity(cityId: string): void {
    this.city = this.cities.get(this.department.getId()).filter((city) => {
      return city.getId() == cityId;
    })[0];
    this.setNeighoods();
  }

  public setNeighoods(): void {
    let city: City = this.city;
    if (!this.neighborhoods.has(city.getId())) {
      this.parameterService.getNeighborhoodsByCity(city).then(result => {
        this.neighborhoods.set(city.getId(), result);
      }) 
    }
  }

  public getNeighoods(): Neighborhood[] {
    return this.neighborhoods.get(this.city.getId());
  }

  public setDocumentTypes(): void {
    this.parameterService.getDocumentTypes().then(result => {
      this.documentTypes = result;
    });
  }

  public getDocumentTypes(): DocumentType[] {
    return this.documentTypes;
  }

  public setCategories(): void {
    this.parameterService.getCategories().then(result => {
      this.categories = result;
    })
  }

  public getCategories(): Category[] {
    return this.categories;
  }

  private resetData(): void {
    this.department = new Department();
    this.city = new City();
  }

}
