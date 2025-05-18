import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  async loginWithGoogle(): Promise<void> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // Aquí haces la llamada a tu backend
      this.http.get('/api/user/profile/', {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
        console.log("PRUEBAAAAAAAAAAAAAAAAAAAAAAAAA", headers)
      }).subscribe(
        (rs) => console.log('Perfil obtenido:', rs),
        (err) => console.error('Error al obtener perfil:', err)
      );
    } catch (error) {
      console.error('Error en login con Facebook:', error);
    }
  }
}