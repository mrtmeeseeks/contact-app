import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {Contact} from './contact-list/contact';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class ContactService {

  private apiUrl = `${environment.apiUrl}/contacts`;
  private updateList$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(private httpClient: HttpClient) {
    this.updateList$.next(true);
  }

  public isListUpdated(): Observable<boolean> {
    return this.updateList$.asObservable();
  }

  public createContact(contact: Contact): Observable<Contact> {
    contact.id = contact.id !== undefined ? contact.id : this.getRandomInt(1, 1000);
    return this.httpClient.post<Contact>(this.apiUrl, contact).pipe(
      tap(() => this.updateList$.next(true))
    );
  }

  public updateContact(contact: Contact): Observable<Contact> {
    return this.httpClient.put<Contact>(`${this.apiUrl}/${contact.id}`, contact).pipe(
      tap(() => this.updateList$.next(true))
    );
  }

  public deleteContact(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.updateList$.next(true))
    );
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public getContactByName(name: string): Observable<Contact> {
    return this.httpClient.get<Contact[]>(this.apiUrl).pipe(
      map((contacts: Contact[]) => {
        return contacts.find((c) => c.firstName === name);
      })
    );
  }

  public getContacts(): Observable<Contact[]> {
    return this.httpClient.get<Contact[]>(`${this.apiUrl}`);
  }
}
