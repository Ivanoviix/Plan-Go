import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: Auth, private router: Router, private http: HttpClient) {}

  async login() {
    //meter en una función y ejecutarlo cuando dejas de hacer focus en el input
    /* if (!this.email || !this.email.includes('@')) {
      this.errorMessage = 'Por favor, introduce un correo electrónico válido.';
      return;
    } */
  
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.errorMessage = error.message;
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken(); 
  
      const payload = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        first_name: firebaseUser.displayName?.split(' ')[0] || '',
        last_name: firebaseUser.displayName?.split(' ')[1] || '',
        profile_image: firebaseUser.photoURL || '',
      };
    
      // Envía los datos al backend
      this.http.post('http://localhost:8000/users/login-with-google/', payload, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }).subscribe({
        next: (rs) => {
          console.log('Usuario autenticado en Django:', rs);
          this.router.navigate(['/']); 
        },
        error: (err) => {
          console.error('Error al autenticar usuario en Django:', err);
          this.errorMessage = 'Error al autenticar usuario. Inténtalo de nuevo.';
        },
      });
    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error);
      this.errorMessage = error.message;
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
