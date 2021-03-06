import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoutingService } from 'src/app/service/routing/routing.service';
import { User } from 'src/app/model/user.model';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/service/service/user/user.service';


@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {

  private searchForm: FormGroup;
  private rows: User[];
  
  constructor(public routing: RoutingService, 
              private formBuilder: FormBuilder, 
              private userService: UserService) {
    this.searchForm = this.formBuilder.group({
      search: ['',Validators.required],  
    });
  }

  ngOnInit(): void {
    this.getUnauthorizedUsers();
  }

  public getSearchForm(): FormGroup{
    return this.searchForm;
  }

  public getCols(): string[] {
    return environment.VALUE.AUTHORIZE.COLUMN;
  }

  public getRows(): User[] {
    return this.rows;
  }

  public getUnauthorizedUsers(): void {
    this.userService.getUnauthorizedUsers(0, 10).then(result => {
      this.rows = result;
    });
  }

  public authorize(username: string, rol: string): void {
    this.userService.authorizeUser(username, rol).then(result => {
      if (result) {
        window.location.reload();
      }
    });
  }

}
