import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  clientForm: FormGroup;
  isEditMode = false;
  clientId?: number;
  map: any;
  marker: any;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      tel: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      address2: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.clientId;

    if (this.isEditMode) {
      this.clientService.getClient(this.clientId!).subscribe({
        next: (client) => {
          this.clientForm.patchValue({
            name: client.name,
            tel: client.tel,
            address2: client.address2
          });
          this.initMap(client.address1.latitude, client.address1.longitude);
        },
        error: (err) => console.error('Error fetching client', err)
      });
    }
  }

  ngAfterViewInit(): void {
    if (!this.isEditMode) {
      setTimeout(() => {
        this.initMap(36.8065, 10.1815); // إحداثيات افتراضية (تونس)
      }, 100);
    }
  }

  initMap(lat: number, lng: number): void {
    // تهيئة الخريطة
    this.map = L.map(this.mapContainer.nativeElement).setView([lat, lng], 15);

    // إضافة طبقة الخريطة الأساسية من OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // إضافة علامة قابلة للسحب
    this.marker = L.marker([lat, lng], {
      draggable: true
    }).addTo(this.map);

    // حدث عند سحب العلامة
    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.updateAddress(position.lat, position.lng);
    });

    // حدث عند النقر على الخريطة
    this.map.on('click', (e: any) => {
      this.marker.setLatLng(e.latlng);
      this.updateAddress(e.latlng.lat, e.latlng.lng);
    });
  }

  updateAddress(lat: number, lng: number): void {
    // يمكنك استخدام خدمة geocoding هنا إذا أردت
    // هذا مثال بسيط بدون geocoding
    this.clientForm.patchValue({
      address2: `تحديد موقع على الخريطة - الإحداثيات: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid && this.marker) {
      const position = this.marker.getLatLng();
      const formValue = this.clientForm.value;
      
      const client: Client = {
        name: formValue.name,
        tel: formValue.tel,
        address1: {
          latitude: position.lat,
          longitude: position.lng
        },
        address2: formValue.address2
      };

      const operation = this.isEditMode
        ? this.clientService.updateClient(this.clientId!, client)
        : this.clientService.createClient(client);

      operation.subscribe({
        next: () => this.router.navigate(['/clients']),
        error: (err) => console.error('Error saving client', err)
      });
    }
  }

  get name() { return this.clientForm.get('name'); }
  get tel() { return this.clientForm.get('tel'); }
  get address2() { return this.clientForm.get('address2'); }
}