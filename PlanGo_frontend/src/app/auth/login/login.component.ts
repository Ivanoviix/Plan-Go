import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoginService } from '../../core/services/login.service'; // Importa el servicio
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { globals } from '../../core/globals';
import { AnimatedBackgroundComponent } from '../../core/animated-background/animated-background.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule, AnimatedBackgroundComponent],
  templateUrl: './login.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent {
  errorMessage = '';
  email = '';
  password = '';

  constructor(
    private auth: Auth,
    private router: Router, 
    private loginService: LoginService,
  ) {}

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      localStorage.setItem('authToken', idToken);

      this.loginService.loginWithGoogle(idToken).subscribe({
        next: () => {
          console.log('Usuario autenticado en el backend');
          this.router.navigate(['/itineraries']);
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
      const result = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();
  
      // Guarda el token en localStorage
      localStorage.setItem(globals.keys.accessToken, idToken);
  
      // Llama al servicio para autenticar con el backend
      this.loginService.loginWithEmail(idToken).subscribe({
        next: () => {
          console.log('Usuario autenticado en el backend');
          this.router.navigate(['/itineraries']);
        },
        error: (err) => {
          console.error('Error al autenticar usuario en el backend:', err);
          this.errorMessage = 'Error al autenticar usuario. Inténtalo de nuevo.';
        },
      });
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.errorMessage = error.message;
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}