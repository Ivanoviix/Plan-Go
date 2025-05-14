import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  firstName = '';
  lastName = '';
  password = '';
  repeatPassword = '';
  errorMessage = '';

  constructor(private auth: Auth, private http: HttpClient, private router: Router) {}

  async register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken(); // Obtén el token de Firebase
  
      const payload = {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
      };
  
      this.http.post('http://localhost:8000/users/register/', payload, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }).subscribe({
        next: (rs) => {
          console.log('Usuario registrado en Django:', rs);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al registrar usuario en Django:', err);
          this.errorMessage = 'Error al registrar usuario. Inténtalo de nuevo.';
        },
      });
    } catch (err: any) {
      console.error('Error al registrar usuario en Firebase:', err);
      this.errorMessage = err.message;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
