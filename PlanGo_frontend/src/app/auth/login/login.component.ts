import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common';
import { globals } from '../../core/globals';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule], // Agrega FormsModule aquí
  templateUrl: './login.component.html',
})
export class LoginComponent {
  errorMessage = '';
  email = '';
  password = '';

  constructor(private auth: Auth, private router: Router, private http: HttpClient) {}

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken(); // Obtén el token de Firebase
  
      localStorage.setItem('authToken', idToken); // Guarda el token en localStorage
  
      // Envía el token al backend para autenticar al usuario
      this.http.post(`${globals.apiBaseUrl}/users/login-with-google/`, {}, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }).subscribe({
        next: () => {
          console.log('Usuario autenticado en el backend');
          this.router.navigate(['/itineraries']); // Redirige a itinerarios
        },
        error: (err) => {
          console.error('Error al autenticar usuario en el backend:', err);
          this.errorMessage = 'Error al autenticar usuario. Inténtalo de nuevo.';
        },
      });
    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error);
      this.errorMessage = error.message;
    }
  }

  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/register']);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.errorMessage = error.message;
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}