import {Component, OnInit} from '@angular/core';
import {Contact} from './contact';
import {ContactService} from '../contact.service';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  public contactList$: Observable<Contact[]>;

  constructor(private contactService: ContactService) {
  }

  ngOnInit() {
    this.contactList$ = this.contactService.isListUpdated().pipe(
      switchMap(() => this.contactService.getContacts())
    );
  }

  public onDeleteContact(id: number): void {
    this.contactService.deleteContact(id).subscribe();
  }

}
