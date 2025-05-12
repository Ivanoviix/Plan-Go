import firebase_admin
from firebase_admin import credentials, auth
import os

# Ruta segura al archivo de credenciales
cred_path = os.path.join(os.path.dirname(__file__), 'firebase-credentials.json')

# Inicializa Firebase una única vez
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)