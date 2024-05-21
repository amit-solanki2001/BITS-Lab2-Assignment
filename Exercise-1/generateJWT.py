import jwt
import datetime
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

# Load the encrypted private key with passphrase
passphrase = "R26223"

with open("private.pem", "rb") as f:
    private_key = serialization.load_pem_private_key(
        f.read(),
        password=passphrase.encode(),  # Convert passphrase to bytes
        backend=default_backend()
    )

# Sample payload
payload = {
    "sub": "FSAD",
    "username": "Amit Solanki",
    "userID": "2023SL93102cls",
    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Expiration time
}

# Encode the payload using RS256 algorithm
token = jwt.encode(payload, private_key, algorithm="RS256")

print(token)  # Print the token (decoded from bytes to string)
