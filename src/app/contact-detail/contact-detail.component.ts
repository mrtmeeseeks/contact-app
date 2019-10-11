import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {filter, pluck, switchMap} from 'rxjs/operators';
import {ContactService} from '../contact.service';
import {Contact} from '../contact-list/contact';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {

  public form: FormGroup;
  private contact: Contact;

  constructor(private route: ActivatedRoute, private contactService: ContactService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      age: new FormControl()
    });

    this.route.params.pipe(
      pluck('name'),
      switchMap((name: string) => {
        return this.contactService.getContactByName(name);
      })
    ).subscribe((contact: Contact) => {
      this.form.reset();
      if (contact) {
        this.contact = contact;
        this.form.controls.firstName.setValue(contact.firstName);
        this.form.controls.lastName.setValue(contact.lastName);
        this.form.controls.age.setValue(contact.age);
      }
    });
  }

  public save(): void {
    const contact = {
      ...this.contact,
      ...this.form.value
    };
    if (this.contact && this.contact.id) {
      this.contactService.updateContact(contact).subscribe();
    } else {
      this.contactService.createContact(contact).subscribe();
    }
  }

}
