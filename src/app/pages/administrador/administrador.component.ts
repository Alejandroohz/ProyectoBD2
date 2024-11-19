import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

interface Carrera {
  id: number | null;
  nombre: string;
}

interface Facultad {
  id: number | null;
  nombre: string;
}

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  facultadNombre: string = '';
  carreraNombre: string = '';
  estudianteNombre: string = '';
  facultadSeleccionada: string = '';
  carreraSeleccionada: string = '';
  isLoading: boolean = false;
  carreras: Carrera[] = [];
  facultades: Facultad[] = [];

  private carreraApiUrl = 'http://localhost:8081/carrera';
  private facultadApiUrl = 'http://localhost:8081/facultad';
  private estudianteApiUrl = 'http://localhost:8081/estudiante';
  private headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadCarreras();
    this.loadFacultades();
  }

  private loadCarreras() {
    this.http.get<Carrera[]>(`${this.carreraApiUrl}/getAll`, { headers: this.headers })
      .subscribe({
        next: (data) => {
          this.carreras = data;
        },
        error: (error) => {
          this.handleError(error);
          alert('Error al cargar las carreras');
        }
      });
  }

  private loadFacultades() {
    this.http.get<Facultad[]>(`${this.facultadApiUrl}/traerTodas`, { headers: this.headers })
      .subscribe({
        next: (data) => {
          this.facultades = data;
        },
        error: (error) => {
          this.handleError(error);
          alert('Error al cargar las facultades');
        }
      });
  }

  onSubmitFacultad() {
    if (this.facultadNombre.trim()) {
      this.isLoading = true;

      const facultad: Facultad = {
        id: null,
        nombre: this.facultadNombre.trim()
      };

      this.http.post<{ message: string }>(`${this.facultadApiUrl}/createFacultad`, facultad, { headers: this.headers })
        .subscribe({
          next: (response) => {
            console.log('Respuesta del servidor:', response);
            alert(response.message || 'Facultad creada exitosamente');
            this.facultadNombre = '';
            this.loadFacultades();
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
            alert(error.error.message || 'Error al crear la facultad');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  }

  onSubmitCarrera() {
    if (this.carreraNombre.trim()) {
      this.isLoading = true;

      const carrera: Carrera = {
        id: null,
        nombre: this.carreraNombre.trim()
      };

      this.http.post<{ message: string }>(`${this.carreraApiUrl}/createCarrera`, carrera, { headers: this.headers })
        .subscribe({
          next: (response) => {
            console.log('Respuesta del servidor:', response);
            alert(response.message || 'Carrera creada exitosamente');
            this.carreraNombre = '';
            this.loadCarreras();
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
            alert(error.error.message || 'Error al crear la carrera');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  }

  onSubmitEstudiante() {
    if (this.estudianteNombre.trim() && this.facultadSeleccionada && this.carreraSeleccionada) {
      this.isLoading = true;

      const estudiante = {
        id: null,
        nombre: this.estudianteNombre.trim(),
        facultad: this.facultadSeleccionada,
        carrera: this.carreraSeleccionada
      };

      this.http.post<{ message: string }>(`${this.estudianteApiUrl}/createEstudiante`, estudiante, { headers: this.headers })
        .subscribe({
          next: (response) => {
            console.log('Estudiante creado:', response);
            alert(response.message || 'Estudiante creado exitosamente');
            this.estudianteNombre = '';
            this.facultadSeleccionada = '';
            this.carreraSeleccionada = '';
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
            alert(error.error.message || 'Error al crear el estudiante');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    } else {
      alert('Por favor, complete todos los campos requeridos');
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error completo:', error);

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      alert(`Error: ${error.error.message}`);
    } else {
      // Error del lado del servidor
      if (error.status === 0) {
        alert('No se puede conectar con el servidor. Por favor, verifica tu conexión.');
      } else {
        alert(`Error del servidor: ${error.status} - ${error.error.message || 'Algo salió mal'}`);
      }
    }

    this.isLoading = false;
  }
}
